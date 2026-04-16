import { describe, it, expect } from 'vitest';
import {
  CreatePersonSchema,
  CreateVehicleSchema,
  CreateAssetSchema,
  PaginationSchema,
  SearchSchema,
  CreateOrganisationSchema,
} from '../../lib/validation';

describe('CreatePersonSchema', () => {
  it('accepts valid person', () => {
    const result = CreatePersonSchema.safeParse({ name: 'John Smith', email: 'john@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = CreatePersonSchema.safeParse({ email: 'john@example.com' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = CreatePersonSchema.safeParse({ name: 'John', email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects name over 200 chars', () => {
    const result = CreatePersonSchema.safeParse({ name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });
});

describe('CreateVehicleSchema', () => {
  it('accepts valid vehicle', () => {
    const result = CreateVehicleSchema.safeParse({ registration: 'AB12 CDE' });
    expect(result.success).toBe(true);
  });

  it('rejects missing registration', () => {
    const result = CreateVehicleSchema.safeParse({ make: 'Ford' });
    expect(result.success).toBe(false);
  });
});

describe('CreateAssetSchema', () => {
  it('accepts valid asset', () => {
    const result = CreateAssetSchema.safeParse({ name: 'Crane 1' });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = CreateAssetSchema.safeParse({ model: 'XL-3000' });
    expect(result.success).toBe(false);
  });
});

describe('PaginationSchema', () => {
  it('defaults to page 1, limit 50', () => {
    const result = PaginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(50);
    }
  });

  it('rejects limit over 100', () => {
    const result = PaginationSchema.safeParse({ limit: 999 });
    expect(result.success).toBe(false);
  });

  it('coerces string to number', () => {
    const result = PaginationSchema.safeParse({ page: '2', limit: '25' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(25);
    }
  });
});

describe('SearchSchema', () => {
  it('rejects special chars', () => {
    const result = SearchSchema.safeParse({ search: '<script>alert(1)</script>' });
    expect(result.success).toBe(false);
  });

  it('accepts alphanumeric with spaces and dashes', () => {
    const result = SearchSchema.safeParse({ search: 'John Smith-Jones' });
    expect(result.success).toBe(true);
  });
});

describe('CreateOrganisationSchema', () => {
  it('accepts valid org', () => {
    const result = CreateOrganisationSchema.safeParse({
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      organisation_name: 'Acme Ltd',
      user_name: 'John',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID', () => {
    const result = CreateOrganisationSchema.safeParse({
      user_id: 'not-a-uuid',
      organisation_name: 'Acme',
      user_name: 'John',
    });
    expect(result.success).toBe(false);
  });
});
