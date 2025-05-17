
import { Product } from "./product";
import { NonConformance } from "./nonConformance";
import { CAPA } from "./document";

export type ComplaintSource = 'Customer' | 'Internal' | 'Distributor' | 'Inspector';
export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintStatus = 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  source: ComplaintSource;
  product_id?: string;
  product?: Product;
  batch_number?: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  linked_nc_id?: string;
  linked_capa_id?: string;
  assigned_to?: string;
  reported_by: string;
  reported_at: string;
  closed_at?: string;
  closed_by?: string;
  resolution_notes?: string;
  justification?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintFilters {
  status?: ComplaintStatus;
  severity?: ComplaintSeverity;
  product_id?: string;
  date_from?: string;
  date_to?: string;
}
