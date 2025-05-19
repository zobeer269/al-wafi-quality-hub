import { supabase } from '@/integrations/supabase/client';
import { NonConformance, NonConformanceStatus, NonConformanceSeverity } from '@/types/nonConformance';
import { toast } from '@/hooks/use-toast';

export const createNonConformance = async (nonConformanceData: Partial<NonConformance>): Promise<NonConformance | null> => {
  try {
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    
    // Add current user as reporter if not specified
    if (!nonConformanceData.reported_by && userData.user) {
      nonConformanceData.reported_by = userData.user.id;
    }
    
    // Set default values
    const newNC = {
      ...nonConformanceData,
      status: nonConformanceData.status || 'Open',
      reported_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      capa_required: nonConformanceData.severity === 'Critical' ? true : (nonConformanceData.capa_required || false),
    };
    
    // Insert the new non-conformance
    const { data, error } = await supabase
      .from('non_conformances')
      .insert([newNC])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating non-conformance:', error);
      throw new Error(`Failed to create non-conformance: ${error.message}`);
    }
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error in createNonConformance:', error);
    throw error;
  }
};

export const getNonConformanceById = async (id: string): Promise<NonConformance | null> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting non-conformance by ID:', error);
      return null;
    }
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error in getNonConformanceById:', error);
    return null;
  }
};

export const updateNonConformance = async (id: string, updates: Partial<NonConformance>): Promise<NonConformance | null> => {
  try {
    // Add updated timestamp
    updates.updated_at = new Date().toISOString();
    
    // If closing the NC, add closed date
    if (updates.status === 'Closed' && !updates.closed_date) {
      updates.closed_date = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('non_conformances')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating non-conformance:', error);
      return null;
    }
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error in updateNonConformance:', error);
    return null;
  }
};

export const getNonConformances = async (filters?: Partial<{
  status: NonConformanceStatus;
  severity: NonConformanceSeverity;
  capa_required: boolean;
}>): Promise<NonConformance[]> => {
  try {
    let query = supabase
      .from('non_conformances')
      .select('*');
    
    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      
      if (filters.capa_required !== undefined) {
        query = query.eq('capa_required', filters.capa_required);
      }
    }
    
    const { data, error } = await query.order('reported_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching non-conformances:', error);
      return [];
    }
    
    return data as NonConformance[];
  } catch (error) {
    console.error('Error in getNonConformances:', error);
    return [];
  }
};

// Add bulk create function
export const seedNonConformances = async (nonConformances: Partial<NonConformance>[]): Promise<boolean> => {
  try {
    // Set default properties to ensure required fields are present
    const preparedNCs = nonConformances.map(nc => ({
      ...nc,
      nc_number: nc.nc_number || generateNCNumber(),
      category: nc.category || 'General',
      description: nc.description || 'Default description',
      reported_by: nc.reported_by || 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    
    // Insert all NCs in a batch
    const { error } = await supabase
      .from('non_conformances')
      .insert(preparedNCs);
    
    if (error) {
      console.error('Error seeding non-conformances:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in seedNonConformances:', error);
    return false;
  }
};

// Helper function to generate a unique NC number
export const generateNCNumber = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `NC-${year}${month}${day}-${random}`;
};

export const getNCStatistics = async () => {
  try {
    const { data: openNCs, error: openError } = await supabase
      .from('non_conformances')
      .select('count')
      .eq('status', 'Open')
      .single();

    const { data: criticalNCs, error: criticalError } = await supabase
      .from('non_conformances')
      .select('count')
      .eq('severity', 'Critical')
      .single();

    const { data: capaRequiredNCs, error: capaError } = await supabase
      .from('non_conformances')
      .select('count')
      .eq('capa_required', true)
      .single();

    if (openError || criticalError || capaError) {
      console.error('Error fetching NC statistics');
      return {
        open: 0,
        critical: 0,
        capaRequired: 0
      };
    }

    return {
      open: openNCs?.count || 0,
      critical: criticalNCs?.count || 0,
      capaRequired: capaRequiredNCs?.count || 0
    };
  } catch (error) {
    console.error('Error in getNCStatistics:', error);
    return {
      open: 0,
      critical: 0,
      capaRequired: 0
    };
  }
};
