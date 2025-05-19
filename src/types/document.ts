
export type DocumentStatus = "Draft" | "In Review" | "Approved" | "Obsolete";
export type CAPAStatus = "Open" | "Investigation" | "In Progress" | "Closed";
export type CAPAType = "Corrective" | "Preventive" | "Both";
export type CAPAPriority = 1 | 2 | 3 | number; // Allow both specific values and general number
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export const priorityLabelMap: Record<CAPAPriority, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export interface Document {
  id: string;
  number: string;
  title: string;
  type: string;
  version: string;
  status: DocumentStatus;
  lastUpdated: string;
  description?: string;
  content_url?: string | null;
  approval_status?: ApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  effective_date?: string | null;
  review_date?: string | null;
  expiry_date?: string | null;
}

export interface CAPA {
  id: string;
  number: string;
  title: string;
  description: string;
  type: CAPAType; // matches capa_type in DB
  priority: CAPAPriority;
  status: CAPAStatus;
  createdDate: string; // created_at
  dueDate?: string | null;
  assignedTo?: string | null;
  root_cause?: string | null;
  action_plan?: string | null;
  created_by: string;
  closed_date?: string | null;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
  linked_nc_id?: string | null;
  linkedAuditFindingId?: string | null;
  approval_status?: ApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  tags?: string[];
  ai_notes?: string | null;
  updated_at?: string;
  capa_type?: CAPAType; // optional alias if needed for service compatibility
}

export interface NonConformance {
  id: string;
  nc_number: string;
  title: string;
  description: string;
  source: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Investigation" | "Containment" | "Correction" | "Verification" | "Closed";
  reported_by: string;
  reported_date: string;
  assigned_to?: string | null;
  capa_required: boolean;
  category: string;
  containment_action?: string | null;
  correction?: string | null;
  immediate_action?: string | null;
  final_action?: string | null;
  linked_batch?: string | null;
  linked_supplier_id?: string | null;
  linked_capa_id?: string | null;
  tags?: string[];
  ai_notes?: string | null;
  created_at: string;
  updated_at: string;
  closed_date?: string | null;
  closed_by?: string | null;
}

export interface Signature {
  id: string;
  user_id: string;
  action: string;
  module: string;
  reference_id: string;
  signature_hash: string;
  signed_at: string;
  reason?: string;
  ip_address?: string;
}
