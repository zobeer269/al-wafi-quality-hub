
import { supabase } from "@/integrations/supabase/client";
import { Complaint, ComplaintFilters, ComplaintStatus } from "@/types/complaint";
import { toast } from "@/components/ui/use-toast";

// Helper function to safely convert database response to Complaint type
const toComplaint = (data: any): Complaint => {
  if (!data) return null as unknown as Complaint;
  
  return {
    id: data.id || '',
    reference_number: data.reference_number || '',
    title: data.title || '',
    description: data.description || '',
    source: data.source || '',
    product_id: data.product_id || undefined,
    product: data.products || undefined,
    batch_number: data.batch_number || undefined,
    severity: data.severity || 'Medium',
    status: data.status || 'Open',
    linked_nc_id: data.linked_nc_id || undefined,
    linked_capa_id: data.linked_capa_id || undefined,
    assigned_to: data.assigned_to || undefined,
    reported_by: data.reported_by || '',
    reported_at: data.reported_at || new Date().toISOString(),
    closed_at: data.closed_at || undefined,
    closed_by: data.closed_by || undefined,
    resolution_notes: data.resolution_notes || undefined,
    justification: data.justification || undefined,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString()
  };
};

// Fetch complaints with optional filters
export const fetchComplaints = async (filters?: ComplaintFilters) => {
  try {
    let query = supabase
      .from('complaints')
      .select('*, products:product_id (id, name, sku)');
    
    if (filters) {
      // Apply filters if they are provided
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.product_id) {
        query = query.eq('product_id', filters.product_id);
      }
      
      if (filters.date_from) {
        query = query.gte('reported_at', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('reported_at', filters.date_to);
      }
    }
    
    query = query.order('reported_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: `Failed to fetch complaints: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }
    
    return (data || []).map(item => toComplaint(item));
  } catch (error) {
    console.error('Unexpected error fetching complaints:', error);
    return [];
  }
};

// Fetch a single complaint by ID
export const fetchComplaintById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        products:product_id (id, name, sku)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching complaint:', error);
      toast({
        title: "Error",
        description: `Failed to fetch complaint details: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    return toComplaint(data);
  } catch (error) {
    console.error('Unexpected error fetching complaint:', error);
    return null;
  }
};

// Create a new complaint
export const createComplaint = async (complaintData: Partial<Complaint>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const newComplaint = {
      ...complaintData,
      reported_by: userData.user?.id || '',
      status: 'Open' as ComplaintStatus,
    };
    
    const { data, error } = await supabase
      .from('complaints')
      .insert([newComplaint])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating complaint:', error);
      toast({
        title: "Error",
        description: `Failed to create complaint: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: `Complaint ${data.reference_number} created successfully`,
    });
    
    return toComplaint(data);
  } catch (error) {
    console.error('Unexpected error creating complaint:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while creating the complaint",
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing complaint
export const updateComplaint = async (id: string, complaintData: Partial<Complaint>) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update(complaintData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: `Failed to update complaint: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: `Complaint ${data.reference_number} updated successfully`,
    });
    
    return toComplaint(data);
  } catch (error) {
    console.error('Unexpected error updating complaint:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while updating the complaint",
      variant: "destructive",
    });
    return null;
  }
};

// Assign a complaint to a user
export const assignComplaint = async (id: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_to: userId,
        status: 'Under Investigation',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error assigning complaint:', error);
      toast({
        title: "Error",
        description: `Failed to assign complaint: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: `Complaint assigned successfully`,
    });
    
    return toComplaint(data);
  } catch (error) {
    console.error('Error assigning complaint:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

// Close a complaint
export const closeComplaint = async (
  id: string, 
  justification: string, 
  resolution?: string
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('complaints')
      .update({
        status: 'Closed',
        closed_at: new Date().toISOString(),
        closed_by: userData.user?.id,
        resolution_notes: resolution,
        justification: justification,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error closing complaint:', error);
      toast({
        title: "Error",
        description: `Failed to close complaint: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: `Complaint closed successfully`,
    });
    
    return toComplaint(data);
  } catch (error) {
    console.error('Error closing complaint:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

// Link complaint to NC or CAPA
export const linkComplaint = async (
  id: string, 
  linkedType: 'nc' | 'capa', 
  linkedId: string
) => {
  try {
    const updateData = linkedType === 'nc' 
      ? { linked_nc_id: linkedId } 
      : { linked_capa_id: linkedId };
      
    const { data, error } = await supabase
      .from('complaints')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error linking complaint:', error);
      toast({
        title: "Error",
        description: `Failed to link complaint: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Success",
      description: `Complaint linked successfully`,
    });
    
    return toComplaint(data);
  } catch (error) {
    console.error('Error linking complaint:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};

// Fetch complaint statistics
export const getComplaintStatistics = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('status, severity')
      .order('reported_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching complaint statistics:', error);
      return {
        total: 0,
        open: 0,
        underInvestigation: 0,
        resolved: 0,
        closed: 0,
        critical: 0
      };
    }
    
    if (!data) return {
      total: 0,
      open: 0,
      underInvestigation: 0,
      resolved: 0,
      closed: 0,
      critical: 0
    };
    
    return {
      total: data.length,
      open: data.filter(item => item.status === 'Open').length,
      underInvestigation: data.filter(item => item.status === 'Under Investigation').length,
      resolved: data.filter(item => item.status === 'Resolved').length,
      closed: data.filter(item => item.status === 'Closed').length,
      critical: data.filter(item => item.severity === 'Critical').length,
    };
  } catch (error) {
    console.error('Error computing complaint statistics:', error);
    return {
      total: 0,
      open: 0,
      underInvestigation: 0,
      resolved: 0,
      closed: 0,
      critical: 0
    };
  }
};
