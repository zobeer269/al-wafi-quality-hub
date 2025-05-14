
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ClipboardCheck } from 'lucide-react';
import NCForm from '@/components/non-conformance/NCForm';
import { Card, CardContent } from '@/components/ui/card';
import { NonConformance } from '@/types/nonConformance';
import { getNonConformanceById } from '@/services/nonConformanceService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const NCEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNonConformance = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getNonConformanceById(id);
        
        if (data) {
          setNonConformance(data);
        } else {
          setError('Non-conformance not found');
          toast({
            title: "Error",
            description: "Non-conformance not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching non-conformance:', error);
        setError('Failed to load non-conformance details');
        toast({
          title: "Error",
          description: "Failed to load non-conformance details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNonConformance();
  }, [id]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Edit Non-Conformance"
        description="Update non-conformance details"
        icon={<ClipboardCheck className="h-6 w-6" />}
      />

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-32 mt-4" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => navigate('/nonconformance')}>
              Back to Non-Conformance List
            </Button>
          </CardContent>
        </Card>
      ) : nonConformance ? (
        <Card>
          <CardContent className="p-6">
            <NCForm initialData={nonConformance} isEditing={true} />
          </CardContent>
        </Card>
      ) : null}
    </DashboardLayout>
  );
};

export default NCEditPage;
