
export type ProductStatus = 
  | "In Development" 
  | "Pending Approval" 
  | "Approved" 
  | "Released" 
  | "Obsolete" 
  | "all"; // Include 'all' for filter purposes

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  manufacturer?: string;
  registration_number?: string;
  status: ProductStatus;
  created_at: string;
  created_by: string;
  updated_at?: string;
}

export interface ProductFilters {
  status: ProductStatus | 'all';
  search: string;
  manufacturer?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  changes_summary?: string;
  status: "Draft" | "Approved" | "Obsolete";
  linked_capa_id?: string | null;
  linked_sop_id?: string | null;
  effective_date?: string | null;
  created_at: string;
  created_by: string;
}
