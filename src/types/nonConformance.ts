
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
  title: string;
  description: string;
  source: string;
  severity: "Minor" | "Major" | "Critical";
  status: "Open" | "Investigation" | "Correction" | "Verification" | "Closed";
  assigned_to?: string;
  linked_capa_id?: string;
  capa_required: boolean;
  created_at: string;
  updated_at?: string;
  nc_number?: string;
  reported_by?: string;
  reported_date?: string;
  category?: string;
  linked_batch?: string;
  linked_supplier_id?: string;
  linked_audit_finding_id?: string;
  root_cause?: string;
  immediate_action?: string;
  final_action?: string;
  correction?: string;
  containment_action?: string;
  due_date?: string;
  tags?: string[];
  ai_notes?: string;

}

