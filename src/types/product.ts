
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku: string;
  status: ProductStatus;
  category?: string | null;
  manufacturer?: string | null;
  registration_number?: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type ProductStatus = 
  | "In Development" 
  | "Pending Approval" 
  | "Approved" 
  | "Released" 
  | "Obsolete";

export interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  changes_summary?: string | null;
  linked_capa_id?: string | null;
  linked_sop_id?: string | null;
  effective_date?: string | null;
  status: "Draft" | "Under Review" | "Approved" | "Released";
  created_at: string;
  created_by: string;
}

export interface ProductFormValues {
  name: string;
  description?: string;
  sku: string;
  category?: string;
  manufacturer?: string;
  registration_number?: string;
}

export interface ProductVersionFormValues {
  version: string;
  changes_summary?: string;
  linked_capa_id?: string;
  linked_sop_id?: string;
  effective_date?: string;
}
