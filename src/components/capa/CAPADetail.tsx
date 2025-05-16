import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CAPA, CAPAStatus, CAPAPriority, ApprovalStatus } from '@/types/document';
import { Clock, Download, FileText, User, Edit, Check, Save, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { updateCAPA, approveCAPA, userCanApprove, getUserName } from '@/services/capaService';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SignatureDialog from '@/components/signatures/SignatureDialog';

interface CAPADetailProps {
  capa: CAPA;
  onClose: () => void;
  onStatusChange: () => void;
}

const CAPADetail: React.FC<CAPADetailProps> = ({ 
  capa, 
  onClose,
  onStatusChange
}) => {
  const [rootCause, setRootCause] = useState(capa.root_cause || '');
  const [actionPlan, setActionPlan] = useState(capa.action_plan || '');
  const [effectivenessVerified, setEffectivenessVerified] = useState(capa.effectiveness_verified || false);
  const [canApprove, setCanApprove] = useState(false);
  const [approverName, setApproverName] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [signatureDialog, setSignatureDialog] = useState<{
    open: boolean;
    action: ApprovalStatus;
  }>({ open: false, action: "Approved" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Check if current user has approval permissions
    const checkUserPermissions = async () => {
      const userHasApprovalRights = await userCanApprove();
      setCanApprove(userHasApprovalRights);
      
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    
    // Get approver name if available
    const getApproverDetails = async () => {
      if (capa.approved_by) {
        const name = await getUserName(capa.approved_by);
        setApproverName(name);
      }
    };
    
    checkUserPermissions();
    getApproverDetails();
  }, [capa.approved_by]);
  
  const handleStatusChange = async (status: CAPAStatus) => {
    try {
      await updateCAPA(capa.id, { 
        status,
        ...(status === 'Closed' ? { closed_date: new Date().toISOString() } : {})
      });
      onStatusChange();
    } catch (error) {
      console.error("Error updating CAPA status:", error);
      toast({
        title: "Error",
        description: "Failed to update CAPA status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveDetails = async () => {
    try {
      await updateCAPA(capa.id, { 
        root_cause: rootCause,
        action_plan: actionPlan,
        effectiveness_verified: effectivenessVerified
      });
      onStatusChange();
    } catch (error) {
      console.error("Error updating CAPA details:", error);
      toast({
        title: "Error",
        description: "Failed to update CAPA details. Please try again.",
        variant: "destructive",
      });
    }
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

      // Process approval with digital signature
      const success = await approveCAPA(
        capa.id, 
        currentUser, 
        signatureDialog.action,
        reason
      );

      if (success) {
        setSignatureDialog({ ...signatureDialog, open: false });
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
  const getStatusBadgeClass = (status: CAPAStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'Investigation':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format priority badge
  const getPriorityBadge = (priority: CAPAPriority) => {
    switch(priority) {
      case 3:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 2:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 1:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  // Format approval status badge
  const getApprovalBadge = () => {
    switch(capa.approval_status) {
      case "Approved":
        return (
          <div className="flex flex-col">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Approved
            </span>
            {approverName && capa.approved_at && (
              <span className="text-xs text-gray-500 mt-1">
                by {approverName} on {new Date(capa.approved_at).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      case "Rejected":
        return (
          <div className="flex flex-col">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
              <ThumbsDown className="h-3 w-3 mr-1" />
              Rejected
            </span>
            {approverName && capa.approved_at && (
              <span className="text-xs text-gray-500 mt-1">
                by {approverName} on {new Date(capa.approved_at).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending Approval
          </span>
        );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium text-gray-500">{capa.number}</div>
            <CardTitle className="text-xl mt-1">{capa.title}</CardTitle>
          </div>
          <div className="flex flex-col space-y-2">
            {getPriorityBadge(capa.priority)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(capa.status)}`}>
              {capa.status}
            </span>
            {getApprovalBadge()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
            <TabsTrigger value="effectiveness" disabled={capa.status !== 'Closed'}>Effectiveness</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">CAPA Type</div>
                <div>{capa.type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Assigned To</div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{capa.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="text-gray-700 bg-gray-50 p-3 rounded border">{capa.description}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Created Date</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(capa.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500">Due Date</div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{capa.dueDate ? new Date(capa.dueDate).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="investigation" className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Root Cause</div>
              <Textarea 
                value={rootCause} 
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="Describe the root cause of this issue..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Action Plan</div>
              <Textarea 
                value={actionPlan} 
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder="Describe the corrective actions to be taken..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveDetails}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="effectiveness" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="font-medium mb-2">Effectiveness Check</div>
              <p className="text-sm text-gray-600 mb-4">
                Verify that the implemented actions have effectively resolved the issue
                and prevented recurrence.
              </p>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="effectiveness" 
                  checked={effectivenessVerified}
                  onChange={(e) => setEffectivenessVerified(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="effectiveness" className="text-sm font-medium">
                  Effectiveness verified
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveDetails}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="space-x-2">
            {capa.status === 'Open' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('Investigation')}
              >
                Start Investigation
              </Button>
            )}
            
            {capa.status === 'Investigation' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleStatusChange('In Progress')}
              >
                Start Implementation
              </Button>
            )}
            
            {capa.status === 'In Progress' && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={() => handleStatusChange('Closed')}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            {/* Approval buttons - only shown for users with approval permissions */}
            {canApprove && capa.approval_status === "Pending" && (
              <>
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
              </>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit CAPA</DialogTitle>
                  <DialogDescription>
                    This feature is under development
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardFooter>

      {/* Digital Signature Dialog */}
      <SignatureDialog
        open={signatureDialog.open}
        onClose={() => setSignatureDialog({ ...signatureDialog, open: false })}
        onConfirm={handleApprovalAction}
        title={signatureDialog.action === "Approved" ? "Approve CAPA" : "Reject CAPA"}
        action={signatureDialog.action}
        loading={isSubmitting}
      />
    </Card>
  );
};

export default CAPADetail;
