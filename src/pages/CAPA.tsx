
import React from 'react';
import { AlertTriangle, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Sample CAPA data for demo purposes
const capaData = [
  { 
    id: 'CAPA-2024-001', 
    title: 'Equipment Calibration Process Improvement', 
    type: 'Corrective', 
    status: 'Open', 
    priority: 'High', 
    createdDate: '2024-05-01',
    dueDate: '2024-06-15',
    assignedTo: 'Jane Smith'
  },
  { 
    id: 'CAPA-2024-002', 
    title: 'Training Documentation Gap', 
    type: 'Preventive', 
    status: 'Investigation', 
    priority: 'Medium', 
    createdDate: '2024-04-20',
    dueDate: '2024-05-30',
    assignedTo: 'John Davis'
  },
  { 
    id: 'CAPA-2024-003', 
    title: 'Supplier Quality Issue', 
    type: 'Both', 
    status: 'In Progress', 
    priority: 'High', 
    createdDate: '2024-04-15',
    dueDate: '2024-05-20',
    assignedTo: 'Michael Brown'
  },
  { 
    id: 'CAPA-2024-004', 
    title: 'Document Control Non-Compliance', 
    type: 'Corrective', 
    status: 'Closed', 
    priority: 'Medium', 
    createdDate: '2024-03-10',
    dueDate: '2024-04-15',
    assignedTo: 'Sarah Johnson'
  },
  { 
    id: 'CAPA-2024-005', 
    title: 'Process Validation Gap Assessment', 
    type: 'Preventive', 
    status: 'Open', 
    priority: 'Low', 
    createdDate: '2024-05-05',
    dueDate: '2024-06-30',
    assignedTo: 'Robert Wilson'
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Open':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300">Open</Badge>;
    case 'Investigation':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-300">Investigation</Badge>;
    case 'In Progress':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-300">In Progress</Badge>;
    case 'Closed':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'High':
      return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">High</Badge>;
    case 'Medium':
      return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">Medium</Badge>;
    case 'Low':
      return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const CAPA: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="CAPA Management"
        description="Track and manage corrective and preventive actions"
        icon={<AlertTriangle className="h-6 w-6" />}
      />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>CAPA Overview</CardTitle>
          <CardDescription>Current status of corrective and preventive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Total CAPAs</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-sm text-yellow-600 font-medium">Open</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="text-sm text-indigo-600 font-medium">In Progress</div>
              <div className="text-2xl font-bold">4</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Closed</div>
              <div className="text-2xl font-bold">3</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <Input 
            placeholder="Search CAPAs..." 
            className="max-w-sm mr-2"
            startDecorator={<Search className="h-4 w-4" />} 
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New CAPA
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capaData.map((capa) => (
                <TableRow key={capa.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{capa.id}</TableCell>
                  <TableCell>{capa.title}</TableCell>
                  <TableCell>{capa.type}</TableCell>
                  <TableCell>{getStatusBadge(capa.status)}</TableCell>
                  <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                  <TableCell>{capa.dueDate}</TableCell>
                  <TableCell>{capa.assignedTo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CAPA;
