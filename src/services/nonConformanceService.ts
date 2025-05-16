import { supabase } from "@/integrations/supabase/client";
import type { 
  NonConformance, 
  NonConformanceAttachment, 
  NonConformanceFilters, 
  NonConformanceSummary,
  NonConformanceStatus, 
  NonConformanceSeverity 
} from "@/types/nonConformance";
import { toast } from "@/hooks/use-toast";
import { generateSmartTags, generateAINotes } from "@/utils/aiHelpers";

export interface CreateNonConformanceData {
  title: string;
  description: string;
  severity: NonConformanceSeverity;
  source?: string;
  status?: NonConformanceStatus;
  linked_batch?: string;
  linked_supplier_id?: string;
  linked_capa_id?: string;
  linked_audit_finding_id?: string;
  root_cause?: string;
  immediate_action?: string;
  reported_by: string;
  assigned_to?: string;
  due_date?: string;
  capa_required?: boolean;
  tags?: string[];
  ai_notes?: string;
}

export async function getNonConformances(filters?: NonConformanceFilters): Promise<NonConformance[]> {
  try {
    let query = supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.source && filters.source !== 'all') {
      query = query.eq('source', filters.source);
    }

    if (filters?.assignedTo && filters.assignedTo !== 'all') {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching non-conformances:', error);
      toast({
        title: "Error",
        description: `Failed to fetch non-conformances: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    // Generate tags for any NCs that don't have them yet
    const result = data.map(nc => {
      if (!nc.tags && nc.description) {
        const tags = generateSmartTags(nc.description, nc.severity, nc.source);
        return { ...nc, tags };
      }
      return nc;
    });

    return result as NonConformance[];
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
      toast({
        title: "Error",
        description: `Failed to fetch non-conformance details: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    return data as NonConformance;
  } catch (error) {
    console.error('Error in getNonConformanceById:', error);
    return null;
  }
}

export async function createNonConformance(nonConformance: CreateNonConformanceData): Promise<NonConformance | null> {
  try {
    // Generate AI tags and notes if not provided
    if (!nonConformance.tags) {
      nonConformance.tags = generateSmartTags(
        nonConformance.description, 
        nonConformance.severity, 
        nonConformance.source
      );
    }
    
    if (!nonConformance.ai_notes) {
      nonConformance.ai_notes = generateAINotes({
        ...nonConformance,
        id: '',  // Placeholder
        nc_number: '',  // Placeholder
        reported_by: nonConformance.reported_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: nonConformance.status || 'Open'
      });
    }
    
    // We need to explicitly cast using 'as any' to bypass TypeScript's strict checking
    // because Supabase's database trigger generates the nc_number
    const { data, error } = await supabase
      .from('non_conformances')
      .insert({
        ...nonConformance,
        status: 'Open'
      } as any)
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
    // If status is changing to 'Closed', add closed_at timestamp
    if (updates.status === 'Closed' && !updates.closed_at) {
      updates.closed_at = new Date().toISOString();
    }
    
    // Map 'Resolved' status (if present) to 'Verification' to match the database enum
    if (updates.status === 'Resolved' as any) {
      updates.status = 'Verification';
    }
    
    // If updating the description, regenerate tags
    if (updates.description) {
      const { data: existingData } = await supabase
        .from('non_conformances')
        .select('severity, source')
        .eq('id', id)
        .single();
        
      if (existingData) {
        updates.tags = generateSmartTags(
          updates.description, 
          updates.severity || existingData.severity,
          updates.source || existingData.source
        );
      }
    }
    
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

export async function deleteNonConformance(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting non-conformance:', error);
      toast({
        title: "Error",
        description: `Failed to delete non-conformance: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Non-conformance deleted successfully"
    });
    
    return true;
  } catch (error) {
    console.error('Error in deleteNonConformance:', error);
    return false;
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
      toast({
        title: "Error",
        description: `Failed to upload attachment: ${fileError.message}`,
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: `Failed to save attachment details: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    toast({
      title: "Success",
      description: "Attachment uploaded successfully"
    });

    return data as NonConformanceAttachment;
  } catch (error) {
    console.error('Error in uploadAttachment:', error);
    return null;
  }
}

export async function getAttachments(ncId: string): Promise<NonConformanceAttachment[]> {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('nc_id', ncId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching attachments:', error);
      throw new Error(error.message);
    }

    return data as NonConformanceAttachment[];
  } catch (error) {
    console.error('Error in getAttachments:', error);
    return [];
  }
}

export async function getNCSources(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('source')
      .not('source', 'is', null);

    if (error) {
      console.error('Error fetching NC sources:', error);
      return [];
    }

    // Extract unique sources
    return [...new Set(data.map(item => item.source).filter(Boolean))];
  } catch (error) {
    console.error('Error in getNCSources:', error);
    return [];
  }
}

// Find similar non-conformances based on description keywords
export async function findSimilarNonConformances(description: string, limit: number = 5): Promise<NonConformance[]> {
  try {
    // Extract key terms from description (simple approach)
    const keyTerms = description.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);
      
    if (keyTerms.length === 0) return [];
    
    // Search for similar non-conformances using key terms
    let query = supabase
      .from('non_conformances')
      .select('*');
      
    // Build full-text search condition for each term
    keyTerms.forEach(term => {
      query = query.or(`description.ilike.%${term}%`);
    });
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      console.error('Error finding similar non-conformances:', error);
      return [];
    }
    
    return data as NonConformance[];
  } catch (error) {
    console.error('Error in findSimilarNonConformances:', error);
    return [];
  }
}

// Analyze recurring issues
export async function analyzeRecurringIssues(timeframeDays: number = 180): Promise<{
  category: string;
  count: number;
  severity: string;
}[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
    
    const { data, error } = await supabase
      .from('non_conformances')
      .select('source, severity')
      .gte('created_at', cutoffDate.toISOString());
      
    if (error) {
      console.error('Error analyzing recurring issues:', error);
      return [];
    }
    
    // Group by source and severity
    const groupedIssues: Record<string, Record<string, number>> = {};
    
    data.forEach(nc => {
      const source = nc.source || 'Unknown';
      const severity = nc.severity;
      
      if (!groupedIssues[source]) {
        groupedIssues[source] = {};
      }
      
      if (!groupedIssues[source][severity]) {
        groupedIssues[source][severity] = 0;
      }
      
      groupedIssues[source][severity]++;
    });
    
    // Format the results
    const results: { category: string; count: number; severity: string }[] = [];
    
    Object.entries(groupedIssues).forEach(([source, severities]) => {
      Object.entries(severities).forEach(([severity, count]) => {
        results.push({
          category: source,
          count,
          severity
        });
      });
    });
    
    // Sort by count descending
    return results.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error in analyzeRecurringIssues:', error);
    return [];
  }
}
