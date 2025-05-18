
// Import the necessary types and components
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CAPAList from "@/components/capa/CAPAList";
import { CAPA, CAPAStatus } from "@/types/document";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CAPAForm from "@/components/capa/CAPAForm";
import { getOpenCAPAs } from "@/services/integrationService";
import { toast } from "@/hooks/use-toast";

const CAPAPage: React.FC = () => {
  const navigate = useNavigate();
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CAPAStatus | null>(null);
  
  useEffect(() => {
    loadCAPAs();
  }, []);
  
  const loadCAPAs = async () => {
    try {
      setLoading(true);
      const data = await getOpenCAPAs();
      setCapas(data);
    } catch (error) {
      console.error("Error loading CAPAs:", error);
      toast({
        title: "Error",
        description: "Failed to load CAPAs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectCAPA = (capa: CAPA) => {
    // Update CAPA object to match the expected type
    const updatedCapa = {
      ...capa,
      linkedAuditFindingId: capa.linkedAuditFindingId,
      approval_status: capa.approval_status,
      approved_by: capa.approved_by,
      approved_at: capa.approved_at,
      tags: capa.tags || [],
      ai_notes: capa.ai_notes
    };
    
    // Handle CAPA selection
    navigate(`/capa/${capa.id}`);
  };
  
  const handleFilterStatus = (status: CAPAStatus | null) => {
    setStatusFilter(status);
    // Implement filter logic here
  };

  const handleCreateSubmit = (formData: any) => {
    // Implement create CAPA logic
    console.log("Create CAPA:", formData);
    setCreateDialogOpen(false);
    // After successful creation
    loadCAPAs();
  };

  // Filter CAPAs based on status if filter is applied
  const filteredCAPAs = statusFilter
    ? capas.filter((capa) => capa.status === statusFilter)
    : capas;

  return (
    <DashboardLayout>
      <PageHeader
        title="CAPA Management"
        description="Manage Corrective and Preventive Actions"
        action={
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New CAPA
          </Button>
        }
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active CAPAs</TabsTrigger>
          <TabsTrigger value="closed">Closed CAPAs</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <CAPAList 
                capas={filteredCAPAs} 
                onSelectCAPA={handleSelectCAPA} 
                onFilterStatus={handleFilterStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="closed">
          <Card>
            <CardContent>
              <p className="text-center text-gray-500 py-4">
                Closed CAPAs will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New CAPA</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new Corrective and Preventive Action.
            </DialogDescription>
          </DialogHeader>
          <CAPAForm 
            onSubmit={handleCreateSubmit}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CAPAPage;
