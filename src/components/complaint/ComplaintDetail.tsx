
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types/complaint';
import { CAPA } from '@/types/document';
import { createCAPAFromNC } from '@/services/integrationService';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { updateComplaint } from '@/services/complaintService';
import { Badge } from '@/components/ui/badge';

interface ComplaintDetailProps {
  complaint: Complaint;
  onClose: () => void;
  onUpdate: (complaint: Complaint) => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({
  complaint,
  onClose,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const [creatingCapa, setCreatingCapa] = useState(false);
  const [capa, setCapa] = useState<CAPA | null>(null);

  const handleCreateCAPA = async () => {
    try {
      setCreatingCapa(true);
      const capaData = await createCAPAFromNC({
        title: complaint.title,
        description: complaint.description,
        severity: complaint.severity,
        nc_id: complaint.linked_nc_id || '',
        reported_by: complaint.reported_by,
      });
      
      // Update linked CAPA
      if (capaData && onUpdate) {
        setCapa(capaData as CAPA);
        
        const updatedComplaint = {
          ...complaint,
          linked_capa_id: capaData.id,
        };
        
        await updateComplaint(updatedComplaint.id, {
          linked_capa_id: capaData.id,
        });
        
        onUpdate(updatedComplaint);
        
        // Handle redirect to CAPA details
        navigate(`/capa/${capaData.id}`);
      }
    } catch (error) {
      console.error("Error creating CAPA:", error);
      toast({
        title: "Error",
        description: "Failed to create CAPA",
        variant: "destructive",
      });
    } finally {
      setCreatingCapa(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{complaint.title}</CardTitle>
        <CardDescription>Details for complaint {complaint.reference_number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-gray-700">{complaint.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Source</h3>
            <p className="text-gray-700">{complaint.source}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Severity</h3>
             <Badge className={`
                ${complaint.severity === 'Low' ? 'bg-green-100 text-green-800' : ''}
                ${complaint.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${complaint.severity === 'High' ? 'bg-red-100 text-red-800' : ''}
                ${complaint.severity === 'Critical' ? 'bg-red-500 text-white' : ''}
              `}>{complaint.severity}</Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="text-gray-700">{complaint.status}</p>
          </div>
          {complaint.justification && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Justification</h3>
              <p className="text-gray-700">{complaint.justification}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {!complaint.linked_capa_id && (
          <Button onClick={handleCreateCAPA} disabled={creatingCapa}>
            {creatingCapa ? 'Creating CAPA...' : 'Create CAPA'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ComplaintDetail;
