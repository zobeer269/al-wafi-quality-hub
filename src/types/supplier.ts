
export type SupplierStatus = 'Pending' | 'Approved' | 'Suspended' | 'Blacklisted';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status: SupplierStatus;
  approval_date?: string;
  requalification_due?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierQualification {
  id: string;
  supplier_id: string;
  qualification_date?: string;
  qualified_by?: string;
  certificate_url?: string;
  notes?: string;
  next_review_date?: string;
}

export interface SupplierAudit {
  id: string;
  supplier_id: string;
  audit_id: string;
  result?: string;
  linked_findings?: string;
  created_at?: string;
}
