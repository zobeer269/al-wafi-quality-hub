
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentStatus, ApprovalStatus } from "@/types/document";
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
  approval_status?: ApprovalStatus;
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
      approval_status: doc.approval_status,
      approved_by: doc.approved_by,
      approved_at: doc.approved_at,
    }));
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

export const createDocument = async (documentInput: DocumentInput) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        ...documentInput,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        approval_status: 'Pending',
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
  approvalStatus: ApprovalStatus,
  reason?: string
): Promise<boolean> => {
  try {
    // Create a signature record
    const timestamp = new Date().toISOString();
    const signatureData = `${userId}-document-${documentId}-${timestamp}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureData);
    
    // Generate a signature hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Store the signature
    const { data: signature, error: sigError } = await supabase
      .from('signatures')
      .insert({
        user_id: userId,
        action: `Document ${approvalStatus.toLowerCase()}`,
        module: "Document",
        reference_id: documentId,
        signature_hash: hashHex,
        reason: reason || null,
      })
      .select()
      .single();
      
    if (sigError) {
      console.error("Error creating signature:", sigError);
      throw sigError;
    }
    
    // Update document with approval information
    const { error } = await supabase
      .from('documents')
      .update({
        approval_status: approvalStatus,
        approved_by: userId,
        approved_at: timestamp,
        // If approved, also update the document status
        ...(approvalStatus === "Approved" ? { status: "Approved" } : {}),
        updated_at: timestamp,
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
