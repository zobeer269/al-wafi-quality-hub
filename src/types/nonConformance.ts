
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
  source?: string;
  status: NonConformanceStatus;
  severity: NonConformanceSeverity;
  linked_batch?: string;
  linked_supplier_id?: string;
  linked_capa_id?: string;
  root_cause?: string;
  immediate_action?: string;
  final_action?: string;
  reported_by: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
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
  source?: string | 'all';
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
