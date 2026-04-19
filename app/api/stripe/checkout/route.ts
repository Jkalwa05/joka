import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  autochat: process.env.STRIPE_AUTOCHAT_PRICE_ID!,
  mailpilot: process.env.STRIPE_MAILPILOT_PRICE_ID!,
  bundle: process.env.STRIPE_BUNDLE_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    const { product, email, name, businessContact, numberType, trial } = await req.json();

    const priceId = PRICE_IDS[product];
    if (!priceId) {
      console.error("[stripe/checkout] Ungültiges/unkonfiguriertes Produkt:", product);
      return NextResponse.json({ error: "Ungültiges Produkt" }, { status: 400 });
    }

    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      console.error("[stripe/checkout] NEXTAUTH_URL ist nicht gesetzt");
      return NextResponse.json({ error: "Serverkonfiguration fehlt" }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      ...(trial ? { subscription_data: { trial_period_days: 30 } } : {}),
      success_url: `${baseUrl}/onboarding?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
      cancel_url: `${baseUrl}/bestellen?produkt=${product}${trial ? '&trial=1' : ''}`,
      metadata: { product, name: name || '', businessContact: businessContact || '', numberType: numberType || '' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] Fehler:", err);
    return NextResponse.json({ error: "Checkout konnte nicht gestartet werden. Bitte später erneut versuchen." }, { status: 500 });
  }
}
