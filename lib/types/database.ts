// HatSafe Database Types
// Auto-generated types matching Postgres schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'contributor' | 'viewer'

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'

export type SubscriptionTier = 'starter' | 'professional' | 'business'

export type EmploymentStatus = 'active' | 'inactive' | 'contractor'

export type DocumentStatus =
  | 'pending_review'
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'superseded'
  | 'rejected'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type ProcessingStatus = 'processing' | 'completed' | 'failed'

export type NotificationType =
  | 'expiry_30d'
  | 'expiry_14d'
  | 'expiry_7d'
  | 'expired'
  | 'overdue_7d'

export type NotificationChannel = 'email' | 'in_app'

export type NotificationStatus = 'pending' | 'sent' | 'failed'

export type DigestType = 'daily_urgent' | 'weekly_upcoming'

export type EntityType = 'person' | 'vehicle' | 'asset' | 'site' | 'supplier'

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'approved'
  | 'rejected'
  | 'downloaded'

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Organisation {
  id: string
  name: string
  subdomain: string | null
  settings: Json
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus
  subscription_tier: SubscriptionTier
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  organisation_id: string
  email: string
  name: string
  role: UserRole
  team_id: string | null
  avatar_url: string | null
  settings: Json
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  organisation_id: string
  name: string
  manager_id: string | null
  site_id: string | null
  created_at: string
  updated_at: string
}

export interface Site {
  id: string
  organisation_id: string
  name: string
  client: string | null
  address: string | null
  postcode: string | null
  site_manager_id: string | null
  metadata: Json
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  organisation_id: string
  name: string
  role: string | null
  team_id: string | null
  site_id: string | null
  manager_id: string | null
  employment_status: EmploymentStatus
  contact_email: string | null
  contact_phone: string | null
  photo_url: string | null
  metadata: Json
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  organisation_id: string
  registration: string
  make: string | null
  model: string | null
  vehicle_type: string | null
  owner: string | null
  depot_site_id: string | null
  metadata: Json
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  organisation_id: string
  asset_id: string
  name: string
  type: string | null
  location: string | null
  site_id: string | null
  owner_id: string | null
  metadata: Json
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  organisation_id: string
  company_name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  category: string | null
  owner_id: string | null
  metadata: Json
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface DocumentType {
  id: string
  organisation_id: string | null
  name: string
  category: string | null
  entity_types: string[]
  is_renewable: boolean
  default_lead_times: number[]
  required_fields: string[]
  settings: Json
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  organisation_id: string
  entity_type: EntityType
  entity_id: string
  document_type_id: string | null
  title: string
  issuer: string | null
  certificate_number: string | null
  issue_date: string | null
  expiry_date: string | null
  status: DocumentStatus
  current_version_id: string | null
  review_status: ReviewStatus
  confidence_score: number | null
  metadata: Json
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface DocumentVersion {
  id: string
  document_id: string
  version_number: number
  file_path: string
  file_name: string
  file_size: number | null
  mime_type: string | null
  extraction_data: Json
  uploaded_by: string | null
  uploaded_at: string
  superseded_at: string | null
}

export interface DocumentExtraction {
  id: string
  document_version_id: string
  raw_text: string | null
  extracted_fields: Json
  confidence_scores: Json
  suggested_entity_id: string | null
  suggested_entity_type: string | null
  processing_status: ProcessingStatus
  processing_time_ms: number | null
  model_used: string | null
  error_message: string | null
  created_at: string
}

export interface Notification {
  id: string
  organisation_id: string
  document_id: string | null
  recipient_id: string
  notification_type: NotificationType
  channel: NotificationChannel
  status: NotificationStatus
  sent_at: string | null
  read_at: string | null
  metadata: Json
  created_at: string
}

export interface NotificationLog {
  id: string
  organisation_id: string
  digest_type: DigestType
  recipient_id: string
  documents_included: Json
  sent_at: string
}

export interface AuditLog {
  id: string
  organisation_id: string
  user_id: string | null
  entity_type: string
  entity_id: string | null
  action: AuditAction
  changes: Json
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// ============================================================================
// JOIN TYPES (with relations)
// ============================================================================

export interface PersonWithRelations extends Person {
  team?: Team
  site?: Site
  manager?: User
  documents?: Document[]
}

export interface VehicleWithRelations extends Vehicle {
  depot_site?: Site
  documents?: Document[]
}

export interface AssetWithRelations extends Asset {
  site?: Site
  owner?: User
  documents?: Document[]
}

export interface DocumentWithRelations extends Document {
  document_type?: DocumentType
  created_by_user?: User
  current_version?: DocumentVersion
  versions?: DocumentVersion[]
  extractions?: DocumentExtraction[]
}

export interface NotificationWithRelations extends Notification {
  document?: Document
  recipient?: User
}

// ============================================================================
// FORM INPUT TYPES (for creating/updating)
// ============================================================================

export interface CreatePersonInput {
  name: string
  role?: string
  team_id?: string
  site_id?: string
  manager_id?: string
  employment_status?: EmploymentStatus
  contact_email?: string
  contact_phone?: string
  photo_url?: string
  metadata?: Json
}

export interface UpdatePersonInput extends Partial<CreatePersonInput> {
  archived_at?: string | null
}

export interface CreateVehicleInput {
  registration: string
  make?: string
  model?: string
  vehicle_type?: string
  owner?: string
  depot_site_id?: string
  metadata?: Json
}

export interface UpdateVehicleInput extends Partial<CreateVehicleInput> {
  archived_at?: string | null
}

export interface CreateAssetInput {
  asset_id: string
  name: string
  type?: string
  location?: string
  site_id?: string
  owner_id?: string
  metadata?: Json
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  archived_at?: string | null
}

export interface CreateDocumentInput {
  entity_type: EntityType
  entity_id: string
  document_type_id?: string
  title: string
  issuer?: string
  certificate_number?: string
  issue_date?: string
  expiry_date?: string
  metadata?: Json
}

export interface UpdateDocumentInput extends Partial<CreateDocumentInput> {
  status?: DocumentStatus
  review_status?: ReviewStatus
  confidence_score?: number
}

// ============================================================================
// FILTER TYPES (for list queries)
// ============================================================================

export interface PersonFilters {
  team_id?: string
  site_id?: string
  employment_status?: EmploymentStatus
  search?: string
  archived?: boolean
}

export interface VehicleFilters {
  vehicle_type?: string
  depot_site_id?: string
  search?: string
  archived?: boolean
}

export interface AssetFilters {
  type?: string
  site_id?: string
  search?: string
  archived?: boolean
}

export interface DocumentFilters {
  entity_type?: EntityType
  entity_id?: string
  document_type_id?: string
  status?: DocumentStatus
  review_status?: ReviewStatus
  expiring_within_days?: number
  search?: string
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DashboardStats {
  total_documents: number
  valid_documents: number
  expiring_soon: number
  expired: number
  missing: number
  pending_review: number
}

export interface ComplianceStatus {
  entity_id: string
  entity_type: EntityType
  entity_name: string
  status: 'compliant' | 'expiring' | 'non_compliant'
  documents_count: number
  expiring_count: number
  expired_count: number
  missing_count: number
}
