
import React, { useState } from 'react';
import { Shield, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchRisks, createRisk } from '@/services/riskService';
import { Risk, getRiskLevel, getRiskLevelColor } from '@/types/risk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RiskForm from '@/components/risk/RiskForm';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RiskManagement: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    area: '',
    search: '',
  });

  const queryClient = useQueryClient();

  const { data: risks = [], isLoading } = useQuery({
    queryKey: ['risks', filters.status, filters.area],
    queryFn: () => fetchRisks({
      status: filters.status || undefined,
      area: filters.area || undefined
    })
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Risk, 'id' | 'risk_score'>) => createRisk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks'] });
      setShowAddDialog(false);
    }
  });

  const filteredRisks = risks.filter(risk => {
    return filters.search === '' || 
      risk.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (risk.description && risk.description.toLowerCase().includes(filters.search.toLowerCase()));
  });

  const riskCounts = {
    high: risks.filter(r => r.risk_score >= 15).length,
    medium: risks.filter(r => r.risk_score >= 8 && r.risk_score < 15).length,
    low: risks.filter(r => r.risk_score < 8).length,
    mitigated: risks.filter(r => r.status === 'Mitigated' || r.status === 'Closed').length,
    total: risks.length
  };

  const mitigationPercentage = riskCounts.total > 0 
    ? Math.round((riskCounts.mitigated / riskCounts.total) * 100) 
    : 0;

  const riskAreas = [
    'Supplier',
    'Process',
    'Product',
    'Facility',
    'Equipment',
    'Documentation',
    'Quality System',
    'Computer System',
    'Other'
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Risk Management"
        description="Identify, assess, and mitigate quality and compliance risks"
        icon={<Shield className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Risk Overview</CardTitle>
          <CardDescription>Current risk assessment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">High Risk</div>
              <div className="text-2xl font-bold">{riskCounts.high}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Medium Risk</div>
              <div className="text-2xl font-bold">{riskCounts.medium}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Low Risk</div>
              <div className="text-2xl font-bold">{riskCounts.low}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Controls Implemented</div>
              <div className="text-2xl font-bold">{mitigationPercentage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search risks..." 
              className="pl-10"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Select 
            value={filters.area} 
            onValueChange={(value) => setFilters(f => ({ ...f, area: value }))}
          >
            <SelectTrigger className="w-[150px] mr-2">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {riskAreas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters(f => ({ ...f, status: value }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Mitigated">Mitigated</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Risk Assessment
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Risk Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>RPN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p>Loading risk assessments...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRisks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Shield className="h-8 w-8 mb-2 opacity-30" />
                    <p>No risk assessment data available yet</p>
                    <p className="text-sm">Create your first risk assessment to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-mono text-xs">
                    {risk.id.substring(0, 6)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {risk.title}
                  </TableCell>
                  <TableCell>{risk.area || 'N/A'}</TableCell>
                  <TableCell>{risk.impact}</TableCell>
                  <TableCell>{risk.likelihood}</TableCell>
                  <TableCell>
                    <Badge className={getRiskLevelColor(getRiskLevel(risk.risk_score))}>
                      {risk.risk_score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      risk.status === 'Closed' ? 'bg-green-100 text-green-800' :
                      risk.status === 'Mitigated' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }>
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {risk.updated_at ? format(new Date(risk.updated_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <RiskForm 
            onSubmit={(data) => {
              // We need to ensure that title is provided as it's required
              const riskData: Omit<Risk, 'id' | 'risk_score'> = {
                title: data.title,
                description: data.description,
                area: data.area,
                likelihood: data.likelihood,
                impact: data.impact,
                mitigation_plan: data.mitigation_plan,
                responsible: data.responsible,
                status: data.status
              };
              
              createMutation.mutate(riskData);
            }}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RiskManagement;
