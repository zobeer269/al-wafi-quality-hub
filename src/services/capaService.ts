
import { supabase } from "@/integrations/supabase/client";
import { CAPA, CAPAStatus, CAPAPriority, ApprovalStatus, CAPAType } from "@/types/document";
import { toast } from "@/components/ui/use-toast";

export interface CAPAInput {
  title: string;
  description: string;
  type: CAPAType;
  priority: CAPAPriority;
  status?: CAPAStatus;
  dueDate?: string;
  assignedTo?: string;
  root_cause?: string;
  action_plan?: string;
  linked_nc_id?: string;
  linked_audit_finding_id?: string;
  effectiveness_check_required?: boolean;
  effectiveness_verified?: boolean;
  tags?: string[];
  ai_notes?: string;
}

// Fetch CAPAs for dropdown selection
export const fetchCAPAs = async () => {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CAPAs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: CAPAInput) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const newCAPA = {
      title: capaData.title || '',
      description: capaData.description || '',
      priority: capaData.priority || 2,
      capa_type: capaData.type || 'Corrective',
      status: capaData.status || 'Open',
      action_plan: capaData.action_plan || null,
      root_cause: capaData.root_cause || null,
      due_date: capaData.dueDate || null,
      created_by: userData.user?.id || '',
      assigned_to: capaData.assignedTo || null,
      linked_nc_id: capaData.linked_nc_id || null,
      linked_audit_finding_id: capaData.linked_audit_finding_id || null,
      effectiveness_check_required: capaData.effectiveness_check_required || false,
      effectiveness_verified: false,
      tags: capaData.tags || [],
      number: generateCAPANumber()
    };
    
    const { data, error } = await supabase
      .from('capas')
      .insert([newCAPA])
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
    
    return data;
  } catch (error) {
    console.error('Error creating CAPA:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

// Helper function to generate a CAPA number
function generateCAPANumber(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `CAPA-${year}${month}${day}-${random}`;
}

// Update an existing CAPA
export const updateCAPA = async (id: string, capaData: Partial<CAPA>) => {
  try {
    const updates: any = {
      title: capaData.title,
      description: capaData.description,
      priority: capaData.priority,
      capa_type: capaData.type,
      status: capaData.status,
      action_plan: capaData.action_plan,
      root_cause: capaData.root_cause,
      due_date: capaData.dueDate,
      assigned_to: capaData.assignedTo,
      linked_nc_id: capaData.linked_nc_id,
      linked_audit_finding_id: capaData.linkedAuditFindingId,
      effectiveness_check_required: capaData.effectiveness_check_required,
      effectiveness_verified: capaData.effectiveness_verified,
      closed_date: capaData.status === 'Closed' ? new Date().toISOString() : capaData.closed_date,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('capas')
      .update(updates)
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
    
    return data;
  } catch (error) {
    console.error('Error updating CAPA:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

// Add the missing functions that were referenced in CAPADetail
export const userCanApprove = async (): Promise<boolean> => {
  try {
    // Use existing RPC function to check if user can approve
    const { data, error } = await supabase.rpc('can_approve_products');
    
    if (error) {
      console.error('Error checking approval permissions:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in userCanApprove:', error);
    return false;
  }
};

export const getUserName = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User';
  } catch (error) {
    console.error('Error getting user name:', error);
    return null;
  }
};

export const approveCAPA = async (
  capaId: string, 
  userId: string, 
  approvalAction: ApprovalStatus,
  reason?: string
): Promise<boolean> => {
  try {
    // Update the CAPA status and approval information
    const { error: updateError } = await supabase
      .from('capas')
      .update({
        approval_status: approvalAction,
        approved_by: userId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', capaId);
      
    if (updateError) {
      throw updateError;
    }

    toast({
      title: "Success",
      description: `CAPA ${approvalAction === 'Approved' ? 'approved' : 'rejected'} successfully`,
    });
    
    return true;
  } catch (error) {
    console.error('Error in approveCAPA:', error);
    toast({
      title: "Error",
      description: `Failed to ${approvalAction === 'Approved' ? 'approve' : 'reject'} CAPA`,
      variant: "destructive",
    });
    return false;
  }
};

// Add getCAPAStatistics function to fix the error in CAPA.tsx
export const getCAPAStatistics = async () => {
  try {
    const { data: openCAPAs, error: openError } = await supabase
      .from('capas')
      .select('count')
      .eq('status', 'Open')
      .single();
      
    const { data: inProgressCAPAs, error: inProgressError } = await supabase
      .from('capas')
      .select('count')
      .eq('status', 'In Progress')
      .single();
      
    const { data: closedCAPAs, error: closedError } = await supabase
      .from('capas')
      .select('count')
      .eq('status', 'Closed')
      .single();
      
    if (openError || inProgressError || closedError) {
      console.error('Error fetching CAPA statistics');
      return {
        open: 0,
        inProgress: 0,
        closed: 0
      };
    }
    
    return {
      open: openCAPAs?.count || 0,
      inProgress: inProgressCAPAs?.count || 0,
      closed: closedCAPAs?.count || 0
    };
  } catch (error) {
    console.error('Error in getCAPAStatistics:', error);
    return {
      open: 0,
      inProgress: 0,
      closed: 0
    };
  }
};
