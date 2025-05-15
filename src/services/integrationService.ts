
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Simple types for integration
export interface AuditFinding {
  id: string;
  finding_number: string;
  audit_id: string;
  description: string;
  severity: string;
  status: string;
}

export interface CAPA {
  id: string;
  number: string;
  title: string;
  capa_type: string;
  status: string;
}

export async function getOpenAuditFindings(): Promise<AuditFinding[]> {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .in('status', ['Open', 'In Progress'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit findings:', error);
      toast({
        title: "Error",
        description: `Failed to fetch audit findings: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    return data as AuditFinding[];
  } catch (error) {
    console.error('Error in getOpenAuditFindings:', error);
    return [];
  }
}

export async function getOpenCAPAs(): Promise<CAPA[]> {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .in('status', ['Open', 'Investigation', 'In Progress'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CAPAs:', error);
      toast({
        title: "Error",
        description: `Failed to fetch CAPAs: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    return data as CAPA[];
  } catch (error) {
    console.error('Error in getOpenCAPAs:', error);
    return [];
  }
}

export async function getAuditFindingById(id: string): Promise<AuditFinding | null> {
  try {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching audit finding:', error);
      return null;
    }

    return data as AuditFinding;
  } catch (error) {
    console.error('Error in getAuditFindingById:', error);
    return null;
  }
}

export async function getCAPAById(id: string): Promise<CAPA | null> {
  try {
    const { data, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching CAPA:', error);
      return null;
    }

    return data as CAPA;
  } catch (error) {
    console.error('Error in getCAPAById:', error);
    return null;
  }
}

export async function createCAPAFromNC(ncData: {
  title: string;
  description: string;
  severity: string;
  nc_id: string;
  reported_by: string;
}): Promise<CAPA | null> {
  try {
    // Determine CAPA type based on NC severity
    const capaType = ncData.severity === 'Critical' ? 'Corrective' : 'Both';
    
    const { data, error } = await supabase
      .from('capas')
      .insert({
        title: `CAPA for ${ncData.title}`,
        description: ncData.description,
        capa_type: capaType,
        priority: ncData.severity === 'Critical' ? 3 : ncData.severity === 'Major' ? 2 : 1,
        created_by: ncData.reported_by,
        status: 'Open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Error",
        description: `Failed to create CAPA: ${error.message}`,
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    toast({
      title: "Success",
      description: `CAPA ${data.number} created successfully`
    });

    return data as CAPA;
  } catch (error) {
    console.error('Error in createCAPAFromNC:', error);
    return null;
  }
}
