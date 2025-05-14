
export type NonConformanceSeverity = 'Minor' | 'Major' | 'Critical';

export type NonConformanceStatus = 
  | 'Open' 
  | 'Investigation'
  | 'Containment'
  | 'Correction'
  | 'Verification'
  | 'Closed';

export interface NonConformance {
  id: string;
  nc_number: string;
  title: string;
  description: string;
  category: string;
  status: NonConformanceStatus;
  severity: NonConformanceSeverity;
  reported_date: string;
  reported_by: string;
  assigned_to?: string;
  due_date?: string;
  capa_required: boolean;
  linked_capa_id?: string;
  linked_audit_finding_id?: string;
  product_affected?: string;
  lot_number?: string;
  containment_action?: string;
  root_cause?: string;
  correction?: string;
  closed_date?: string;
  closed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NonConformanceAttachment {
  id: string;
  nc_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  description?: string;
}

export interface NonConformanceFilters {
  status?: NonConformanceStatus | 'all';
  severity?: NonConformanceSeverity | 'all';
  category?: string | 'all';
  assignedTo?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface NonConformanceSummary {
  status: NonConformanceStatus;
  count: number;
  critical_count: number;
  capa_required_count: number;
}
