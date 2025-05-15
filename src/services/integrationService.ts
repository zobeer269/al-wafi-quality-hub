
import { supabase } from '@/integrations/supabase/client';

export interface AuditFinding {
  id: string;
  finding_number: string;
  audit_id: string;
  description: string;
  severity: string;
  status: string;
  due_date?: string;
}

export interface CAPA {
  id: string;
  number: string;
  title: string;
  description: string;
  capa_type: 'Corrective' | 'Preventive' | 'Both';
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  linked_nc_id?: string;       // Added this field
  linked_audit_finding_id?: string;  // Added this field
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
 * Get all open CAPAs
 */
export async function getOpenCAPAs(): Promise<CAPA[]> {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .in('status', ['Open', 'In Progress']);

    if (error) {
      console.error('Error fetching open CAPAs:', error);
      return [];
    }

    return data.map(capa => ({
      id: capa.id,
      number: capa.number,
      title: capa.title || `CAPA ${capa.number}`, // Fallback title
      description: capa.description,
      capa_type: capa.capa_type,
      priority: mapPriorityToLevel(capa.priority),
      status: capa.status,
      linked_nc_id: capa.linked_nc_id,
      linked_audit_finding_id: capa.linked_audit_finding_id,
    }));
  } catch (error) {
    console.error('Exception fetching open CAPAs:', error);
    return [];
  }
}

/**
 * Get a specific CAPA by ID
 */
export async function getCAPAById(id: string): Promise<CAPA | null> {
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

    return {
      id: data.id,
      number: data.number,
      title: data.title || `CAPA ${data.number}`,
      description: data.description,
      capa_type: data.capa_type,
      priority: mapPriorityToLevel(data.priority),
      status: data.status,
      linked_nc_id: data.linked_nc_id,
      linked_audit_finding_id: data.linked_audit_finding_id,
    };
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
 * Create a new CAPA from a Non-Conformance
 */
export async function createCAPAFromNC(data: {
  title: string;
  description: string;
  severity: string;
  nc_id: string;
  reported_by: string;
}): Promise<CAPA> {
  try {
    // Map severity to priority
    const priority = mapSeverityToPriority(data.severity);
    
    // Determine CAPA type based on severity
    const capa_type = data.severity === 'Critical' ? 'Corrective' : 'Both';
    
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

    return {
      id: capaData.id,
      number: capaData.number,
      title: capaData.title,
      description: capaData.description,
      capa_type: capaData.capa_type,
      priority: mapPriorityToLevel(capaData.priority),
      status: capaData.status,
      linked_nc_id: capaData.linked_nc_id,
      linked_audit_finding_id: capaData.linked_audit_finding_id,
    };
  } catch (error) {
    console.error('Exception creating CAPA:', error);
    throw error;
  }
}

/**
 * Helper function to map severity to priority number
 */
function mapSeverityToPriority(severity: string): number {
  switch (severity) {
    case 'Critical':
      return 3; // High
    case 'Major':
      return 2; // Medium
    default:
      return 1; // Low
  }
}

/**
 * Helper function to map priority number to level
 */
function mapPriorityToLevel(priority: number): 'Low' | 'Medium' | 'High' {
  switch (priority) {
    case 3:
      return 'High';
    case 2:
      return 'Medium';
    default:
      return 'Low';
  }
}
