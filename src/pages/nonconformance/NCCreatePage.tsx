
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ClipboardCheck } from 'lucide-react';
import NCForm from '@/components/non-conformance/NCForm';
import { Card, CardContent } from '@/components/ui/card';
import { createNonConformance } from '@/services/nonConformanceService';
import { toast } from '@/hooks/use-toast';

const NCCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await createNonConformance(values);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Non-conformance created successfully',
        });
        navigate(`/nonconformance/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to create non-conformance:', error);
      toast({
        title: 'Error',
        description: 'Failed to create non-conformance',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/nonconformance');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Report Non-Conformance"
        description="Create a new non-conformance record"
        icon={<ClipboardCheck className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <NCForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NCCreatePage;
