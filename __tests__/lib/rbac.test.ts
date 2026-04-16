import { describe, it, expect, vi } from 'vitest';
import { requireRole } from '../../lib/middleware/rbac';

function mockSupabase(role: string | null) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: role ? { role } : null }),
        }),
      }),
    }),
  } as any;
}

describe('requireRole', () => {
  it('allows admin to do admin actions', async () => {
    const result = await requireRole(mockSupabase('admin'), 'user-1', 'admin');
    expect(result.allowed).toBe(true);
  });

  it('allows manager to do contributor actions', async () => {
    const result = await requireRole(mockSupabase('manager'), 'user-1', 'contributor');
    expect(result.allowed).toBe(true);
  });

  it('rejects viewer from admin actions', async () => {
    const result = await requireRole(mockSupabase('viewer'), 'user-1', 'admin');
    expect(result.allowed).toBe(false);
    expect(result.response).toBeDefined();
  });

  it('rejects contributor from admin actions', async () => {
    const result = await requireRole(mockSupabase('contributor'), 'user-1', 'admin');
    expect(result.allowed).toBe(false);
  });

  it('returns 403 when role not found', async () => {
    const result = await requireRole(mockSupabase(null), 'user-1', 'viewer');
    expect(result.allowed).toBe(false);
  });
});
