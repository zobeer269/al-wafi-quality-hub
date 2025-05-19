
export type ProductStatus = 
  | "In Development" 
  | "Pending Approval" 
  | "Approved" 
  | "Released" 
  | "Obsolete";

export const productStatusOptions = ["all", "In Development", "Pending Approval", "Approved", "Released", "Obsolete"] as const;
export type ProductStatusFilter = typeof productStatusOptions[number];

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
  status: ProductStatusFilter;
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
  linked_capa_id?: string | null;
  linked_sop_id?: string | null;
  effective_date?: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
}
