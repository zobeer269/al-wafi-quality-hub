
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ClipboardCheck } from 'lucide-react';
import NCForm from '@/components/non-conformance/NCForm';
import { Card, CardContent } from '@/components/ui/card';

const NCCreatePage: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Report Non-Conformance"
        description="Create a new non-conformance record"
        icon={<ClipboardCheck className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <NCForm />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NCCreatePage;
