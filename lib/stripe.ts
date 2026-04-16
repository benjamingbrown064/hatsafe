import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}

// Convenience export — use getStripe() in route handlers
export const stripe = {
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// Map plan IDs to Stripe price IDs (set these env vars after creating Stripe products)
export function getStripePriceIds(): Record<string, string> {
  return {
    starter: process.env.STRIPE_PRICE_STARTER || '',
    professional: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    business: process.env.STRIPE_PRICE_BUSINESS || '',
  };
}

export const PLAN_NAMES: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  business: 'Business',
};
