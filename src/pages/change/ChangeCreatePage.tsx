
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ChangeControlForm from "@/components/change-control/ChangeControlForm";

const ChangeCreatePage = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Create Change Request" 
        description="Initiate a new change control process"
      />
      <div className="mt-8">
        <ChangeControlForm />
      </div>
    </DashboardLayout>
  );
};

export default ChangeCreatePage;
