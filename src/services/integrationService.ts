import { supabase } from '@/integrations/supabase/client';
import { CAPAPriority, CAPAType, CAPAStatus, ApprovalStatus } from '@/types/document';

export interface AuditFinding {
  id: string;
  finding_number: string;
  audit_id: string;
  description: string;
  severity: string;
  status: string;
  due_date?: string | null;
}

// This interface matches database schema exactly
export interface CAPA {
  id: string;
  number: string;
  title: string;
  description: string;
  capa_type: CAPAType;
  priority: CAPAPriority;
  status: CAPAStatus;
  linked_nc_id?: string | null;
  linked_audit_finding_id?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  closed_date?: string | null;
  approval_status?: ApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  tags?: string[];
  ai_notes?: string | null;
  due_date?: string | null;
  assigned_to?: string | null;
  root_cause?: string | null;
  action_plan?: string | null;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
}

/**
 * Get all open audit findings
 */
export async function getOpenAuditFindings(): Promise<AuditFinding[]> {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('status', 'Open');

    if (error) {
      console.error('Error fetching open audit findings:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception fetching open audit findings:', error);
    return [];
  }
}

/**
 * Convert database CAPA to frontend CAPA type
 */
function mapDatabaseCAPAToFrontend(capa: CAPA): import('@/types/document').CAPA {
  return {
    id: capa.id,
    number: capa.number || `CAPA ${capa.id.substring(0, 6)}`, // Fallback title
    title: capa.title || `CAPA ${capa.number}`, // Fallback title
    description: capa.description,
    type: capa.capa_type,
    priority: capa.priority,
    status: capa.status,
    createdDate: capa.created_at || new Date().toISOString(),
    dueDate: capa.due_date,
    assignedTo: capa.assigned_to,
    root_cause: capa.root_cause,
    action_plan: capa.action_plan,
    created_by: capa.created_by || '',
    closed_date: capa.closed_date,
    effectiveness_check_required: capa.effectiveness_check_required,
    effectiveness_verified: capa.effectiveness_verified,
    linked_nc_id: capa.linked_nc_id,
    linkedAuditFindingId: capa.linked_audit_finding_id,
    approval_status: capa.approval_status,
    approved_by: capa.approved_by,
    approved_at: capa.approved_at,
    tags: capa.tags || [],
    ai_notes: capa.ai_notes
  };
}

/**
 * Get all open CAPAs
 */
export async function getOpenCAPAs(): Promise<import('@/types/document').CAPA[]> {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .in('status', ['Open', 'In Progress']);

    if (error) {
      console.error('Error fetching open CAPAs:', error);
      return [];
    }

    return data.map(capa => mapDatabaseCAPAToFrontend(capa));
  } catch (error) {
    console.error('Exception fetching open CAPAs:', error);
    return [];
  }
}

/**
 * Get a specific CAPA by ID
 */
export async function getCAPAById(id: string): Promise<import('@/types/document').CAPA | null> {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching CAPA by ID:', error);
      return null;
    }

    return mapDatabaseCAPAToFrontend(data);
  } catch (error) {
    console.error('Exception fetching CAPA by ID:', error);
    return null;
  }
}

/**
 * Get a specific Audit Finding by ID
 */
export async function getAuditFindingById(id: string): Promise<AuditFinding | null> {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching Audit Finding by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching Audit Finding by ID:', error);
    return null;
  }
}

/**
 * Generate a CAPA number based on the current date and a random sequence
 */
function generateCAPANumber(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `CAPA-${year}${month}${day}-${random}`;
}

/**
 * Create a new CAPA from a Non-Conformance
 */
export async function createCAPAFromNC(data: {
  title: string;
  description: string;
  severity: string;
  nc_id: string;
  reported_by: string;
}): Promise<import('@/types/document').CAPA> {
  try {
    // Map severity to priority
    const priority = mapSeverityToPriority(data.severity);
    
    // Determine CAPA type based on severity
    const capa_type = data.severity === 'Critical' ? 'Corrective' : 'Both';
    
    // Generate a unique CAPA number
    const capaNumber = generateCAPANumber();
    
    // Insert new CAPA
    const { data: capaData, error } = await supabase
      .from('capas')
      .insert({
        description: data.description,
        title: `CAPA for: ${data.title}`,
        priority: priority,
        capa_type: capa_type,
        status: 'Open',
        linked_nc_id: data.nc_id,
        created_by: data.reported_by,
        number: capaNumber,
        approval_status: 'Pending',
        tags: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      throw new Error(`Failed to create CAPA: ${error.message}`);
    }

    // Update the NC with the linked CAPA ID
    if (data.nc_id) {
      const { error: updateError } = await supabase
        .from('non_conformances')
        .update({ linked_capa_id: capaData.id })
        .eq('id', data.nc_id);

      if (updateError) {
        console.error('Error updating NC with CAPA link:', updateError);
      }
    }

    return mapDatabaseCAPAToFrontend(capaData);
  } catch (error) {
    console.error('Exception creating CAPA:', error);
    throw error;
  }
}

/**
 * Helper function to map severity to priority number
 */
function mapSeverityToPriority(severity: string): CAPAPriority {
  switch (severity) {
    case 'Critical':
      return 3; // High
    case 'Major':
      return 2; // Medium
    default:
      return 1; // Low
  }
}
