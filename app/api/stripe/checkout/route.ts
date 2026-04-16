import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  autochat: process.env.STRIPE_AUTOCHAT_PRICE_ID!,
  mailpilot: process.env.STRIPE_MAILPILOT_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  const { product, email } = await req.json();

  const priceId = PRICE_IDS[product];
  if (!priceId) {
    return NextResponse.json({ error: "Ungültiges Produkt" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/${product}`,
    metadata: { product },
  });

  return NextResponse.json({ url: session.url });
}
