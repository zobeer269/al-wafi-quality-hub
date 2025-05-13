
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { getTrainingStats } from '@/services/trainingService';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  className 
}: { 
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const TrainingDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['trainingStats'],
    queryFn: getTrainingStats
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Pending Training" 
        value={stats?.pending || 0}
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        className="bg-card"
      />
      <StatCard 
        title="In Progress" 
        value={stats?.inProgress || 0}
        icon={<Clock className="h-4 w-4 text-blue-500" />}
        className="bg-card"
      />
      <StatCard 
        title="Completed" 
        value={stats?.completed || 0}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        className="bg-card"
      />
      <StatCard 
        title="Overdue" 
        value={stats?.overdue || 0}
        icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        className="bg-card"
      />
    </div>
  );
};

export default TrainingDashboard;
