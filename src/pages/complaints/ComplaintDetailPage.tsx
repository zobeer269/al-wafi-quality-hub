
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ComplaintDetail from "@/components/complaint/ComplaintDetail";
import { getComplaintById } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const ComplaintDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComplaint = async () => {
      if (!id) {
        setError("Complaint ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getComplaintById(id);
        if (data) {
          setComplaint(data);
        } else {
          setError("Complaint not found");
        }
      } catch (err) {
        console.error("Error loading complaint:", err);
        setError("Failed to load complaint details");
        toast({
          title: "Error",
          description: "Failed to load complaint details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadComplaint();
  }, [id]);

  const handleClose = () => {
    navigate('/complaints');
  };

  const handleUpdate = (updatedComplaint: Complaint) => {
    setComplaint(updatedComplaint);
  };

  if (!id) {
    return (
      <DashboardLayout>
        <div>Complaint ID is required</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader 
        title="Complaint Details" 
        description="View and manage complaint information"
      />
      <div className="mt-8">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleClose}>
                Back to Complaints List
              </Button>
            </CardContent>
          </Card>
        ) : complaint ? (
          <ComplaintDetail 
            complaint={complaint}
            onClose={handleClose}
            onUpdate={handleUpdate}
          />
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetailPage;
