
export type DocumentStatus = "Draft" | "In Review" | "Approved" | "Obsolete";
export type CAPAStatus = "Open" | "Investigation" | "In Progress" | "Closed";
export type CAPAType = "Corrective" | "Preventive" | "Both";
export type CAPAPriority = 1 | 2 | 3;
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
  content_url?: string;
  approval_status?: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
}

export interface CAPA {
  id: string;
  number: string;
  title: string;
  description: string;
  type: CAPAType;
  priority: CAPAPriority;
  status: CAPAStatus;
  createdDate: string;
  dueDate?: string;
  assignedTo?: string;
  root_cause?: string;
  action_plan?: string;
  created_by?: string;
  closed_date?: string;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
  linked_nc_id?: string;
  linked_audit_finding_id?: string;
  approval_status?: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
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
