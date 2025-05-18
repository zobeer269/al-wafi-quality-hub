
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
  product_id?: string | null;
  product?: Product | null;
  batch_number?: string | null;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  linked_nc_id?: string | null;
  linked_capa_id?: string | null;
  assigned_to?: string | null;
  reported_by: string;
  reported_at: string;
  closed_at?: string | null;
  closed_by?: string | null;
  resolution_notes?: string | null;
  justification?: string | null;
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
