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
        <h2>Neuer Kunde bei Joka!</h2>
        <table style="border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Name</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">E-Mail</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Produkt</td><td><strong>${produktLabel}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Kontakt</td><td>${businessContact || "–"}</td></tr>
        </table>
        ${product === "autochat" ? "<p style='margin-top:1rem;color:#d97706;font-weight:600'>⚠️ AutoChat einrichten: phoneNumberId + accessToken manuell in DB eintragen.</p>" : "<p style='margin-top:1rem;color:#0d9488;font-weight:600'>✓ MailPilot läuft automatisch nach Google OAuth.</p>"}
        <p style="margin-top:1rem"><a href="https://joka.chat/admin?key=${process.env.ADMIN_KEY}" style="background:#006266;color:white;padding:0.6rem 1.2rem;border-radius:50px;text-decoration:none;font-weight:600">Admin Dashboard →</a></p>
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
