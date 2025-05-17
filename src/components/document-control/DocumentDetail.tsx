import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Document, DocumentStatus, ApprovalStatus } from "@/types/document";
import { fetchDocumentById, updateDocumentStatus, approveDocument } from "@/services/documentService";
import { formatDate } from "@/lib/utils";
import { Loader2, PlusCircle, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface DocumentDetailProps {
  documentId: string;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ documentId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [canApprove, setCanApprove] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");
  const [approvalReason, setApprovalReason] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

  useEffect(() => {
    const loadDocumentData = async () => {
      setLoading(true);
      const documentData = await fetchDocumentById(documentId);

      if (documentData) {
        setDocument(documentData);
      }
      
      // Check if user can approve documents
      try {
        const { data: canApproveData, error: canApproveError } = await supabase.rpc('can_approve_products');
        
        if (canApproveError) {
          console.error('Error checking approval permissions:', canApproveError);
        } else {
          setCanApprove(!!canApproveData);
        }
      } catch (error) {
        console.error('Error checking approval permissions:', error);
      }
      
      setLoading(false);
    };

    loadDocumentData();
  }, [documentId]);

  const handleRefresh = async () => {
    setLoading(true);
    const documentData = await fetchDocumentById(documentId);
    
    if (documentData) {
      setDocument(documentData);
    }
    setLoading(false);
  };

  const handleStatusChange = async (status: DocumentStatus) => {
    if (!document) return;
    
    const success = await updateDocumentStatus(document.id, status);
    if (success) {
      handleRefresh();
    }
  };

  const handleApprovalAction = (action: "approve" | "reject") => {
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  const handleApprovalSubmit = async () => {
    if (!document) return;
    
    setApprovalLoading(true);
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }
      
      const approvalStatus: ApprovalStatus = approvalAction === "approve" ? "Approved" : "Rejected";
      
      const success = await approveDocument(
        document.id,
        user.id,
        approvalStatus,
        approvalReason
      );
      
      if (success) {
        handleRefresh();
        setApprovalDialogOpen(false);
        setApprovalReason("");
      }
    } catch (error) {
      console.error("Error in approval process:", error);
      toast({
        title: "Error",
        description: `Failed to ${approvalAction} document`,
        variant: "destructive",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "In Review":
        return <Badge variant="outline">In Review</Badge>;
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Obsolete":
        return <Badge variant="destructive">Obsolete</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Document not found</h2>
        <p className="mt-2 text-muted-foreground">
          The requested document could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/documents")}
        >
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{document.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {document.number} • Version {document.version}
            </p>
          </div>
          <div className="flex space-x-2">
            {document.status === "Draft" && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange("In Review")}
              >
                Submit for Review
              </Button>
            )}
            
            {document.status === "In Review" && canApprove && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleApprovalAction("reject")}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => handleApprovalAction("approve")}
                >
                  Approve
                </Button>
              </>
            )}
            
            {document.status === "Approved" && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange("Obsolete")}
              >
                Mark as Obsolete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">{getStatusBadge(document.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Document Type</h3>
                <p className="mt-1">{document.type}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1">{document.description || "-"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Last Updated</h3>
                <p className="mt-1">{formatDate(document.lastUpdated)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Approved By</h3>
                <p className="mt-1">{document.approved_by || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Document Link</h3>
                <div className="mt-1">
                  {document.content_url ? (
                    <a 
                      href={document.content_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      View Document
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="related">Related Items</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated from document history records */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No history records available
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="related" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated from related items */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No related items found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve" ? "Approve Document" : "Reject Document"}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === "approve" 
                ? "This will approve the document and make it available for use."
                : "Please provide a reason for rejecting this document."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {approvalAction === "approve" ? "Comments (Optional)" : "Reason for Rejection"}
            </label>
            <Textarea
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder={approvalAction === "approve" 
                ? "Add any comments about this approval" 
                : "Explain why this document is being rejected"}
              className="min-h-[100px]"
              required={approvalAction === "reject"}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setApprovalDialogOpen(false)}
              disabled={approvalLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApprovalSubmit}
              disabled={approvalLoading || (approvalAction === "reject" && !approvalReason)}
            >
              {approvalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentDetail;
