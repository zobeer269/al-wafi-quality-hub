
import { supabase } from "@/integrations/supabase/client";
import { Supplier, SupplierQualification, SupplierAudit } from "@/types/supplier";
import { toast } from "@/components/ui/use-toast";

// Suppliers
export const fetchSuppliers = async () => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching suppliers:", error);
    toast({
      title: "Error",
      description: `Failed to fetch suppliers: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as Supplier[];
};

export const fetchSupplierById = async (id: string) => {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch supplier details: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as Supplier;
};

export const createSupplier = async (supplier: Omit<Supplier, 'id'>) => {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplier)
    .select()
    .single();

  if (error) {
    console.error("Error creating supplier:", error);
    toast({
      title: "Error",
      description: `Failed to create supplier: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Supplier created successfully"
  });

  return data as Supplier;
};

export const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
  const { data, error } = await supabase
    .from('suppliers')
    .update(supplier)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating supplier ${id}:`, error);
    toast({
      title: "Error",
      description: `Failed to update supplier: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Supplier updated successfully"
  });

  return data as Supplier;
};

// Supplier Qualifications
export const fetchSupplierQualifications = async (supplierId: string) => {
  const { data, error } = await supabase
    .from('supplier_qualifications')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('qualification_date', { ascending: false });

  if (error) {
    console.error(`Error fetching qualifications for supplier ${supplierId}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch qualification history: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as SupplierQualification[];
};

export const createSupplierQualification = async (qualification: Omit<SupplierQualification, 'id'>) => {
  const { data, error } = await supabase
    .from('supplier_qualifications')
    .insert(qualification)
    .select()
    .single();

  if (error) {
    console.error("Error creating supplier qualification:", error);
    toast({
      title: "Error",
      description: `Failed to record qualification: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Supplier qualification recorded successfully"
  });

  return data as SupplierQualification;
};

// Supplier Audits
export const fetchSupplierAudits = async (supplierId: string) => {
  const { data, error } = await supabase
    .from('supplier_audits')
    .select(`
      *,
      audits:audit_id (
        id, 
        title, 
        audit_number, 
        audit_type, 
        status,
        scheduled_start_date
      )
    `)
    .eq('supplier_id', supplierId);

  if (error) {
    console.error(`Error fetching audits for supplier ${supplierId}:`, error);
    toast({
      title: "Error",
      description: `Failed to fetch supplier audits: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  return data as (SupplierAudit & { audits: any })[];
};

export const linkAuditToSupplier = async (audit: Omit<SupplierAudit, 'id'>) => {
  const { data, error } = await supabase
    .from('supplier_audits')
    .insert(audit)
    .select()
    .single();

  if (error) {
    console.error("Error linking audit to supplier:", error);
    toast({
      title: "Error",
      description: `Failed to link audit: ${error.message}`,
      variant: "destructive"
    });
    throw error;
  }

  toast({
    title: "Success",
    description: "Audit linked to supplier successfully"
  });

  return data as SupplierAudit;
};
