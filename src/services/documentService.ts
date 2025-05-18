import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentStatus } from "@/types/document";
import { toast } from "@/components/ui/use-toast";

export interface DocumentInput {
  number: string;
  title: string;
  description?: string;
  document_type: string;
  version: string;
  status?: DocumentStatus;
  content_url?: string;
  effective_date?: string;
  review_date?: string;
  expiry_date?: string;
}

export const fetchDocuments = async () => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error fetching documents",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data.map((doc): Document => ({
      id: doc.id,
      number: doc.number,
      title: doc.title,
      type: doc.document_type,
      version: doc.version,
      status: doc.status,
      lastUpdated: new Date(doc.updated_at).toISOString().split('T')[0],
      description: doc.description,
      content_url: doc.content_url,
      approved_by: doc.approved_by,
      effective_date: doc.effective_date,
      review_date: doc.review_date,
      expiry_date: doc.expiry_date
    }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

export const fetchDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching document by id:', error);
      toast({
        title: "Error fetching document",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      number: data.number,
      title: data.title,
      type: data.document_type,
      version: data.version,
      status: data.status,
      lastUpdated: new Date(data.updated_at).toISOString().split('T')[0],
      description: data.description,
      content_url: data.content_url,
      approved_by: data.approved_by,
      effective_date: data.effective_date,
      review_date: data.review_date,
      expiry_date: data.expiry_date,
    };
  } catch (error) {
    console.error('Unexpected error fetching document:', error);
    return null;
  }
};

export const createDocument = async (documentInput: DocumentInput) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        ...documentInput,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select();
    
    if (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error creating document",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    toast({
      title: "Document created",
      description: "Your document was created successfully",
    });
    
    return data[0];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

export const updateDocumentStatus = async (id: string, status: DocumentStatus) => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating document status:', error);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Status updated",
      description: `Document status changed to ${status}`,
    });
    
    // Add to document history
    const { error: historyError } = await supabase
      .from('document_history')
      .insert([{
        document_id: id,
        version: (await supabase.from('documents').select('version').eq('id', id).single()).data?.version || '1.0',
        status,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      }]);
    
    if (historyError) {
      console.error('Error recording document history:', historyError);
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

// Approve or reject document with electronic signature
export const approveDocument = async (
  documentId: string, 
  userId: string, 
  approvalStatus: "Approved" | "Rejected",
  reason?: string
): Promise<boolean> => {
  try {
    // Instead of directly interacting with the signatures table, use RPC functions
    const { data: canApprove, error: checkError } = await supabase.rpc(
      'can_approve_products'
    );
    
    if (checkError) {
      console.error("Error checking approval permissions:", checkError);
      throw checkError;
    }
    
    if (!canApprove) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to approve documents",
        variant: "destructive",
      });
      return false;
    }
    
    // Update document with approval information
    const { error } = await supabase
      .from('documents')
      .update({
        status: approvalStatus === "Approved" ? "Approved" : "In Review",
        approved_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId);
      
    if (error) {
      console.error("Error updating document approval status:", error);
      throw error;
    }
    
    toast({
      title: "Success",
      description: `Document ${approvalStatus.toLowerCase()} successfully`,
    });
    
    // Add to document history
    const { error: historyError } = await supabase
      .from('document_history')
      .insert([{
        document_id: documentId,
        version: (await supabase.from('documents').select('version').eq('id', documentId).single()).data?.version || '1.0',
        status: approvalStatus === "Approved" ? "Approved" : "In Review",
        updated_by: userId,
        notes: `Document ${approvalStatus.toLowerCase()}${reason ? `: ${reason}` : ''}`,
      }]);
    
    if (historyError) {
      console.error('Error recording document history:', historyError);
    }
    
    return true;
  } catch (error) {
    console.error("Error in approveDocument:", error);
    toast({
      title: "Error",
      description: `Failed to ${approvalStatus.toLowerCase()} document`,
      variant: "destructive",
    });
    return false;
  }
};
