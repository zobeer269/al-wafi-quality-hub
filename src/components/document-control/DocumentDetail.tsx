import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, DocumentStatus, ApprovalStatus } from '@/types/document';
import { Clock, Download, FileText, User, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { updateDocumentStatus, approveDocument } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import SignatureDialog from '@/components/signatures/SignatureDialog';
import { getUserName } from '@/services/capaService';

interface DocumentDetailProps {
  document: Document;
  onClose: () => void;
  onStatusChange: () => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ 
  document, 
  onClose,
  onStatusChange
}) => {
  const [canApprove, setCanApprove] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [approverName, setApproverName] = useState<string | null>(null);
  const [signatureDialog, setSignatureDialog] = useState<{
    open: boolean;
    action: ApprovalStatus;
  }>({ open: false, action: "Approved" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if current user has approval permissions
    const checkUserPermissions = async () => {
      const { data, error } = await supabase.rpc('can_approve_products');
      if (!error && data) {
        setCanApprove(data);
      }
      
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    
    // Get approver name if available
    const getApproverDetails = async () => {
      if (document.approved_by) {
        const name = await getUserName(document.approved_by);
        setApproverName(name);
      }
    };
    
    checkUserPermissions();
    getApproverDetails();
  }, [document.approved_by]);

  const handleStatusChange = async (status: DocumentStatus) => {
    await updateDocumentStatus(document.id, status);
    onStatusChange();
  };

  const openApprovalDialog = (action: ApprovalStatus) => {
    setSignatureDialog({ open: true, action });
  };

  const handleApprovalAction = async (password: string, reason?: string) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User identification failed",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify password (simplified for demo)
      const { error } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password,
      });

      if (error) {
        toast({
          title: "Authentication Failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Use approveDocument service function
      const success = await approveDocument(
        document.id,
        currentUser,
        signatureDialog.action,
        reason
      );

      if (success) {
        setSignatureDialog({ ...signatureDialog, open: false });
        toast({
          title: "Success",
          description: `Document ${signatureDialog.action.toLowerCase()} successfully`,
        });
        onStatusChange();
      }
    } catch (error) {
      console.error("Error in approval process:", error);
      toast({
        title: "Error",
        description: "Failed to complete approval process",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format status badge class
  const getStatusBadgeClass = (status: DocumentStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Obsolete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format approval status badge
  const getApprovalBadge = () => {
    if (!document.approval_status) return null;
    
    switch(document.approval_status) {
      case "Approved":
        return (
          <div className="flex flex-col mt-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Approved
            </span>
            {approverName && document.approved_at && (
              <span className="text-xs text-gray-500 mt-1">
                by {approverName} on {new Date(document.approved_at).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      case "Rejected":
        return (
          <div className="flex flex-col mt-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
              <ThumbsDown className="h-3 w-3 mr-1" />
              Rejected
            </span>
            {approverName && document.approved_at && (
              <span className="text-xs text-gray-500 mt-1">
                by {approverName} on {new Date(document.approved_at).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center mt-2">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium text-gray-500">{document.number}</div>
            <CardTitle className="text-xl mt-1">{document.title}</CardTitle>
          </div>
          <div className="flex flex-col">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(document.status)}`}>
              {document.status}
            </span>
            {getApprovalBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Document Type</div>
            <div>{document.type}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Version</div>
            <div>{document.version}</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Description</div>
          <div className="text-gray-700">{document.description || 'No description provided'}</div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last updated: {document.lastUpdated}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="space-x-2">
            {document.status === 'Draft' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('In Review')}
              >
                Submit for Review
              </Button>
            )}
            
            {document.status === 'In Review' && canApprove && (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                  onClick={() => openApprovalDialog("Approved")}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                  onClick={() => openApprovalDialog("Rejected")}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
            
            {document.status === 'Approved' && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
                onClick={() => handleStatusChange('Obsolete')}
              >
                Mark as Obsolete
              </Button>
            )}
          </div>
          <div className="space-x-2">
            {document.content_url && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardFooter>

      {/* Digital Signature Dialog */}
      <SignatureDialog
        open={signatureDialog.open}
        onClose={() => setSignatureDialog({ ...signatureDialog, open: false })}
        onConfirm={handleApprovalAction}
        title={signatureDialog.action === "Approved" ? "Approve Document" : "Reject Document"}
        action={signatureDialog.action}
        loading={isSubmitting}
      />
    </Card>
  );
};

export default DocumentDetail;
