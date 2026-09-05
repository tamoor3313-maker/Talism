import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// TALISM's cut of every course sale. Documented here as the single source
// of truth — change this to adjust the split platform-wide.
export const PLATFORM_FEE_PERCENT = 20;

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server" },
      { status: 500 }
    );
  }

  const { courseId } = await request.json();

  // Buying a course never requires an account. If someone's logged in we
  // attach the purchase to them directly; if not, Stripe collects their
  // email during checkout itself, and the webhook creates a lightweight
  // account afterward so they can come back and view what they bought.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price_cents, status")
    .eq("id", courseId)
    .single();

  if (!course || course.status !== "published") {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  if (user) {
    const { data: existing } = await supabase
      .from("course_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "You already own this course" }, { status: 400 });
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user?.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: course.title },
          unit_amount: course.price_cents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase-success?course=${courseId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
    metadata: {
      type: "course_purchase",
      course_id: courseId,
      buyer_id: user?.id ?? "",
      amount_cents: String(course.price_cents),
      platform_fee_cents: String(Math.round((course.price_cents * PLATFORM_FEE_PERCENT) / 100)),
    },
  });

  return NextResponse.json({ url: session.url });
}
