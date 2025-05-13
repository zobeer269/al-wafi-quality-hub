
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CAPA, CAPAStatus } from '@/types/document';
import { Clock, Download, FileText, User, Edit, Check } from 'lucide-react';
import { updateCAPA } from '@/services/capaService';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

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
  const getPriorityBadge = (priority: number) => {
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium text-gray-500">{capa.number}</div>
            <CardTitle className="text-xl mt-1">{capa.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            {getPriorityBadge(capa.priority)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(capa.status)}`}>
              {capa.status}
            </span>
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
    </Card>
  );
};

export default CAPADetail;
