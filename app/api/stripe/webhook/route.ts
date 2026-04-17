import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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
  const customer = await prisma.customer.upsert({
    where: { email },
    update: {
      name,
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
    },
    create: {
      email,
      name,
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
    },
  });

  if (product === "autochat") {
    await prisma.autoChatConfig.upsert({
      where: { customerId: customer.id },
      update: { phoneNumber: businessContact || undefined },
      create: { customerId: customer.id, phoneNumber: businessContact || undefined },
    });
  } else if (product === "mailpilot") {
    await prisma.mailPilotConfig.upsert({
      where: { customerId: customer.id },
      update: {},
      create: { customerId: customer.id },
    });
  }

  const produktLabel = product === "autochat" ? "AutoChat (€39/Monat)" : "MailPilot (€29/Monat)";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Joka <onboarding@resend.dev>",
      to: "joka.chat.business@gmail.com",
      subject: `🎉 Neuer Kunde: ${name} – ${produktLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem">
          <h2 style="color:#0f172a;margin-bottom:0.25rem">🎉 Neuer Kunde!</h2>
          <p style="color:#64748b;margin-top:0">Ein neues Abonnement wurde abgeschlossen.</p>

          <table style="border-collapse:collapse;font-size:15px;width:100%;margin-bottom:1.5rem">
            <tr><td style="padding:8px 16px 8px 0;color:#64748b;width:120px">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">E-Mail</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">Produkt</td><td><strong style="color:#006266">${produktLabel}</strong></td></tr>
            <tr><td style="padding:8px 16px 8px 0;color:#64748b">Kontakt</td><td><strong>${businessContact || "–"}</strong></td></tr>
          </table>

          ${product === "autochat" ? (numberType === "new" ? `
          <div style="background:#fef3c7;border:2px solid #fcd34d;border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">
            <h3 style="color:#92400e;margin:0 0 1rem 0">📱 Neue WhatsApp-Nummer für Kunden einrichten</h3>
            <p style="color:#78350f;margin:0 0 0.75rem 0;font-size:14px">Der Kunde möchte eine <strong>neue Nummer</strong> – er hat keine eigene angegeben.</p>
            <ol style="color:#78350f;font-size:14px;margin:0;padding-left:1.25rem;line-height:2">
              <li>Kaufe eine virtuelle Nummer (z.B. <a href="https://www.sipgate.de" style="color:#92400e">sipgate.de</a>, ~€3/Monat oder einmalig €5 Prepaid)</li>
              <li>Registriere die Nummer in deinem Meta Business Portfolio als neue WhatsApp Business-Nummer</li>
              <li>Trage <strong>phoneNumberId</strong>, <strong>accessToken</strong> und <strong>businessName</strong> in Supabase unter AutoChatConfig für diesen Kunden ein</li>
              <li>Schicke dem Kunden (<a href="mailto:${email}" style="color:#92400e">${email}</a>) eine E-Mail mit seiner neuen Nummer</li>
            </ol>
          </div>
          ` : `
          <div style="background:#fffbeb;border:2px solid #fcd34d;border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">
            <h3 style="color:#92400e;margin:0 0 1rem 0">⚠️ AutoChat manuell einrichten – Anleitung</h3>
            <p style="color:#78350f;margin:0 0 0.75rem 0;font-size:14px">Der Kunde hat seine WhatsApp-Nummer <strong>${businessContact}</strong> angegeben. Gehe jetzt so vor:</p>
            <ol style="color:#78350f;font-size:14px;margin:0;padding-left:1.25rem;line-height:2">
              <li>Öffne das Terminal im Joka-Projektordner und führe aus:<br><code style="background:#fef3c7;padding:2px 6px;border-radius:4px">npx prisma studio</code></li>
              <li>Browser öffnet sich auf <strong>localhost:5555</strong></li>
              <li>Klicke auf <strong>AutoChatConfig</strong></li>
              <li>Finde den Eintrag mit der Kundennummer <strong>${businessContact}</strong></li>
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

          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <a href="https://joka.chat/admin?key=${process.env.ADMIN_KEY}" style="background:#006266;color:white;padding:0.6rem 1.2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">Admin Dashboard →</a>
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
