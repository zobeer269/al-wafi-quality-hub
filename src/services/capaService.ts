import { CAPA, CAPAPriority, ApprovalStatus } from "@/types/document";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

// Types for Supabase
type SupabaseCapa = Database["public"]["Tables"]["capas"]["Row"];
type SupabaseCapaInsert = Database["public"]["Tables"]["capas"]["Insert"];
type SupabaseCapaUpdate = Database["public"]["Tables"]["capas"]["Update"];

// Convert Supabase CAPA to app CAPA type
export const convertToCAPAType = (capa: SupabaseCapa): CAPA => {
  return {
    id: capa.id,
    number: capa.number,
    title: capa.title,
    type: capa.capa_type,
    status: capa.status,
    priority: capa.priority as CAPAPriority,
    createdDate: capa.created_at || "",
    dueDate: capa.due_date || undefined,
    assignedTo: capa.assigned_to || undefined,
    description: capa.description,
    root_cause: capa.root_cause || undefined,
    action_plan: capa.action_plan || undefined,
    closed_date: capa.closed_date || undefined,
    effectiveness_check_required: capa.effectiveness_check_required || false,
    effectiveness_verified: capa.effectiveness_verified || false,
    created_by: capa.created_by,
    linked_nc_id: capa.linked_nc_id || undefined,
    linked_audit_finding_id: capa.linked_audit_finding_id || undefined,
    approval_status: (capa.approval_status as ApprovalStatus) || "Pending",
    approved_by: capa.approved_by || undefined,
    approved_at: capa.approved_at || undefined,
  };
};

// Convert app CAPA to Supabase insert type
export const convertToSupabaseInsert = (capa: Partial<CAPA>, userId: string): SupabaseCapaInsert => {
  return {
    title: capa.title!,
    number: capa.number!,
    description: capa.description!,
    capa_type: capa.type!,
    status: capa.status || "Open",
    priority: capa.priority || 2,
    due_date: capa.dueDate ? new Date(capa.dueDate).toISOString() : null,
    assigned_to: capa.assignedTo || null,
    created_by: userId,
    root_cause: capa.root_cause || null,
    action_plan: capa.action_plan || null,
    linked_nc_id: capa.linked_nc_id || null,
    linked_audit_finding_id: capa.linked_audit_finding_id || null,
    approval_status: capa.approval_status || "Pending",
  };
};

// Convert app CAPA to Supabase update type
export const convertToSupabaseUpdate = (capa: Partial<CAPA>): SupabaseCapaUpdate => {
  return {
    title: capa.title,
    description: capa.description,
    capa_type: capa.type,
    status: capa.status,
    priority: capa.priority,
    due_date: capa.dueDate ? new Date(capa.dueDate).toISOString() : undefined,
    assigned_to: capa.assignedTo,
    root_cause: capa.root_cause,
    action_plan: capa.action_plan,
    closed_date: capa.closed_date ? new Date(capa.closed_date).toISOString() : undefined,
    effectiveness_check_required: capa.effectiveness_check_required,
    effectiveness_verified: capa.effectiveness_verified,
    updated_at: new Date().toISOString(),
    linked_nc_id: capa.linked_nc_id,
    linked_audit_finding_id: capa.linked_audit_finding_id,
    approval_status: capa.approval_status,
    approved_by: capa.approved_by,
    approved_at: capa.approved_at ? new Date(capa.approved_at).toISOString() : undefined,
  };
};

// Fetch all CAPAs
export const fetchCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from("capas")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching CAPAs:", error);
      throw error;
    }
    
    return data.map(convertToCAPAType);
  } catch (error) {
    console.error("Error in fetchCAPAs:", error);
    toast({
      title: "Error",
      description: "Failed to fetch CAPAs. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>, userId: string): Promise<CAPA | null> => {
  try {
    const capaToInsert = convertToSupabaseInsert(capaData, userId);
    
    const { data, error } = await supabase
      .from("capas")
      .insert(capaToInsert)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating CAPA:", error);
      throw error;
    }
    
    toast({
      title: "Success",
      description: `CAPA ${data.number} created successfully`,
    });
    
    return convertToCAPAType(data);
  } catch (error) {
    console.error("Error in createCAPA:", error);
    toast({
      title: "Error",
      description: "Failed to create CAPA. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing CAPA
export const updateCAPA = async (id: string, capaData: Partial<CAPA>): Promise<CAPA | null> => {
  try {
    const updatedData = convertToSupabaseUpdate(capaData);
    
    const { data, error } = await supabase
      .from("capas")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating CAPA:", error);
      throw error;
    }
    
    toast({
      title: "Success",
      description: `CAPA ${data.number} updated successfully`,
    });
    
    return convertToCAPAType(data);
  } catch (error) {
    console.error("Error in updateCAPA:", error);
    toast({
      title: "Error",
      description: "Failed to update CAPA. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Get a single CAPA by ID
export const getCAPA = async (id: string): Promise<CAPA | null> => {
  try {
    const { data, error } = await supabase
      .from("capas")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Error fetching CAPA:", error);
      throw error;
    }
    
    return convertToCAPAType(data);
  } catch (error) {
    console.error("Error in getCAPA:", error);
    toast({
      title: "Error",
      description: "Failed to fetch CAPA details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Delete a CAPA
export const deleteCAPA = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("capas")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting CAPA:", error);
      throw error;
    }
    
    toast({
      title: "Success",
      description: "CAPA deleted successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error in deleteCAPA:", error);
    toast({
      title: "Error",
      description: "Failed to delete CAPA. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Filter CAPAs by status
export const filterCAPAsByStatus = async (status: "Open" | "Investigation" | "In Progress" | "Closed"): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from("capas")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error filtering CAPAs:", error);
      throw error;
    }
    
    return data.map(convertToCAPAType);
  } catch (error) {
    console.error("Error in filterCAPAsByStatus:", error);
    toast({
      title: "Error",
      description: "Failed to filter CAPAs. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Get CAPA statistics
export const getCAPAStatistics = async (): Promise<{
  high: number;
  medium: number;
  low: number;
  closed: number;
}> => {
  try {
    // Get high priority open CAPAs
    const { data: highPriority, error: highError } = await supabase
      .from("capas")
      .select("id")
      .eq("priority", 3)
      .neq("status", "Closed");
    
    // Get medium priority open CAPAs
    const { data: mediumPriority, error: mediumError } = await supabase
      .from("capas")
      .select("id")
      .eq("priority", 2)
      .neq("status", "Closed");
    
    // Get low priority open CAPAs
    const { data: lowPriority, error: lowError } = await supabase
      .from("capas")
      .select("id")
      .eq("priority", 1)
      .neq("status", "Closed");
    
    // Get closed CAPAs in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentClosed, error: closedError } = await supabase
      .from("capas")
      .select("id")
      .eq("status", "Closed")
      .gte("closed_date", thirtyDaysAgo.toISOString());
    
    if (highError || mediumError || lowError || closedError) {
      console.error("Error fetching CAPA statistics:", highError || mediumError || lowError || closedError);
      throw highError || mediumError || lowError || closedError;
    }
    
    return {
      high: highPriority?.length || 0,
      medium: mediumPriority?.length || 0,
      low: lowPriority?.length || 0,
      closed: recentClosed?.length || 0,
    };
  } catch (error) {
    console.error("Error in getCAPAStatistics:", error);
    return {
      high: 0,
      medium: 0,
      low: 0,
      closed: 0,
    };
  }
};

// Create a digital signature for approval or critical actions
export async function createSignature(data: {
  userId: string;
  action: string;
  module: string;
  referenceId: string;
  reason?: string;
}): Promise<string | null> {
  try {
    // Create a hash from user data and timestamp (simple simulation)
    const timestamp = new Date().toISOString();
    const signatureData = `${data.userId}-${data.action}-${timestamp}`;
    const encoder = new TextEncoder();
    const data2 = encoder.encode(signatureData);
    
    // Generate a signature hash (using Web Crypto API)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data2);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Store the signature in the database
    const { data: signature, error } = await supabase
      .from('signatures')
      .insert({
        user_id: data.userId,
        action: data.action,
        module: data.module,
        reference_id: data.referenceId,
        signature_hash: hashHex,
        reason: data.reason || null,
        ip_address: window.location.hostname, // Get client IP (simplified for demo)
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating signature:", error);
      throw error;
    }
    
    return signature ? signature.id : null;
  } catch (error) {
    console.error("Error in createSignature:", error);
    toast({
      title: "Error",
      description: "Failed to create digital signature",
      variant: "destructive",
    });
    return null;
  }
}

// Approve a CAPA with electronic signature
export async function approveCAPA(
  capaId: string, 
  userId: string, 
  status: ApprovalStatus, 
  reason?: string
): Promise<boolean> {
  try {
    // First create the signature
    const signatureId = await createSignature({
      userId,
      action: `CAPA ${status.toLowerCase()}`,
      module: "CAPA",
      referenceId: capaId,
      reason
    });
    
    if (!signatureId) {
      throw new Error("Failed to create signature");
    }
    
    // Now update the CAPA with approval information
    const { error } = await supabase
      .from("capas")
      .update({
        approval_status: status,
        approved_by: userId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", capaId);
      
    if (error) {
      console.error("Error approving CAPA:", error);
      throw error;
    }
    
    toast({
      title: "Success",
      description: `CAPA ${status === "Approved" ? "approved" : "rejected"} successfully`,
    });
    
    return true;
  } catch (error) {
    console.error("Error in approveCAPA:", error);
    toast({
      title: "Error",
      description: `Failed to ${status.toLowerCase()} CAPA`,
      variant: "destructive",
    });
    return false;
  }
}

// Check if user has approval permissions
export async function userCanApprove(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('can_approve');
    
    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Exception checking user role:", error);
    return false;
  }
}

// Get user's name by ID
export async function getUserName(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      console.error("Error getting user name:", error);
      return "Unknown User";
    }
    
    return `${data.first_name} ${data.last_name}`.trim() || "Unknown User";
  } catch (error) {
    console.error("Exception getting user name:", error);
    return "Unknown User";
  }
}
