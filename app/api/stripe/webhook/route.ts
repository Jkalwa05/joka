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
  console.log("email:", email, "product:", product);
  if (!email || !product) {
    console.error("Fehlende Daten — email:", email, "product:", product);
    return;
  }

  const customer = await prisma.customer.upsert({
    where: { email },
    update: {
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
    },
    create: {
      email,
      name: email.split("@")[0],
      stripeCustomerId: session.customer as string,
      subscriptionStatus: "ACTIVE",
    },
  });

  // Produkt-Config anlegen falls noch nicht vorhanden
  if (product === "autochat") {
    await prisma.autoChatConfig.upsert({
      where: { customerId: customer.id },
      update: {},
      create: { customerId: customer.id },
    });
  } else if (product === "mailpilot") {
    await prisma.mailPilotConfig.upsert({
      where: { customerId: customer.id },
      update: {},
      create: { customerId: customer.id },
    });
  }
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
