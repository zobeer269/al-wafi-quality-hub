
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ChangeControlStatus = 'Open' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented';
export type RiskRating = 'Low' | 'Medium' | 'High';
export type AffectedArea = 'Process' | 'Product' | 'Document' | 'Supplier' | 'System';

export interface ChangeControl {
  id: string;
  title: string;
  change_reason: string;
  initiator: string;
  affected_area: AffectedArea;
  linked_document_id?: string;
  linked_product_id?: string;
  linked_risk_id?: string;
  status: ChangeControlStatus;
  impact_assessment?: string;
  risk_rating?: RiskRating;
  reviewed_by?: string;
  approved_by?: string;
  implementation_plan?: string;
  implementation_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChangeControlHistory {
  id: string;
  change_control_id: string;
  status: ChangeControlStatus;
  comments?: string;
  changed_by: string;
  created_at?: string;
}

export async function fetchChangeControls(filters: {
  status?: ChangeControlStatus;
  area?: AffectedArea;
  fromDate?: string;
  toDate?: string;
} = {}) {
  try {
    let query = supabase
      .from("change_controls")
      .select("*");
    
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    
    if (filters.area) {
      query = query.eq("affected_area", filters.area);
    }
    
    if (filters.fromDate) {
      query = query.gte("created_at", filters.fromDate);
    }
    
    if (filters.toDate) {
      query = query.lte("created_at", filters.toDate);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching change controls:", error);
    toast.error("Failed to fetch change controls");
    return [];
  }
}

export async function fetchChangeControlById(id: string) {
  try {
    const { data, error } = await supabase
      .from("change_controls")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching change control:", error);
    toast.error("Failed to fetch change control details");
    return null;
  }
}

export async function fetchChangeControlHistory(changeControlId: string) {
  try {
    const { data, error } = await supabase
      .from("change_control_history")
      .select("*")
      .eq("change_control_id", changeControlId)
      .order("created_at", { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching change control history:", error);
    toast.error("Failed to fetch history");
    return [];
  }
}

export async function createChangeControl(changeControl: Omit<ChangeControl, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from("change_controls")
      .insert(changeControl)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success("Change control created successfully");
    return data;
  } catch (error) {
    console.error("Error creating change control:", error);
    toast.error("Failed to create change control");
    return null;
  }
}

export async function updateChangeControl(id: string, changes: Partial<ChangeControl>) {
  try {
    const { data, error } = await supabase
      .from("change_controls")
      .update(changes)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success("Change control updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating change control:", error);
    toast.error("Failed to update change control");
    return null;
  }
}

export async function submitForReview(id: string) {
  return updateChangeControl(id, { status: 'Under Review' });
}

export async function approveChangeControl(id: string, userId: string) {
  return updateChangeControl(id, { 
    status: 'Approved',
    approved_by: userId
  });
}

export async function rejectChangeControl(id: string) {
  return updateChangeControl(id, { status: 'Rejected' });
}

export async function implementChangeControl(id: string) {
  return updateChangeControl(id, { 
    status: 'Implemented',
    implementation_date: new Date().toISOString()
  });
}
