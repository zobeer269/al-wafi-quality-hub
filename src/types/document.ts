
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
  type: CAPAType; // matches capa_type in database
  priority: CAPAPriority; // Allow both number and CAPAPriority type
  status: CAPAStatus;
  createdDate: string; // matches created_at in database
  dueDate?: string | null; // matches due_date in database
  assignedTo?: string | null; // matches assigned_to in database
  root_cause?: string | null;
  action_plan?: string | null;
  created_by: string;
  closed_date?: string | null;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
  linked_nc_id?: string | null;
  linkedAuditFindingId?: string | null; // matches linked_audit_finding_id in database
  approval_status?: ApprovalStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  tags?: string[];
  ai_notes?: string | null;
  updated_at?: string;
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
