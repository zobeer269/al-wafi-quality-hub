
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ChangeControlDetail } from '@/components/change-control/ChangeControlDetail';

const ChangeDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout>
      <PageHeader 
        title="Change Control Details" 
        description="View and manage change control details" 
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        <ChangeControlDetail />
      </div>
    </DashboardLayout>
  );
};

export default ChangeDetailPage;
