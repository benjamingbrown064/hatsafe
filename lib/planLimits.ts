import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export type SubscriptionTier = 'starter' | 'professional' | 'business';

export interface PlanLimits {
  people: number | null;       // null = unlimited
  documents: number | null;
  vehicles: number | null;
  assets: number | null;
  aiExtraction: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
  starter: {
    people: 50,
    documents: 100,
    vehicles: 10,
    assets: 10,
    aiExtraction: false,
  },
  professional: {
    people: 200,
    documents: 500,
    vehicles: 50,
    assets: 50,
    aiExtraction: true,
  },
  business: {
    people: null,
    documents: null,
    vehicles: null,
    assets: null,
    aiExtraction: true,
  },
};

export type ResourceType = 'people' | 'documents' | 'vehicles' | 'assets';

export async function checkPlanLimit(
  supabase: SupabaseClient,
  orgId: string,
  resource: ResourceType
): Promise<{ allowed: boolean; response?: NextResponse }> {
  // Get org tier
  const { data: org } = await supabase
    .from('organisations')
    .select('subscription_tier, subscription_status')
    .eq('id', orgId)
    .single();

  const tier: SubscriptionTier = (org?.subscription_tier as SubscriptionTier) || 'starter';
  const limits = PLAN_LIMITS[tier];
  const limit = limits[resource];

  if (limit === null) return { allowed: true };

  // Count current usage
  const table = resource; // table names match resource names
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('organisation_id', orgId)
    .is('archived_at', null);

  const currentCount = count ?? 0;

  if (currentCount >= limit) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Plan limit reached',
          resource,
          limit,
          current: currentCount,
          upgradeUrl: '/settings/billing',
          message: `You've reached the ${resource} limit for your ${tier} plan. Upgrade to add more.`,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

export async function checkAIAccess(
  supabase: SupabaseClient,
  orgId: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const { data: org } = await supabase
    .from('organisations')
    .select('subscription_tier')
    .eq('id', orgId)
    .single();

  const tier: SubscriptionTier = (org?.subscription_tier as SubscriptionTier) || 'starter';
  const allowed = PLAN_LIMITS[tier].aiExtraction;

  if (!allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'AI extraction requires Professional plan or higher',
          upgradeUrl: '/settings/billing',
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

export async function getUsageCounts(
  supabase: SupabaseClient,
  orgId: string
): Promise<Record<ResourceType, number>> {
  const [people, documents, vehicles, assets] = await Promise.all([
    supabase
      .from('people')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .is('archived_at', null),
    supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .is('archived_at', null),
    supabase
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .is('archived_at', null),
    supabase
      .from('assets')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .is('archived_at', null),
  ]);

  return {
    people: people.count ?? 0,
    documents: documents.count ?? 0,
    vehicles: vehicles.count ?? 0,
    assets: assets.count ?? 0,
  };
}
