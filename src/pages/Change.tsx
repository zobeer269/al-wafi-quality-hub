
import React, { useState } from 'react';
import { FilePlus, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChanges, createChange } from '@/services/riskService';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ChangeForm from '@/components/risk/ChangeForm';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Change } from '@/types/risk';

const ChangeControl: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    linkedArea: '',
    search: '',
  });

  const queryClient = useQueryClient();

  const { data: changes = [], isLoading } = useQuery({
    queryKey: ['changes', filters.status, filters.linkedArea],
    queryFn: () => fetchChanges({
      status: filters.status || undefined,
      linked_area: filters.linkedArea || undefined
    })
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Change, 'id'>) => createChange(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['changes'] });
      setShowAddDialog(false);
    }
  });

  const filteredChanges = changes.filter(change => {
    return filters.search === '' || 
      change.change_title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (change.change_reason && change.change_reason.toLowerCase().includes(filters.search.toLowerCase()));
  });

  const changeStatusCounts = {
    pending: changes.filter(c => c.status === 'Pending').length,
    underReview: changes.filter(c => c.status === 'Under Review').length,
    approved: changes.filter(c => c.status === 'Approved').length,
    rejected: changes.filter(c => c.status === 'Rejected').length,
    implemented: changes.filter(c => c.status === 'Implemented').length,
  };

  const changeAreas = [
    'SOP',
    'Product',
    'Equipment',
    'Process',
    'Facility',
    'Material',
    'Supplier',
    'Computer System',
    'Other'
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Change Control"
        description="Manage and track changes to processes, products, and documentation"
        icon={<FilePlus className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Change Control Overview</CardTitle>
          <CardDescription>Current change request status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Draft</div>
              <div className="text-2xl font-bold">{changeStatusCounts.pending}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Under Review</div>
              <div className="text-2xl font-bold">{changeStatusCounts.underReview}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-600 font-medium">Approved</div>
              <div className="text-2xl font-bold">{changeStatusCounts.approved}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Implemented</div>
              <div className="text-2xl font-bold">{changeStatusCounts.implemented}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Rejected</div>
              <div className="text-2xl font-bold">{changeStatusCounts.rejected}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search change requests..." 
              className="pl-10"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Select 
            value={filters.linkedArea} 
            onValueChange={(value) => setFilters(f => ({ ...f, linkedArea: value }))}
          >
            <SelectTrigger className="w-[150px] mr-2">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Areas</SelectItem>
              {changeAreas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters(f => ({ ...f, status: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Implemented">Implemented</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Change Request
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CR ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Linked Risk</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Implementation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p>Loading change requests...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredChanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FilePlus className="h-8 w-8 mb-2 opacity-30" />
                    <p>No change request data available yet</p>
                    <p className="text-sm">Create your first change request to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-mono text-xs">
                    {change.id.substring(0, 6)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {change.change_title}
                  </TableCell>
                  <TableCell>{change.linked_area || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      change.status === 'Implemented' ? 'bg-green-100 text-green-800' :
                      change.status === 'Approved' ? 'bg-purple-100 text-purple-800' :
                      change.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                      change.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {change.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {change.risks ? (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {change.risks.title.substring(0, 20)}...
                      </Badge>
                    ) : 'None'}
                  </TableCell>
                  <TableCell>
                    {change.requested_by ? change.requested_by.substring(0, 8) : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {change.created_at ? format(new Date(change.created_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {change.implementation_date ? format(new Date(change.implementation_date), 'MMM d, yyyy') : 'Not set'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <ChangeForm 
            onSubmit={(data) => {
              const changeData = {
                change_title: data.change_title,
                change_reason: data.change_reason,
                linked_area: data.linked_area,
                risk_id: data.risk_id || undefined,
                implementation_plan: data.implementation_plan,
                implementation_date: data.implementation_date ? data.implementation_date.toISOString() : undefined,
                status: data.status,
                // If we have auth in the future, add requested_by: auth.user().id
              } as Omit<Change, 'id'>;
              
              createMutation.mutate(changeData);
            }}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ChangeControl;
