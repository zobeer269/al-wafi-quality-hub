
export type AuditType = 'Internal' | 'External' | 'Supplier' | 'Regulatory';

export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export type FindingSeverity = 'Minor' | 'Major' | 'Critical';

export type FindingStatus = 'Open' | 'In Progress' | 'Closed';

export interface Audit {
  id: string;
  auditId?: string; // For UI display purposes
  title: string;
  type: AuditType;
  scope: string;
  status: AuditStatus;
  startDate?: string;
  endDate?: string;
  leadAuditor?: string;
  auditTeam?: string[];
  department?: string;
  description?: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  audit_number: string;
  audit_type: AuditType;
  auditor_names?: string[];
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuditFinding {
  id: string;
  audit_id: string;
  finding_number: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  due_date?: string;
  assigned_to?: string;
  capa_required?: boolean;
  linked_capa_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuditEvidence {
  id: string;
  audit_id: string;
  finding_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at?: string;
  description?: string;
}
