
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ChangeControlList from "@/components/change-control/ChangeControlList";

const Change = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Change Control" 
        description="Manage and track changes that impact quality-critical processes, products, or documents"
      />
      <div className="mt-8">
        <ChangeControlList />
      </div>
    </DashboardLayout>
  );
};

export default Change;
