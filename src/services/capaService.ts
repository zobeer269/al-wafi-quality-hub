
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAStatus, CAPAType, CAPAPriority, ApprovalStatus } from "@/types/document";
import { toast } from "@/components/ui/use-toast";

// Add the missing function to fetch all CAPAs
export const getCAPAs = async (): Promise<CAPA[]> => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      toast({
        title: "Error",
        description: `Failed to fetch CAPAs: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }
    
    // Map the database fields to our CAPA interface
    const capas: CAPA[] = data.map(item => ({
      id: item.id,
      number: item.number,
      title: item.title,
      description: item.description,
      type: item.capa_type,
      capa_type: item.capa_type,
      priority: item.priority,
      status: item.status,
      createdDate: item.created_at,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      root_cause: item.root_cause,
      action_plan: item.action_plan,
      created_by: item.created_by,
      closed_date: item.closed_date,
      effectiveness_check_required: item.effectiveness_check_required,
      effectiveness_verified: item.effectiveness_verified,
      linked_nc_id: item.linked_nc_id,
      linkedAuditFindingId: item.linked_audit_finding_id,
      approval_status: item.approval_status,
      approved_by: item.approved_by,
      approved_at: item.approved_at,
      updated_at: item.updated_at,
      tags: item.tags || []
    }));
    
    return capas;
  } catch (error) {
    console.error('Error in getCAPAs:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

// Fetch CAPAs for dropdown selection
export const fetchCAPAs = async () => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('id, number, title')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CAPAs for dropdown:', error);
      toast({
        title: "Error",
        description: `Failed to fetch CAPAs for dropdown: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching CAPAs for dropdown:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return [];
  }
};

export const createCAPA = async (capaData: Partial<CAPA>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();

    const newCAPA = {
      ...capaData,
      number: `CAPA-${Date.now()}`,
      created_by: userData.user?.id || '',
      created_at: new Date().toISOString(),
      status: 'Open' as CAPAStatus,
    };

    const dbCAPA = {
      number: newCAPA.number,
      title: newCAPA.title,
      description: newCAPA.description,
      capa_type: newCAPA.type || newCAPA.capa_type,
      priority: newCAPA.priority,
      status: newCAPA.status,
      created_by: newCAPA.created_by,
      created_at: newCAPA.created_at,
      due_date: newCAPA.dueDate,
      assigned_to: newCAPA.assignedTo,
      root_cause: newCAPA.root_cause,
      action_plan: newCAPA.action_plan,
      closed_date: newCAPA.closed_date,
      effectiveness_check_required: newCAPA.effectiveness_check_required,
      effectiveness_verified: newCAPA.effectiveness_verified,
      linked_nc_id: newCAPA.linked_nc_id,
      approval_status: newCAPA.approval_status
    };

    const { data, error } = await supabase
      .from('capas')
      .insert([dbCAPA])
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Error",
        description: `Failed to create CAPA: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: `CAPA ${data.number} created successfully`,
    });

    // Map the response to CAPA type
    const capaResult: CAPA = {
      id: data.id,
      number: data.number,
      title: data.title,
      description: data.description,
      type: data.capa_type,
      priority: data.priority,
      status: data.status,
      createdDate: data.created_at,
      created_by: data.created_by,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      root_cause: data.root_cause,
      action_plan: data.action_plan,
      closed_date: data.closed_date,
      effectiveness_check_required: data.effectiveness_check_required,
      effectiveness_verified: data.effectiveness_verified,
      linked_nc_id: data.linked_nc_id,
      approval_status: data.approval_status,
      updated_at: data.updated_at
    };

    return capaResult;
  } catch (error) {
    console.error('Unexpected error creating CAPA:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while creating the CAPA",
      variant: "destructive",
    });
    return null;
  }
};

export const updateCAPA = async (id: string, capaData: Partial<CAPA>) => {
  try {
    // Convert frontend model to database model
    const dbCAPAData: any = {
      ...(capaData.title !== undefined && { title: capaData.title }),
      ...(capaData.description !== undefined && { description: capaData.description }),
      ...(capaData.type !== undefined && { capa_type: capaData.type }),
      ...(capaData.capa_type !== undefined && { capa_type: capaData.capa_type }),
      ...(capaData.priority !== undefined && { priority: capaData.priority }),
      ...(capaData.status !== undefined && { status: capaData.status }),
      ...(capaData.dueDate !== undefined && { due_date: capaData.dueDate }),
      ...(capaData.assignedTo !== undefined && { assigned_to: capaData.assignedTo }),
      ...(capaData.root_cause !== undefined && { root_cause: capaData.root_cause }),
      ...(capaData.action_plan !== undefined && { action_plan: capaData.action_plan }),
      ...(capaData.closed_date !== undefined && { closed_date: capaData.closed_date }),
      ...(capaData.effectiveness_check_required !== undefined && 
        { effectiveness_check_required: capaData.effectiveness_check_required }),
      ...(capaData.effectiveness_verified !== undefined && 
        { effectiveness_verified: capaData.effectiveness_verified }),
      ...(capaData.approval_status !== undefined && { approval_status: capaData.approval_status }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('capas')
      .update(dbCAPAData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CAPA:', error);
      toast({
        title: "Error",
        description: `Failed to update CAPA: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: `CAPA ${data.number} updated successfully`,
    });
    
    // Map response to CAPA type
    const capaResult: CAPA = {
      id: data.id,
      number: data.number,
      title: data.title,
      description: data.description,
      type: data.capa_type,
      priority: data.priority,
      status: data.status,
      createdDate: data.created_at,
      created_by: data.created_by,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      root_cause: data.root_cause,
      action_plan: data.action_plan,
      closed_date: data.closed_date,
      effectiveness_check_required: data.effectiveness_check_required,
      effectiveness_verified: data.effectiveness_verified,
      linked_nc_id: data.linked_nc_id,
      approval_status: data.approval_status,
      updated_at: data.updated_at
    };

    return capaResult;
  } catch (error) {
    console.error('Unexpected error updating CAPA:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while updating the CAPA",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchCAPAById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching CAPA:', error);
      toast({
        title: "Error",
        description: `Failed to fetch CAPA details: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }

    // Map to CAPA type
    const capa: CAPA = {
      id: data.id,
      number: data.number,
      title: data.title,
      description: data.description,
      type: data.capa_type,
      priority: data.priority,
      status: data.status,
      createdDate: data.created_at,
      created_by: data.created_by,
      dueDate: data.due_date,
      assignedTo: data.assigned_to,
      root_cause: data.root_cause,
      action_plan: data.action_plan,
      closed_date: data.closed_date,
      effectiveness_check_required: data.effectiveness_check_required,
      effectiveness_verified: data.effectiveness_verified,
      linked_nc_id: data.linked_nc_id,
      approval_status: data.approval_status,
      approved_by: data.approved_by,
      approved_at: data.approved_at,
      updated_at: data.updated_at,
      tags: data.tags || []
    };
    
    return capa;
  } catch (error) {
    console.error('Unexpected error fetching CAPA:', error);
    return null;
  }
};

export const approveCAPA = async (id: string, userId: string, status: ApprovalStatus = "Approved", reason?: string) => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .update({
        approval_status: status,
        approved_by: userId,
        approved_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error approving CAPA:', error);
      return false;
    }
    
    // Record signature
    await supabase.from('signatures').insert({
      user_id: userId,
      action: status === "Approved" ? "approve" : "reject",
      module: "capa",
      reference_id: id,
      signature_hash: `${userId}-${Date.now()}`,
      reason: reason || `CAPA ${status.toLowerCase()}`
    });
    
    return true;
  } catch (error) {
    console.error('Error in approveCAPA:', error);
    return false;
  }
};

export const userCanApprove = async () => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) return false;
    return data.some((r) => r.role === "admin" || r.role === "qa");
  } catch (error) {
    console.error('Error in userCanApprove:', error);
    return false;
  }
};

export const getUserName = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .single();

    if (error || !data) return "Unknown";
    return `${data.first_name} ${data.last_name}`;
  } catch (error) {
    console.error('Error in getUserName:', error);
    return "Unknown";
  }
};
