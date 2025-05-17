
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import ComplaintList from "@/components/complaint/ComplaintList";

const Complaints = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Complaints Management" 
        description="Log, track, and resolve customer complaints in compliance with standards"
      />
      <div className="mt-8">
        <ComplaintList />
      </div>
    </DashboardLayout>
  );
};

export default Complaints;
