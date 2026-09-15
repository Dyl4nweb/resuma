import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const isMockStripe =
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY.includes("dummy") ||
      process.env.STRIPE_SECRET_KEY.includes("placeholder");

    if (isMockStripe) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Payment service is currently unavailable. Please try again later." },
          { status: 503 }
        );
      }

      // In mock/development mode, simulate instant upgrade for developer testing
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTier: "PRO",
          stripeSubscriptionId: `sub_mock_${Date.now()}`,
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return NextResponse.json({
        url: `${appUrl}/dashboard/billing?success=true&mock=true`,
        mock: true,
        user: updatedUser,
      });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_monthly";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Resuma PRO Subscription",
              description: "Unlimited resumes, custom styling, ATS export, and sharing analytics",
            },
            unit_amount: 158, // $1.58
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
