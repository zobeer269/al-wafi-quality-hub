
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ChangeControlDetail from "@/components/change-control/ChangeControlDetail";

const ChangeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Change Control ID is required</div>;
  }

  return (
    <DashboardLayout>
      <PageHeader 
        title="Change Control Details" 
        description="View and manage change control information"
      />
      <div className="mt-8">
        <ChangeControlDetail changeControlId={id} />
      </div>
    </DashboardLayout>
  );
};

export default ChangeDetailPage;
