
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ComplaintForm from "@/components/complaint/ComplaintForm";

const ComplaintCreatePage = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Create Complaint" 
        description="Record a new customer or internal complaint"
      />
      <div className="mt-8">
        <ComplaintForm />
      </div>
    </DashboardLayout>
  );
};

export default ComplaintCreatePage;
