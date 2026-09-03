import Stripe from "stripe";

// Falls back to a placeholder at build time so the app compiles without
// Stripe configured; route handlers check STRIPE_SECRET_KEY themselves
// before making real calls, so a real request never reaches this fallback.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-08-26.dahlia",
});
