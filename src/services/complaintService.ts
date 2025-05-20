import { supabase } from "@/integrations/supabase/client";
import { Complaint } from "@/types/document";
import { toast } from "@/hooks/use-toast";

// Mock data for development - replace with actual implementation
export const fetchComplaints = async (filters: any = {}) => {
  try {
    let query = supabase.from('complaints').select('*, products(name)');
    
    // Apply filters
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.product_id) query = query.eq('product_id', filters.product_id);
    if (filters.date_from) query = query.gte('reported_at', filters.date_from);
    if (filters.date_to) query = query.lte('reported_at', filters.date_to);
    
    const { data, error } = await query.order('reported_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching complaints:', error);
      return [];
    }
    
    // Process data to match our Complaint interface
    return data.map(item => ({
      id: item.id,
      reference_number: item.reference_number,
      title: item.title,
      description: item.description,
      source: item.source,
      severity: item.severity,
      status: item.status,
      product_id: item.product_id,
      product_name: item.products?.name || 'Unknown product',
      batch_number: item.batch_number,
      linked_nc_id: item.linked_nc_id,
      linked_capa_id: item.linked_capa_id,
      assigned_to: item.assigned_to,
      reported_by: item.reported_by,
      reported_at: item.reported_at,
      closed_at: item.closed_at,
      closed_by: item.closed_by,
      resolution_notes: item.resolution_notes,
      justification: item.justification,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error('Error in fetchComplaints:', error);
    return [];
  }
};

export const fetchComplaintById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*, products(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching complaint:', error);
      return null;
    }
    
    return {
      id: data.id,
      reference_number: data.reference_number,
      title: data.title,
      description: data.description,
      source: data.source,
      severity: data.severity,
      status: data.status,
      product_id: data.product_id,
      product_name: data.products?.name || 'Unknown product',
      batch_number: data.batch_number,
      linked_nc_id: data.linked_nc_id,
      linked_capa_id: data.linked_capa_id,
      assigned_to: data.assigned_to,
      reported_by: data.reported_by,
      reported_at: data.reported_at,
      closed_at: data.closed_at,
      closed_by: data.closed_by,
      resolution_notes: data.resolution_notes,
      justification: data.justification,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as Complaint;
  } catch (error) {
    console.error('Error in fetchComplaintById:', error);
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
    
    // Extract only fields that exist in the database table
    const dbComplaint = {
      title: newComplaint.title,
      description: newComplaint.description,
      reference_number: newComplaint.reference_number || `COMP-${Date.now()}`,
      source: newComplaint.source,
      product_id: newComplaint.product_id,
      batch_number: newComplaint.batch_number,
      severity: newComplaint.severity,
      status: newComplaint.status,
      linked_nc_id: newComplaint.linked_nc_id,
      linked_capa_id: newComplaint.linked_capa_id,
      assigned_to: newComplaint.assigned_to,
      reported_by: newComplaint.reported_by
    };
    
    const { data, error } = await supabase
      .from('complaints')
      .insert([dbComplaint])
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
