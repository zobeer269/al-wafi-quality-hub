
export interface Product {
  id: string;
  sku: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  registration_number?: string;
  status: 'In Development' | 'Approved' | 'Discontinued';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  changes_summary?: string;
  effective_date?: string;
  status: 'Draft' | 'Active' | 'Retired';
  linked_sop_id?: string;
  linked_capa_id?: string;
  created_by: string;
  created_at: string;
}

export interface ProductFilters {
  status?: string | 'all';
  category?: string | 'all';
  manufacturer?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
}
