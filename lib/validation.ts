import { z } from 'zod';

// Shared
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const SearchSchema = z.object({
  search: z
    .string()
    .max(200)
    .regex(/^[a-zA-Z0-9\s\-_.@']+$/, 'Invalid search characters')
    .optional()
    .default(''),
});

const UUIDSchema = z.string().uuid().optional().nullable();

// People
export const CreatePersonSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  email: z.string().email().max(320).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  team_id: UUIDSchema,
  site_id: UUIDSchema,
  employee_id: z.string().max(100).optional().nullable(),
  date_of_birth: z.string().date().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  emergency_contact: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const UpdatePersonSchema = CreatePersonSchema.partial();

// Vehicles
export const CreateVehicleSchema = z.object({
  registration: z.string().min(1).max(20).trim(),
  make: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  colour: z.string().max(50).optional().nullable(),
  vin: z.string().max(50).optional().nullable(),
  fleet_number: z.string().max(50).optional().nullable(),
  site_id: UUIDSchema,
  notes: z.string().max(2000).optional().nullable(),
});

export const UpdateVehicleSchema = CreateVehicleSchema.partial();

// Assets
export const CreateAssetSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  asset_type: z.string().max(100).optional().nullable(),
  serial_number: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  site_id: UUIDSchema,
  notes: z.string().max(2000).optional().nullable(),
});

export const UpdateAssetSchema = CreateAssetSchema.partial();

// Organisation creation
export const CreateOrganisationSchema = z.object({
  user_id: z.string().uuid(),
  organisation_name: z.string().min(1).max(200).trim(),
  user_name: z.string().min(1).max(200).trim(),
});

// Document upload query params
export const DocumentQuerySchema = PaginationSchema.merge(
  z.object({
    entityType: z.string().max(50).optional(),
    entityId: z.string().uuid().optional(),
    status: z.string().max(50).optional(),
    search: z.string().max(200).optional(),
  })
);

// Stripe
export const CreateCheckoutSchema = z.object({
  planId: z.enum(['starter', 'professional', 'business']),
});

// Consent
export const ConsentSchema = z.object({
  consented: z.literal(true),
});

// GDPR export
export const ExportDataSchema = z.object({
  format: z.enum(['json', 'zip']).default('zip'),
});

// Helper to validate and return 400 on failure
export function validateBody<T>(schema: z.ZodType<T>, body: unknown): { data: T; error: null } | { data: null; error: Response } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const { Response } = globalThis as any;
    return {
      data: null,
      error: new Response(
        JSON.stringify({ error: 'Validation failed', details: result.error.flatten() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
  return { data: result.data, error: null };
}
