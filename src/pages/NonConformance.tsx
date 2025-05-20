
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableCell, 
  TableBody, 
  Table 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Filter, Plus } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import NCList from '@/components/non-conformance/NCList';
import { 
  NonConformance, 
  NonConformanceFilters, 
  NonConformanceStatus, 
  NonConformanceSeverity 
} from '@/types/nonConformance';
import { getNonConformances } from '@/services/nonConformanceService';

const NonConformancePage = () => {
  const navigate = useNavigate();
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NonConformanceStatus | 'all'>('all');
  const [filters, setFilters] = useState<NonConformanceFilters>({
    status: 'all',
    severity: 'all',
    source: 'all'
  });

  useEffect(() => {
    loadNonConformances();
  }, [filters]);

  const loadNonConformances = async () => {
    setLoading(true);
    try {
      // Convert filter format for the service
      const serviceFilters: Partial<{ 
        status: NonConformanceStatus; 
        severity: NonConformanceSeverity; 
        capa_required: boolean; 
      }> = {};
      
      // Only add filters that aren't 'all'
      if (filters.status !== 'all') {
        serviceFilters.status = filters.status as NonConformanceStatus;
      }
      
      if (filters.severity !== 'all') {
        serviceFilters.severity = filters.severity as NonConformanceSeverity;
      }
      
      const data = await getNonConformances(serviceFilters);
      setNonConformances(data);
    } catch (error) {
      console.error('Failed to load non-conformances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    const statusValue = value as NonConformanceStatus | 'all';
    setActiveTab(statusValue);
    
    setFilters(prev => ({
      ...prev,
      status: statusValue
    }));
  };

  const handleFilterChange = (key: keyof NonConformanceFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCreateNC = () => {
    navigate('/nonconformance/create');
  };

  const handleViewNC = (nc: NonConformance) => {
    navigate(`/nonconformance/${nc.id}`);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Non-Conformance" 
        description="Manage and track quality non-conformances"
        icon={<Filter className="h-6 w-6" />}
      />
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNC}>
          <Plus className="mr-2 h-4 w-4" />
          Report Non-Conformance
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 mb-6 md:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Open">Open</TabsTrigger>
          <TabsTrigger value="Investigation">Investigation</TabsTrigger>
          <TabsTrigger value="Containment">Containment</TabsTrigger>
          <TabsTrigger value="Correction">Correction</TabsTrigger>
          <TabsTrigger value="Verification">Verification</TabsTrigger>
          <TabsTrigger value="Closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <CardTitle>Non-Conformance List</CardTitle>
                  <CardDescription>View and manage all reported non-conformances</CardDescription>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <div>
                    <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="Minor">Minor</SelectItem>
                        <SelectItem value="Major">Major</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <NCList 
                nonConformances={nonConformances}
                loading={loading}
                onViewNC={handleViewNC}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default NonConformancePage;
