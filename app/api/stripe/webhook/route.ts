import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

/**
 * Finds an existing account by email (via the mirrored profiles.email
 * column), or creates a new one and invites the person by email so they
 * can set a password and log in later. Either way, buying a course never
 * blocks on having an account first — this only runs after payment
 * succeeds, purely so the buyer has somewhere to come back to.
 */
async function findOrCreateGuestAccount(
  supabase: ReturnType<typeof createServiceClient>,
  email: string
): Promise<string | null> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) return existingProfile.id;

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/my-courses`,
  });

  if (error || !data.user) {
    // Most likely cause: the email is already registered but somehow
    // didn't have a profiles row yet — nothing more we can safely do here
    // without risking a duplicate/orphaned account.
    return null;
  }

  await supabase.from("profiles").insert({
    id: data.user.id,
    name: email.split("@")[0],
    email,
  });
  await supabase.from("privacy_settings").insert({ user_id: data.user.id });

  return data.user.id;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Two different checkout flows land here: the TALISM+ subscription
      // (metadata.supabase_user_id) and one-off course purchases
      // (metadata.type === "course_purchase"). Branch on that.
      if (session.metadata?.type === "course_purchase") {
        const { course_id, buyer_id, amount_cents, platform_fee_cents } =
          session.metadata;
        const amount = Number(amount_cents);
        const platformFee = Number(platform_fee_cents);

        // Logged-in purchase: buyer_id is already known.
        // Guest purchase: buyer_id is empty — find-or-create a lightweight
        // account from the email Stripe collected during checkout, so the
        // buyer can come back later and see what they bought without
        // ever having filled out a signup form.
        let userId = buyer_id || null;

        if (!userId) {
          const email = session.customer_details?.email;
          if (email) {
            userId = await findOrCreateGuestAccount(supabase, email);
          }
        }

        if (userId) {
          await supabase.from("course_purchases").insert({
            user_id: userId,
            course_id,
            stripe_checkout_session_id: session.id,
            amount_cents: amount,
            platform_fee_cents: platformFee,
            coach_earnings_cents: amount - platformFee,
          });
        }
        break;
      }

      const userId = session.metadata?.supabase_user_id;
      if (userId) {
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
