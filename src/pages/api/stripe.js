import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    // res.json(req.body);
    try {
      const session = await stripe.checkout.sessions.create(req.body);

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: "Error creating checkout session",errortext:err });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}