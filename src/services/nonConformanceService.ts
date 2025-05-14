
import { supabase } from "@/integrations/supabase/client";
import type { NonConformance, NonConformanceAttachment, NonConformanceFilters, NonConformanceSummary } from "@/types/nonConformance";
import { toast } from "@/hooks/use-toast";

export async function getNonConformances(filters?: NonConformanceFilters): Promise<NonConformance[]> {
  try {
    let query = supabase
      .from('non_conformances')
      .select('*')
      .order('reported_date', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.assignedTo && filters.assignedTo !== 'all') {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    if (filters?.dateFrom) {
      query = query.gte('reported_date', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('reported_date', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching non-conformances:', error);
      throw new Error(error.message);
    }

    return data as NonConformance[];
  } catch (error) {
    console.error('Error in getNonConformances:', error);
    return [];
  }
}

export async function getNonConformanceById(id: string): Promise<NonConformance | null> {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching non-conformance:', error);
      throw new Error(error.message);
    }

    return data as NonConformance;
  } catch (error) {
    console.error('Error in getNonConformanceById:', error);
    return null;
  }
}

export async function createNonConformance(nonConformance: Omit<NonConformance, 'id' | 'nc_number' | 'created_at' | 'updated_at'>): Promise<NonConformance | null> {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .insert([nonConformance])
      .select()
      .single();

    if (error) {
      console.error('Error creating non-conformance:', error);
      toast({
        title: "Error",
        description: `Failed to create non-conformance: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    toast({
      title: "Success",
      description: `Non-conformance ${data.nc_number} created successfully`
    });

    return data as NonConformance;
  } catch (error) {
    console.error('Error in createNonConformance:', error);
    return null;
  }
}

export async function updateNonConformance(id: string, updates: Partial<NonConformance>): Promise<NonConformance | null> {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating non-conformance:', error);
      toast({
        title: "Error",
        description: `Failed to update non-conformance: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    toast({
      title: "Success",
      description: `Non-conformance ${data.nc_number} updated successfully`
    });

    return data as NonConformance;
  } catch (error) {
    console.error('Error in updateNonConformance:', error);
    return null;
  }
}

export async function getNonConformanceSummary(): Promise<NonConformanceSummary[]> {
  try {
    const { data, error } = await supabase
      .from('non_conformance_summary')
      .select('*');

    if (error) {
      console.error('Error fetching non-conformance summary:', error);
      throw new Error(error.message);
    }

    return data as NonConformanceSummary[];
  } catch (error) {
    console.error('Error in getNonConformanceSummary:', error);
    return [];
  }
}

export async function uploadAttachment(
  ncId: string, 
  file: File, 
  uploadedBy: string, 
  description?: string
): Promise<NonConformanceAttachment | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${ncId}/${Date.now()}.${fileExt}`;
    const filePath = `nc_attachments/${fileName}`;

    // Upload file to storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('attachments')
      .upload(filePath, file);

    if (fileError) {
      console.error('Error uploading file:', fileError);
      throw new Error(fileError.message);
    }

    // Get public URL for the file
    const { data: urlData } = supabase
      .storage
      .from('attachments')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Create attachment record in the database
    const attachment = {
      nc_id: ncId,
      file_name: file.name,
      file_url: fileUrl,
      file_type: file.type,
      uploaded_by: uploadedBy,
      description
    };

    const { data, error } = await supabase
      .from('nc_attachments')
      .insert([attachment])
      .select()
      .single();

    if (error) {
      console.error('Error creating attachment record:', error);
      throw new Error(error.message);
    }

    return data as NonConformanceAttachment;
  } catch (error) {
    console.error('Error in uploadAttachment:', error);
    return null;
  }
}

export async function getNCCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('category');

    if (error) {
      console.error('Error fetching NC categories:', error);
      return [];
    }

    // Extract unique categories
    return [...new Set(data.map(item => item.category))];
  } catch (error) {
    console.error('Error in getNCCategories:', error);
    return [];
  }
}
