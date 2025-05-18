
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types
export type RiskRating = "Low" | "Medium" | "High";
export type AffectedArea = "Process" | "Product" | "Document" | "Supplier" | "System";
export type ChangeControlStatus = "Open" | "Under Review" | "Approved" | "Rejected" | "Implemented";

export interface ChangeControl {
  id: string;
  title: string;
  change_reason: string;
  affected_area: AffectedArea;
  impact_assessment?: string;
  risk_rating?: RiskRating;
  implementation_plan?: string;
  status: ChangeControlStatus;
  initiator: string;
  reviewed_by?: string;
  approved_by?: string;
  implementation_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch change controls with optional filters
export const fetchChangeControls = async (filters: {
  status?: ChangeControlStatus | "all";
  area?: AffectedArea | "all";
} = {}) => {
  let query = supabase.from("change_controls").select("*");

  // Apply filters if provided and not set to "all"
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.area && filters.area !== "all") {
    query = query.eq("affected_area", filters.area);
  }

  // Order by creation date (most recent first)
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching change controls:", error);
    toast.error("Failed to load change controls");
    return [];
  }

  return data as ChangeControl[];
};

// Fetch a single change control by ID
export const fetchChangeControlById = async (id: string) => {
  const { data, error } = await supabase
    .from("change_controls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching change control ${id}:`, error);
    toast.error("Failed to load change control details");
    throw error;
  }

  return data as ChangeControl;
};

// Create a new change control
export const createChangeControl = async (
  changeControl: Omit<ChangeControl, "id" | "status" | "created_at" | "updated_at">
) => {
  // Set initial status
  const newChangeControl = {
    ...changeControl,
    status: "Open" as ChangeControlStatus,
  };

  const { data, error } = await supabase
    .from("change_controls")
    .insert([newChangeControl])
    .select()
    .single();

  if (error) {
    console.error("Error creating change control:", error);
    toast.error("Failed to create change request");
    throw error;
  }

  toast.success("Change request created successfully");
  return data as ChangeControl;
};

// Update an existing change control
export const updateChangeControl = async (
  id: string,
  updates: Partial<ChangeControl>
) => {
  const { data, error } = await supabase
    .from("change_controls")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating change control:", error);
    toast.error("Failed to update change request");
    throw error;
  }

  toast.success("Change request updated successfully");
  return data as ChangeControl;
};

// Update the status of a change control
export const updateChangeControlStatus = async (
  id: string,
  status: ChangeControlStatus,
  userId: string,
  comments?: string
) => {
  // First update the change control status
  const { data, error } = await supabase
    .from("change_controls")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating change control status:", error);
    toast.error("Failed to update change request status");
    throw error;
  }

  // Then record the status change in history
  const { error: historyError } = await supabase
    .from("change_control_history")
    .insert([
      {
        change_control_id: id,
        status,
        changed_by: userId,
        comments,
      },
    ]);

  if (historyError) {
    console.error("Error recording change control history:", historyError);
  }

  toast.success(`Change request ${status.toLowerCase()} successfully`);
  return data as ChangeControl;
};

// Fetch the history of a change control
export const fetchChangeControlHistory = async (id: string) => {
  const { data, error } = await supabase
    .from("change_control_history")
    .select(`
      *,
      profiles:changed_by (first_name, last_name)
    `)
    .eq("change_control_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching change control history:", error);
    toast.error("Failed to load change history");
    return [];
  }

  return data;
};
