import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import logger from '@/lib/logger';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error({ err }, 'Stripe webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organisation_id;
        const planId = session.metadata?.plan_id;
        if (orgId && planId) {
          await supabase
            .from('organisations')
            .update({
              subscription_tier: planId,
              subscription_status: 'active',
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', orgId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const orgResult = await supabase
          .from('organisations')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();

        if (orgResult.data) {
          const priceId = sub.items.data[0]?.price.id;
          const tier = Object.entries(
            JSON.parse(process.env.STRIPE_PRICE_MAP || '{}')
          ).find(([, pid]) => pid === priceId)?.[0] || 'starter';

          await supabase
            .from('organisations')
            .update({
              subscription_status: sub.status === 'active' ? 'active' : 'inactive',
              subscription_tier: tier,
              stripe_subscription_id: sub.id,
            })
            .eq('id', orgResult.data.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const orgResult = await supabase
          .from('organisations')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();

        if (orgResult.data) {
          await supabase
            .from('organisations')
            .update({ subscription_status: 'cancelled', subscription_tier: 'starter' })
            .eq('id', orgResult.data.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const orgResult = await supabase
          .from('organisations')
          .select('id')
          .eq('stripe_customer_id', invoice.customer as string)
          .single();

        if (orgResult.data) {
          await supabase
            .from('organisations')
            .update({ subscription_status: 'past_due' })
            .eq('id', orgResult.data.id);
        }
        break;
      }

      default:
        logger.info({ type: event.type }, 'Unhandled Stripe webhook event');
    }
  } catch (err) {
    logger.error({ err, eventType: event.type }, 'Error processing Stripe webhook');
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
