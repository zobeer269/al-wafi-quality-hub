
import React from 'react';
import { FilePlus, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Change: React.FC = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Draft</div>
              <div className="text-2xl font-bold">4</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Pending Approval</div>
              <div className="text-2xl font-bold">7</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Implemented</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Rejected</div>
              <div className="text-2xl font-bold">3</div>
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
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full md:w-auto">
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
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Implementation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FilePlus className="h-8 w-8 mb-2 opacity-30" />
                  <p>No change request data available yet</p>
                  <p className="text-sm">Create your first change request to get started</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
};

export default Change;
