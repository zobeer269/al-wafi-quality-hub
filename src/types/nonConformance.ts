
export type NonConformanceStatus = 
  | "Open" 
  | "Investigation" 
  | "Containment" 
  | "Correction" 
  | "Verification" 
  | "Closed";

export type NonConformanceSeverity = "Minor" | "Major" | "Critical";

export interface NonConformanceFilters {
  status: NonConformanceStatus | 'all';
  severity: NonConformanceSeverity | 'all';
  source: string | 'all';
}

export interface NonConformanceSummary {
  status: NonConformanceStatus;
  count: number;
  critical_count: number;
  capa_required_count: number;
}

export interface NonConformance {
  id: string;
  nc_number: string;
  title: string;
  description: string;
  source?: string;
  severity: NonConformanceSeverity;
  status: NonConformanceStatus;
  reported_by: string;
  reported_date: string;
  assigned_to?: string | null;
  category: string;
  root_cause?: string | null;
  correction?: string | null;
  containment_action?: string | null;
  immediate_action?: string | null;
  final_action?: string | null;
  linked_batch?: string | null;
  linked_supplier_id?: string | null;
  due_date?: string | null;
  closed_date?: string | null;
  closed_by?: string | null;
  capa_required?: boolean;
  linked_capa_id?: string | null;
  linked_audit_finding_id?: string | null;
  lot_number?: string | null;
  product_affected?: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[] | null;
  ai_notes?: string | null;
}
