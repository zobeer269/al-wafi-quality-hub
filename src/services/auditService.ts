
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Audit, AuditStatus, AuditType, AuditFinding, FindingSeverity, FindingStatus } from "@/types/audit";

export const fetchAudits = async (): Promise<Audit[]> => {
  try {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching audits:", error);
      toast({
        title: "Error",
        description: "Failed to fetch audits. Please try again later.",
        variant: "destructive",
      });
      return [];
    }

    return data as Audit[];
  } catch (error) {
    console.error("Unexpected error fetching audits:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchAuditById = async (id: string): Promise<Audit | null> => {
  try {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching audit:", error);
      toast({
        title: "Error",
        description: "Failed to fetch audit details. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    return data as Audit;
  } catch (error) {
    console.error("Unexpected error fetching audit:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const createAudit = async (audit: Omit<Audit, "id" | "created_at" | "updated_at">): Promise<Audit | null> => {
  try {
    const { data, error } = await supabase
      .from("audits")
      .insert(audit)
      .select()
      .single();

    if (error) {
      console.error("Error creating audit:", error);
      toast({
        title: "Error",
        description: "Failed to create audit. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Audit created successfully.",
    });
    
    return data as Audit;
  } catch (error) {
    console.error("Unexpected error creating audit:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateAudit = async (id: string, audit: Partial<Audit>): Promise<Audit | null> => {
  try {
    const { data, error } = await supabase
      .from("audits")
      .update(audit)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating audit:", error);
      toast({
        title: "Error",
        description: "Failed to update audit. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Audit updated successfully.",
    });
    
    return data as Audit;
  } catch (error) {
    console.error("Unexpected error updating audit:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteAudit = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("audits")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting audit:", error);
      toast({
        title: "Error",
        description: "Failed to delete audit. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Audit deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting audit:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
};

export const fetchAuditFindings = async (auditId: string): Promise<AuditFinding[]> => {
  try {
    const { data, error } = await supabase
      .from("audit_findings")
      .select("*")
      .eq("audit_id", auditId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching audit findings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch audit findings. Please try again later.",
        variant: "destructive",
      });
      return [];
    }

    return data as AuditFinding[];
  } catch (error) {
    console.error("Unexpected error fetching audit findings:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

export const createAuditFinding = async (finding: Omit<AuditFinding, "id" | "created_at" | "updated_at">): Promise<AuditFinding | null> => {
  try {
    const { data, error } = await supabase
      .from("audit_findings")
      .insert(finding)
      .select()
      .single();

    if (error) {
      console.error("Error creating audit finding:", error);
      toast({
        title: "Error",
        description: "Failed to create audit finding. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Audit finding created successfully.",
    });
    
    return data as AuditFinding;
  } catch (error) {
    console.error("Unexpected error creating audit finding:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateAuditFinding = async (id: string, finding: Partial<AuditFinding>): Promise<AuditFinding | null> => {
  try {
    const { data, error } = await supabase
      .from("audit_findings")
      .update(finding)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating audit finding:", error);
      toast({
        title: "Error",
        description: "Failed to update audit finding. Please try again later.",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Success",
      description: "Audit finding updated successfully.",
    });
    
    return data as AuditFinding;
  } catch (error) {
    console.error("Unexpected error updating audit finding:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteAuditFinding = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("audit_findings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting audit finding:", error);
      toast({
        title: "Error",
        description: "Failed to delete audit finding. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Audit finding deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error("Unexpected error deleting audit finding:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
    return false;
  }
};

// Upload audit evidence functions will be added in a future iteration
