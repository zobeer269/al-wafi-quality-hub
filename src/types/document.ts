
export type DocumentStatus = 'Approved' | 'In Review' | 'Draft' | 'Obsolete';
export type CAPAStatus = 'Open' | 'Investigation' | 'In Progress' | 'Closed';
export type CAPAType = 'Corrective' | 'Preventive' | 'Both';
export type UserRole = 'admin' | 'manager' | 'supervisor' | 'user' | 'readonly';

export interface Document {
  id: string;
  number: string;
  title: string;
  type: string;
  version: string;
  status: DocumentStatus;
  lastUpdated: string;
  description?: string;
  content_url?: string; // Added this property to fix the build error
}

export interface CAPA {
  id: string;
  number: string;
  title: string;
  type: CAPAType;
  status: CAPAStatus;
  priority: number;
  createdDate: string;
  dueDate?: string;
  assignedTo?: string;
  description: string;
  root_cause?: string;
  action_plan?: string;
  closed_date?: string;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
  created_by?: string;
}
