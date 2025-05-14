
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ClipboardCheck } from 'lucide-react';
import { NonConformance } from '@/types/nonConformance';
import { getNonConformanceById } from '@/services/nonConformanceService';
import NCDetail from '@/components/non-conformance/NCDetail';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const NCDetailPage: React.FC = () => {
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
        }
      } catch (error) {
        console.error('Error fetching non-conformance:', error);
        setError('Failed to load non-conformance details');
      } finally {
        setLoading(false);
      }
    };

    fetchNonConformance();
  }, [id]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Non-Conformance Details"
        description="View and manage non-conformance details"
        icon={<ClipboardCheck className="h-6 w-6" />}
      />

      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-32" />
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
        <NCDetail nonConformance={nonConformance} />
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">Non-conformance not found</p>
            <Button onClick={() => navigate('/nonconformance')}>
              Back to Non-Conformance List
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default NCDetailPage;
