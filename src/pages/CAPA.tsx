
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import CAPAList from '@/components/capa/CAPAList';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { getCAPAs } from '@/services/capaService';
import { CAPA } from '@/types/document';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const CAPAPage: React.FC = () => {
  const navigate = useNavigate();
  const [capas, setCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCAPAs = async () => {
      try {
        const data = await getCAPAs();
        setCAPAs(data);
      } catch (error) {
        console.error('Error loading CAPAs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load CAPAs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCAPAs();
  }, []);

  const handleAddCAPAClick = () => {
    navigate('/capa/create');
  };

  const handleSelectCAPA = (capa: CAPA) => {
    navigate(`/capa/${capa.id}`);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="CAPA Management"
        description="Manage Corrective and Preventive Actions"
        icon={<Plus className="h-6 w-6" />}
      />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">All CAPAs</h2>
          <p className="text-gray-500">
            View and manage all Corrective and Preventive Actions
          </p>
        </div>
        <Button onClick={handleAddCAPAClick}>
          <Plus className="mr-2 h-4 w-4" /> New CAPA
        </Button>
      </div>

      <Card>
        <CAPAList 
          capas={capas} 
          loading={loading} 
          onSelectCAPA={handleSelectCAPA} 
        />
      </Card>
    </DashboardLayout>
  );
};

export default CAPAPage;
