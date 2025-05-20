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
  capa_type: "Corrective" | "Preventive" | "Both";
  status: "Open" | "Investigation" | "In Progress" | "Closed";
  priority: number; // أو CAPAPriority إذا كان لديك enum
  root_cause?: string | null;
  action_plan?: string | null;
  assigned_to?: string | null;
  created_by: string;
  created_at: string;
  updated_at?: string;
  due_date?: string | null;
  closed_date?: string | null;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
}


// Use the imported Complaint from complaint.ts instead
// This is to prevent type conflicts

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

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  job_title?: string | null;
  department?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
