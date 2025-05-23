
import { Product } from "./product";
import { NonConformance } from "./nonConformance";
import { CAPA, ApprovalStatus } from "./document";

export type ComplaintSource = 'Customer' | 'Internal' | 'Distributor' | 'Inspector';
export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintStatus = 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  source: "Customer" | "Internal" | "Distributor" | "Inspector";
  product_id?: string;
  batch_number?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Under Investigation" | "Resolved" | "Closed";
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
  product_name?: string;
}


export interface ComplaintFilters {
  status?: ComplaintStatus;
  severity?: ComplaintSeverity;
  product_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface NonConformance {
  id: string;
  nc_number: string;
  title: string;
  description: string;
  source: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Investigation" | "Containment" | "Correction" | "Verification" | "Closed";
  reported_by: string;
  reported_date: string;
  assigned_to?: string | null;
  capa_required: boolean;
  category: string;
  containment_action?: string | null;
  correction?: string | null;
  immediate_action?: string | null;
  final_action?: string | null;
  linked_batch?: string | null;
  linked_supplier_id?: string | null;
  linked_capa_id?: string | null;
  tags?: string[];
  ai_notes?: string | null;
  created_at: string;
  updated_at: string;
  closed_date?: string | null;
  closed_by?: string | null;
  root_cause?: string | null;
  lot_number?: string | null;
  product_affected?: string | null;
}
