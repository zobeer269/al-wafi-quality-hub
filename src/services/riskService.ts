
import { supabase } from "@/integrations/supabase/client";
import { Risk, Change } from "@/types/risk";
import { toast } from "@/components/ui/use-toast";

// Risks
export const fetchRisks = async (filters?: { status?: string; area?: string }) => {
  let query = supabase
    .from('risks')
    .select('*')
    .order('risk_score', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as "Open" | "Mitigated" | "Closed");
  }

  if (filters?.area && filters.area !== 'all') {
    query = query.eq('area', filters.area);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching risks:", error);
    toast({
      title: "Error",
      description: `Failed to fetch risks: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as Risk[];
};

export const fetchRiskById = async (id: string) => {
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching risk ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch risk details: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as Risk;
};

export const createRisk = async (risk: Omit<Risk, 'id' | 'risk_score'>) => {
  const { data, error } = await supabase
    .from('risks')
    .insert(risk)
    .select()
    .single();

  if (error) {
    console.error("Error creating risk:", error);
    toast({
      title: "Error",
      description: `Failed to create risk: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Risk assessment created successfully"
  });

  return data as Risk;
};

export const updateRisk = async (id: string, risk: Partial<Risk>) => {
  const { data, error } = await supabase
    .from('risks')
    .update(risk)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating risk ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to update risk: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Risk assessment updated successfully"
  });

  return data as Risk;
};

// Changes
export const fetchChanges = async (filters?: { status?: string; linked_area?: string }) => {
  let query = supabase
    .from('changes')
    .select(`
      *,
      risks:risk_id (
        id,
        title,
        risk_score,
        status
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status as "Pending" | "Under Review" | "Approved" | "Rejected" | "Implemented");
  }

  if (filters?.linked_area && filters.linked_area !== 'all') {
    query = query.eq('linked_area', filters.linked_area);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching changes:", error);
    toast({
      title: "Error",
      description: `Failed to fetch changes: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as (Change & { risks: Risk | null })[];
};

export const fetchChangeById = async (id: string) => {
  const { data, error } = await supabase
    .from('changes')
    .select(`
      *,
      risks:risk_id (
        id,
        title,
        risk_score,
        likelihood,
        impact,
        status,
        area
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching change ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch change details: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as Change & { risks: Risk | null };
};

export const createChange = async (change: Omit<Change, 'id'>) => {
  const { data, error } = await supabase
    .from('changes')
    .insert(change)
    .select()
    .single();

  if (error) {
    console.error("Error creating change:", error);
    toast({
      title: "Error",
      description: `Failed to create change request: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Change request created successfully"
  });

  return data as Change;
};

export const updateChange = async (id: string, change: Partial<Change>) => {
  const { data, error } = await supabase
    .from('changes')
    .update(change)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating change ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to update change request: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Change request updated successfully"
  });

  return data as Change;
};
