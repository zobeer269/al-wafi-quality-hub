
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ComplaintDetail from "@/components/complaint/ComplaintDetail";

const ComplaintDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Complaint ID is required</div>;
  }

  return (
    <DashboardLayout>
      <PageHeader 
        title="Complaint Details" 
        description="View and manage complaint information"
      />
      <div className="mt-8">
        <ComplaintDetail complaintId={id} />
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetailPage;
