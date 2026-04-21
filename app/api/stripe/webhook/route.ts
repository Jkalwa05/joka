import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { escapeHtml } from "@/lib/security";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature ungültig" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("checkout.session.completed email:", session.customer_email, "product:", session.metadata?.product);
      try {
        await handleCheckoutCompleted(session);
        console.log("handleCheckoutCompleted OK");
      } catch (err) {
        console.error("handleCheckoutCompleted FEHLER:", err);
        return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(sub);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email ?? session.customer_details?.email;
  const product = session.metadata?.product;
  const name = session.metadata?.name || email?.split("@")[0] || "Unbekannt";
  const businessContact = session.metadata?.businessContact || "";
  console.log("email:", email, "product:", product, "businessContact:", businessContact);
  if (!email || !product) {
    console.error("Fehlende Daten — email:", email, "product:", product);
    return;
  }

  const numberType = session.metadata?.numberType
  // Onboarding-Token generieren und direkt mit dem upsert schreiben (spart einen DB-Roundtrip)
  const inboxToken = crypto.randomBytes(32).toString("hex");
  const inboxTokenExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 Jahr
  const customer = await prisma.customer.upsert({
    where: { email },
    update: {
      name,
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
      inboxToken,
      inboxTokenExpiry,
    },
    create: {
      email,
      name,
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
      inboxToken,
      inboxTokenExpiry,
    },
  });

  if (product === "autochat" || product === "bundle") {
    await prisma.autoChatConfig.upsert({
      where: { customerId: customer.id },
      update: { phoneNumber: businessContact || undefined },
      create: { customerId: customer.id, phoneNumber: businessContact || undefined },
    });
  }
  if (product === "mailpilot" || product === "bundle") {
    await prisma.mailPilotConfig.upsert({
      where: { customerId: customer.id },
      update: {},
      create: { customerId: customer.id },
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeBusinessContact = escapeHtml(businessContact) || "–";

  // Kunden-Willkommensmail für MailPilot
  if (product === "mailpilot") {
    const onboardingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding?session_id=${session.id}&product=mailpilot`;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "joka.chat <noreply@joka.chat>",
        to: email,
        subject: "Willkommen bei MailPilot – jetzt einrichten",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem">
            <h2 style="color:#0f172a;margin-bottom:0.25rem">Willkommen, ${safeName}! 👋</h2>
            <p style="color:#64748b;margin-top:0">Dein MailPilot-Abo ist aktiv. Klick unten, um dein Passwort festzulegen und Gmail zu verbinden.</p>
            <div style="background:#f0fdfa;border:2px solid #99f6e4;border-radius:14px;padding:1.5rem;margin:1.5rem 0">
              <p style="color:#0d9488;font-weight:700;margin:0 0 0.75rem 0;font-size:1rem">Jetzt einrichten</p>
              <p style="color:#0f766e;font-size:0.9rem;margin:0 0 1rem 0">Passwort festlegen und Gmail verbinden – dauert 2 Minuten.</p>
              <a href="${onboardingLink}" style="display:inline-block;background:#006266;color:white;padding:0.75rem 1.5rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.95rem">Einrichten →</a>
            </div>
            <p style="color:#94a3b8;font-size:0.82rem">Fragen? <a href="mailto:joka.chat.business@gmail.com" style="color:#006266">joka.chat.business@gmail.com</a></p>
          </div>
        `,
      }),
    }).catch((err) => console.error("MailPilot-Willkommensmail fehlgeschlagen:", err));
  }

  // Kunden-Willkommensmail für AutoChat oder Bundle
  if (product === "autochat" || product === "bundle") {
    const onboardingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/autochat?token=${inboxToken}`;
    const passwordLink = `${process.env.NEXT_PUBLIC_BASE_URL}/passwort-setzen?token=${inboxToken}`;
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "joka.chat <noreply@joka.chat>",
        to: email,
        subject: "Willkommen bei AutoChat – jetzt einrichten",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem">
            <h2 style="color:#0f172a;margin-bottom:0.25rem">Willkommen, ${safeName}! 👋</h2>
            <p style="color:#64748b;margin-top:0">Dein AutoChat-Abo ist aktiv. Jetzt fehlt nur noch eines: deine Business-Infos.</p>

            <div style="background:#f0fdfa;border:2px solid #99f6e4;border-radius:14px;padding:1.5rem;margin:1.5rem 0">
              <p style="color:#0d9488;font-weight:700;margin:0 0 0.75rem 0;font-size:1rem">Schritt 1 – Deine Infos hinterlegen</p>
              <p style="color:#0f766e;font-size:0.9rem;margin:0 0 1rem 0">Trag einmalig deine Öffnungszeiten, Preise und Leistungen ein. AutoChat antwortet dann automatisch damit.</p>
              <a href="${onboardingLink}" style="display:inline-block;background:#006266;color:white;padding:0.75rem 1.5rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.95rem">Jetzt einrichten →</a>
            </div>

            <div style="background:#f8f9fa;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">
              <p style="color:#0f172a;font-weight:700;margin:0 0 0.5rem 0;font-size:0.95rem">Schritt 2 – Passwort setzen</p>
              <p style="color:#64748b;font-size:0.85rem;margin:0 0 0.75rem 0">Richte einmalig dein Passwort ein – danach kannst du dich jederzeit unter joka.chat/anmelden einloggen.</p>
              <a href="${passwordLink}" style="display:inline-block;background:#f1f5f9;color:#0f172a;padding:0.6rem 1.2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.85rem">Passwort setzen →</a>
            </div>

            <p style="color:#94a3b8;font-size:0.82rem">Fragen? Schreib uns einfach: <a href="mailto:joka.chat.business@gmail.com" style="color:#006266">joka.chat.business@gmail.com</a></p>
          </div>
        `,
      }),
    }).catch((err) => console.error("Kunden-Willkommensmail fehlgeschlagen:", err));
  }

  const produktLabel = product === "autochat" ? "AutoChat (€39/Monat)" : product === "mailpilot" ? "MailPilot (€29/Monat)" : "AutoChat + MailPilot Kombi (€49/Monat)";
  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "joka.chat <noreply@joka.chat>",
      to: "joka.chat.business@gmail.com",
      subject: `🎉 Neuer Kunde: ${safeName} – ${produktLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h2 style="color:#0f172a;margin-bottom:0.25rem">🎉 Neuer Kunde!</h2>
          <p style="color:#64748b;margin-top:0">Ein neues Abonnement wurde abgeschlossen.</p>

          <table style="border-collapse:collapse;font-size:15px;width:100%;margin-bottom:1.5rem">
            <tr><td style="padding:8px 16px 8px 0;color:#64748b;width:120px">Name</td><td><strong>${safeName}</strong></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">E-Mail</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">Produkt</td><td><strong style="color:#006266">${produktLabel}</strong></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">Kontakt</td><td><strong>${safeBusinessContact}</strong></td></tr>
          </table>

          ${(product === "autochat" || product === "bundle") ? (numberType === "new" || product === "bundle" ? `
          <div style="background:#fef3c7;border:2px solid #fcd34d;border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">
            <h3 style="color:#92400e;margin:0 0 1rem 0">📱 Neue WhatsApp-Nummer für Kunden einrichten</h3>
            <p style="color:#78350f;margin:0 0 0.75rem 0;font-size:14px">Der Kunde möchte eine <strong>neue Nummer</strong> – er hat keine eigene angegeben.</p>
            <ol style="color:#78350f;font-size:14px;margin:0;padding-left:1.25rem;line-height:2">
              <li>Kaufe eine virtuelle Nummer bei <a href="https://satellite.me" style="color:#92400e;font-weight:700">satellite.me →</a> (~€5/Monat, kein Gewerbe nötig, sofort verfügbar)</li>
              <li>Registriere die Nummer in deinem Meta Business Portfolio als neue WhatsApp Business-Nummer</li>
              <li>Trage <strong>phoneNumberId</strong>, <strong>accessToken</strong> und <strong>businessName</strong> in Supabase unter AutoChatConfig für diesen Kunden ein</li>
              <li>Schicke dem Kunden (<a href="mailto:${safeEmail}" style="color:#92400e">${safeEmail}</a>) eine E-Mail mit seiner neuen Nummer</li>
            </ol>
          </div>
          ` : `
          <div style="background:#fffbeb;border:2px solid #fcd34d;border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">
            <h3 style="color:#92400e;margin:0 0 1rem 0">⚠️ AutoChat manuell einrichten – Anleitung</h3>
            <p style="color:#78350f;margin:0 0 0.75rem 0;font-size:14px">Der Kunde hat seine WhatsApp-Nummer <strong>${safeBusinessContact}</strong> angegeben. Gehe jetzt so vor:</p>
            <ol style="color:#78350f;font-size:14px;margin:0;padding-left:1.25rem;line-height:2">
              <li>Öffne das Terminal im joka.chat-Projektordner und führe aus:<br><code style="background:#fef3c7;padding:2px 6px;border-radius:4px">npx prisma studio</code></li>
              <li>Browser öffnet sich auf <strong>localhost:5555</strong></li>
              <li>Klicke auf <strong>AutoChatConfig</strong></li>
              <li>Finde den Eintrag mit der Kundennummer <strong>${safeBusinessContact}</strong></li>
              <li>Trage ein:<br>
                &nbsp;&nbsp;• <strong>phoneNumberId</strong>: Die Meta Phone Number ID der Kundennummer (bekommst du nach WhatsApp Business Onboarding des Kunden)<br>
                &nbsp;&nbsp;• <strong>accessToken</strong>: Den permanenten System User Token aus dem Meta Business Portfolio<br>
                &nbsp;&nbsp;• <strong>businessName</strong>: Name des Unternehmens (aus Onboarding)</li>
              <li>Klicke <strong>Save 1 change</strong></li>
              <li>Ab sofort antwortet AutoChat auf Nachrichten dieser Nummer automatisch ✓</li>
            </ol>
            <p style="color:#92400e;font-size:13px;margin-top:1rem;margin-bottom:0">💡 Tipp: Ruf den Kunden kurz an um die Verbindung zu bestätigen und teste mit einer Testnachricht.</p>
          </div>
          `) : `
          <div style="background:#f0fdfa;border:2px solid #99f6e4;border-radius:12px;padding:1rem 1.5rem;margin-bottom:1.5rem">
            <p style="color:#0d9488;font-weight:600;margin:0">✓ MailPilot läuft vollautomatisch nach Google OAuth. Keine Aktion nötig.</p>
          </div>
          `}
          ${product === "bundle" ? `
          <div style="background:#f0fdfa;border:2px solid #99f6e4;border-radius:12px;padding:1rem 1.5rem;margin-bottom:1.5rem">
            <p style="color:#0d9488;font-weight:600;margin:0 0 0.4rem 0">✓ MailPilot (Bundle) – läuft nach Google OAuth. Kunde verbindet Gmail selbst.</p>
          </div>
          ` : ''}

          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin?key=${process.env.ADMIN_KEY}" style="background:#006266;color:white;padding:0.6rem 1.2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">Admin Dashboard →</a>
            <a href="https://dashboard.stripe.com/customers" style="background:#f1f5f9;color:#0f172a;padding:0.6rem 1.2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">Stripe Dashboard →</a>
          </div>
        </div>
      `,
    }),
  }).catch((err) => console.error("Benachrichtigungs-E-Mail fehlgeschlagen:", err));
}

async function handleSubscriptionCanceled(sub: Stripe.Subscription) {
  await prisma.customer.updateMany({
    where: { stripeCustomerId: sub.customer as string },
    data: { subscriptionStatus: "CANCELED" },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await prisma.customer.updateMany({
    where: { stripeCustomerId: invoice.customer as string },
    data: { subscriptionStatus: "PAST_DUE" },
  });
}
