export type DocumentStatus = "Draft" | "In Review" | "Approved" | "Obsolete";
export type CAPAStatus = "Open" | "Investigation" | "In Progress" | "Closed";
export type CAPAType = "Corrective" | "Preventive" | "Both";
export type CAPAPriority = 1 | 2 | 3;

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
}
