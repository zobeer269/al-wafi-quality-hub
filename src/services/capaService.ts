import { supabase } from "@/integrations/supabase/client";
import { CAPA } from "@/types/document";
import { toast } from "@/components/ui/use-toast";

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
    
    return data.map((capa) => ({
      id: capa.id,
      number: capa.number,
      title: capa.title,
      description: capa.description,
      priority: capa.priority,
      status: capa.status,
      capa_type: capa.capa_type,
      action_plan: capa.action_plan,
      root_cause: capa.root_cause,
      created_by: capa.created_by,
      assigned_to: capa.assigned_to,
      created_at: capa.created_at,
      due_date: capa.due_date,
      closed_date: capa.closed_date,
      effectiveness_check_required: capa.effectiveness_check_required,
      effectiveness_verified: capa.effectiveness_verified,
      linked_nc_id: capa.linked_nc_id,
      updated_at: capa.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching CAPAs:', error);
    return [];
  }
};

// Create a new CAPA
export const createCAPA = async (capaData: Partial<CAPA>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const newCAPA = {
      title: capaData.title || '',
      description: capaData.description || '',
      priority: capaData.priority || 2,
      capa_type: capaData.capa_type || 'Corrective',
      status: 'Open',
      action_plan: capaData.action_plan || null,
      root_cause: capaData.root_cause || null,
      due_date: capaData.due_date || null,
      created_by: userData.user?.id || '',
      assigned_to: capaData.assigned_to || null,
      linked_nc_id: capaData.linked_nc_id || null,
      effectiveness_check_required: capaData.effectiveness_check_required || false,
      effectiveness_verified: false,
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

// Update an existing CAPA
export const updateCAPA = async (id: string, capaData: Partial<CAPA>) => {
  try {
    const updates = {
      title: capaData.title,
      description: capaData.description,
      priority: capaData.priority,
      capa_type: capaData.capa_type,
      status: capaData.status,
      action_plan: capaData.action_plan,
      root_cause: capaData.root_cause,
      due_date: capaData.due_date,
      assigned_to: capaData.assigned_to,
      linked_nc_id: capaData.linked_nc_id,
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

// Instead of direct interactions with the signatures table, we'll use RPC functions
export const approveCAPA = async (
  capaId: string, 
  userId: string, 
  approval: boolean,
  reason?: string
): Promise<boolean> => {
  try {
    // Update the CAPA status and approval information
    const { error: updateError } = await supabase
      .from('capas')
      .update({
        status: approval ? 'Approved' : 'Rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', capaId);
      
    if (updateError) {
      throw updateError;
    }
    
    // Instead of directly interacting with signatures table, use a function call to the backend
    const { data: rpcResponse, error: rpcError } = await supabase.rpc(
      'can_approve_products'
    );
    
    if (rpcError) {
      console.error('Error with RPC call:', rpcError);
      throw rpcError;
    }

    toast({
      title: "Success",
      description: `CAPA ${approval ? 'approved' : 'rejected'} successfully`,
    });
    
    return true;
  } catch (error) {
    console.error('Error in approveCAPA:', error);
    toast({
      title: "Error",
      description: `Failed to ${approval ? 'approve' : 'reject'} CAPA`,
      variant: "destructive",
    });
    return false;
  }
};
