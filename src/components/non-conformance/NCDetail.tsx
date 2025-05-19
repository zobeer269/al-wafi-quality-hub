
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NonConformance } from '@/types/nonConformance';
import { Badge } from '@/components/ui/badge';
import { CAPA } from '@/types/document';
import { createCAPAFromNC } from '@/services/integrationService';
import { updateNonConformance } from '@/services/nonConformanceService';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NonConformanceDetailProps {
  nonConformance: NonConformance;
}

const NCDetail: React.FC<NonConformanceDetailProps> = ({ nonConformance }) => {
  // Local state for the NC
  const [nc, setNC] = useState<NonConformance>(nonConformance);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkedCapa, setLinkedCapa] = useState<CAPA | null>(null);

  useEffect(() => {
    setNC(nonConformance);
    
    // If there's a linked CAPA, fetch its details
    if (nonConformance.linked_capa_id) {
      // Logic to fetch linked CAPA here if needed
    }
  }, [nonConformance]);

  // Function to update a specific field in the NC
  const updateNCField = async (field: keyof NonConformance, value: any) => {
    try {
      setLoading(true);
      const updatedNC = await updateNonConformance(nc.id, { [field]: value });
      if (updatedNC) {
        setNC({
          ...nc,
          [field]: value,
          updated_at: new Date().toISOString()
        });
        toast({
          title: "Updated",
          description: `Non-conformance ${field} updated successfully`,
        });
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setErrorMessage(`Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle creating a CAPA from this NC
  const handleCreateCAPA = async () => {
    try {
      setLoading(true);
      
      if (!nc.reported_by) {
        setErrorMessage("Missing reported by information");
        return;
      }
      
      const capaData = {
        title: nc.title,
        description: nc.description,
        severity: nc.severity,
        nc_id: nc.id,
        reported_by: nc.reported_by
      };
      
      const newCapa = await createCAPAFromNC(capaData);
      
      if (newCapa) {
        toast({
          title: "Success",
          description: "CAPA created successfully",
        });
        
        // Update the NC with the linked CAPA ID
        updateNCField('linked_capa_id', newCapa.id);
        updateNCField('capa_required', true);
        
        setLinkedCapa(newCapa);
      }
    } catch (error) {
      console.error("Error creating CAPA:", error);
      setErrorMessage("Failed to create CAPA");
    } finally {
      setLoading(false);
    }
  };

  // Render based on severity
  const getSeverityBadge = () => {
    switch (nc.severity) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'Major':
        return <Badge variant="default">Major</Badge>;
      case 'Minor':
        return <Badge variant="outline">Minor</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (nc.status) {
      case 'Open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
      case 'Investigation':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Investigation</Badge>;
      case 'Containment':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Containment</Badge>;
      case 'Correction':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Correction</Badge>;
      case 'Verification':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Verification</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">NC Number</span>
                  <p className="text-base">{nc.nc_number}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Title</span>
                  <p className="text-base">{nc.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Description</span>
                  <p className="text-base">{nc.description}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Source</span>
                  <p className="text-base">{nc.source || 'Not specified'}</p>
                </div>
                <div className="flex gap-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Severity</span>
                    <div>{getSeverityBadge()}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <div>{getStatusBadge()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Additional Details</h3>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Reported Date</span>
                  <p className="text-base">{new Date(nc.reported_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Reported By</span>
                  <p className="text-base">{nc.reported_by || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Assigned To</span>
                  <p className="text-base">{nc.assigned_to || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">CAPA Required</span>
                  <p className="text-base">{nc.capa_required ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Linked CAPA</span>
                  <p className="text-base">
                    {nc.linked_capa_id ? nc.linked_capa_id : 'None'}
                    {!nc.linked_capa_id && nc.severity === 'Critical' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2" 
                        onClick={handleCreateCAPA}
                        disabled={loading}
                      >
                        Create CAPA
                      </Button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Investigation & Action</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Root Cause</span>
              <p className="text-base mt-1 bg-gray-50 p-3 rounded-md">
                {nc.root_cause || 'No root cause analysis documented yet'}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Containment Action</span>
              <p className="text-base mt-1 bg-gray-50 p-3 rounded-md">
                {nc.containment_action || 'No containment action documented yet'}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Correction</span>
              <p className="text-base mt-1 bg-gray-50 p-3 rounded-md">
                {nc.correction || 'No correction documented yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional cards for attachments, timelines, etc. could be added here */}
    </div>
  );
};

export default NCDetail;
