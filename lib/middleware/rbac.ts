import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export type UserRole = 'viewer' | 'contributor' | 'manager' | 'admin';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  contributor: 2,
  manager: 3,
  admin: 4,
};

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRole | null> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  return (data?.role as UserRole) || null;
}

export async function requireRole(
  supabase: SupabaseClient,
  userId: string,
  minimumRole: UserRole
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const role = await getUserRole(supabase, userId);

  if (!role) {
    return {
      allowed: false,
      response: NextResponse.json({ error: 'User role not found' }, { status: 403 }),
    };
  }

  const userLevel = ROLE_HIERARCHY[role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole];

  if (userLevel < requiredLevel) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Insufficient permissions',
          required: minimumRole,
          current: role,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true };
}

export async function requireAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  return requireRole(supabase, userId, 'admin');
}

export async function requireContributor(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  return requireRole(supabase, userId, 'contributor');
}
