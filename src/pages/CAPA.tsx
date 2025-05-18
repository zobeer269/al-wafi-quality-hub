
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CAPAList from "@/components/capa/CAPAList";
import CAPADetail from "@/components/capa/CAPADetail";
import CAPAForm from "@/components/capa/CAPAForm";
import { CAPA, CAPAType, CAPAPriority, CAPAStatus, ApprovalStatus } from "@/types/document";
import { fetchCAPAs, createCAPA, getCAPAStatistics } from "@/services/capaService";
import StatusCard from "@/components/dashboard/StatusCard";

const CAPAPage = () => {
  const [capas, setCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    closed: 0
  });

  useEffect(() => {
    loadCAPAs();
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const statistics = await getCAPAStatistics();
    setStats(statistics);
  };

  const loadCAPAs = async () => {
    setLoading(true);
    const data = await fetchCAPAs();
    // Convert database response to CAPA type
    const formattedData: CAPA[] = data.map(item => ({
      id: item.id,
      number: item.number,
      title: item.title,
      description: item.description,
      type: item.capa_type as CAPAType,
      priority: item.priority as CAPAPriority,
      status: item.status as CAPAStatus,
      createdDate: item.created_at,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      root_cause: item.root_cause,
      action_plan: item.action_plan,
      created_by: item.created_by,
      closed_date: item.closed_date,
      effectiveness_check_required: item.effectiveness_check_required,
      effectiveness_verified: item.effectiveness_verified,
      linked_nc_id: item.linked_nc_id,
      linkedAuditFindingId: item.linked_audit_finding_id,
      approval_status: item.approval_status as ApprovalStatus,
      approved_by: item.approved_by,
      approved_at: item.approved_at,
      tags: item.tags || [],
      ai_notes: item.ai_notes
    }));
    setCAPAs(formattedData);
    setLoading(false);
  };

  const handleCreate = async (values: any) => {
    await createCAPA(values);
    setShowCreateForm(false);
    loadCAPAs();
  };

  const handleSelectCAPA = (capa: CAPA) => {
    setSelectedCAPA(capa);
    setShowDetail(true);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="CAPA Management" 
        description="Corrective and Preventive Actions to address quality issues and prevent recurrence"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard 
          title="Open CAPAs" 
          value={stats.open} 
          className="bg-blue-50"
        />
        <StatusCard 
          title="In Progress" 
          value={stats.inProgress} 
          className="bg-amber-50"
        />
        <StatusCard 
          title="Closed" 
          value={stats.closed} 
          className="bg-green-50"
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">CAPA List</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> New CAPA
        </Button>
      </div>
      
      <div className="bg-white rounded-md shadow">
        <CAPAList capas={capas} onSelectCAPA={handleSelectCAPA} />
      </div>
      
      {/* CAPA Detail Dialog */}
      {showDetail && selectedCAPA && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <CAPADetail 
              capa={selectedCAPA} 
              onClose={() => setShowDetail(false)}
              onStatusChange={loadCAPAs}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* CAPA Create Form Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-3xl">
          <CAPAForm 
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CAPAPage;
