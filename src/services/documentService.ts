
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
