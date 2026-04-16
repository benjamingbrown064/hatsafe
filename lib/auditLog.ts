import { SupabaseClient } from '@supabase/supabase-js';
import logger from './logger';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'signup'
  | 'settings_change'
  | 'ai_extraction'
  | 'data_export'
  | 'org_delete'
  | 'subscription_change'
  | 'file_upload'
  | 'consent_given';

export interface AuditLogEntry {
  organisation_id: string;
  user_id: string;
  action: AuditAction;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}

export async function logAuditEvent(
  supabase: SupabaseClient,
  entry: AuditLogEntry
): Promise<void> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      organisation_id: entry.organisation_id,
      user_id: entry.user_id,
      action: entry.action,
      resource_type: entry.resource_type || null,
      resource_id: entry.resource_id || null,
      metadata: entry.metadata || {},
      ip_address: entry.ip_address || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      logger.error({ err: error, entry }, 'Failed to write audit log');
    }
  } catch (err) {
    logger.error({ err, entry }, 'Audit log exception');
  }
}
