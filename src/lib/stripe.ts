import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_resuma_placeholder", {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  appInfo: {
    name: "Resuma",
    version: "1.0.0",
  },
});

export const PRO_PLAN = {
  name: "Resuma PRO",
  description: "Unlimited ATS-ready resumes, premium themes, public sharing, and analytics.",
  price: "$1.58",
  pricePhp: "₱99",
  interval: "month",
};
