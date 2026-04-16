import { describe, it, expect } from 'vitest';
import { PLAN_LIMITS } from '../../lib/planLimits';

describe('PLAN_LIMITS', () => {
  it('starter has 50 people limit', () => {
    expect(PLAN_LIMITS.starter.people).toBe(50);
  });

  it('starter AI extraction is false', () => {
    expect(PLAN_LIMITS.starter.aiExtraction).toBe(false);
  });

  it('professional AI extraction is true', () => {
    expect(PLAN_LIMITS.professional.aiExtraction).toBe(true);
  });

  it('business has null (unlimited) limits', () => {
    expect(PLAN_LIMITS.business.people).toBeNull();
    expect(PLAN_LIMITS.business.documents).toBeNull();
    expect(PLAN_LIMITS.business.vehicles).toBeNull();
    expect(PLAN_LIMITS.business.assets).toBeNull();
  });
});
