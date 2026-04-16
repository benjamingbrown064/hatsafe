import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe, getStripePriceIds } from '@/lib/stripe';
import { CreateCheckoutSchema } from '@/lib/validation';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = CreateCheckoutSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    const { planId } = validation.data;

    const priceId = getStripePriceIds()[planId];
    if (!priceId) {
      return NextResponse.json({ error: `Stripe price not configured for plan: ${planId}` }, { status: 500 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id, email')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    const { data: org } = await supabase
      .from('organisations')
      .select('stripe_customer_id, name')
      .eq('id', userData.organisation_id)
      .single();

    let customerId = org?.stripe_customer_id;

    // Create Stripe customer if not exists
    if (!customerId) {
      const stripeClient = getStripe();
      const customer = await stripeClient.customers.create({
        email: user.email || userData.email,
        name: org?.name,
        metadata: {
          organisation_id: userData.organisation_id,
          user_id: user.id,
        },
      });
      customerId = customer.id;
      await supabase
        .from('organisations')
        .update({ stripe_customer_id: customerId })
        .eq('id', userData.organisation_id);
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?cancelled=true`,
      metadata: {
        organisation_id: userData.organisation_id,
        plan_id: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error({ err: error }, 'Stripe checkout error');
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
