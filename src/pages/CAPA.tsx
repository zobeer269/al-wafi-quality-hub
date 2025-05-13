
import React, { useState } from 'react';
import { AlertTriangle, Check, Filter, Plus, Search, X } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAType } from '@/types/document';

// Sample data
const capaData = [
  {
    id: "1",
    number: "CAPA-2023-001",
    title: "Equipment Calibration Failure",
    type: "Corrective" as CAPAType,
    status: "Open" as CAPAStatus,
    priority: 3,
    createdDate: "2023-12-15",
    dueDate: "2024-01-15",
    assignedTo: "Sarah Johnson",
    description: "Calibration failures detected in lab equipment LB-001. Investigation required."
  },
  {
    id: "2",
    number: "CAPA-2023-002",
    title: "Supplier Material Nonconformance",
    type: "Corrective" as CAPAType,
    status: "In Progress" as CAPAStatus,
    priority: 2,
    createdDate: "2023-12-20",
    dueDate: "2024-01-20",
    assignedTo: "Michael Chen",
    description: "Multiple batches of raw materials from Supplier XYZ failed incoming inspection."
  },
  {
    id: "3",
    number: "CAPA-2024-001",
    title: "Documentation Process Improvement",
    type: "Preventive" as CAPAType,
    status: "Open" as CAPAStatus,
    priority: 1,
    createdDate: "2024-01-05",
    dueDate: "2024-02-15",
    assignedTo: "Jessica Taylor",
    description: "Implement improved document control process to prevent recurrence of documentation errors."
  },
  {
    id: "4",
    number: "CAPA-2024-002",
    title: "Training Program Deficiency",
    type: "Both" as CAPAType,
    status: "Closed" as CAPAStatus,
    priority: 2,
    createdDate: "2024-01-10",
    dueDate: "2024-02-10",
    assignedTo: "Robert Garcia",
    description: "Address gaps in operator training program identified during internal audit."
  },
  {
    id: "5",
    number: "CAPA-2024-003",
    title: "Process Validation Failure",
    type: "Corrective" as CAPAType,
    status: "Investigation" as CAPAStatus,
    priority: 3,
    createdDate: "2024-02-01",
    dueDate: "2024-03-01",
    assignedTo: "David Kim",
    description: "Process validation for manufacturing line 2 failed acceptance criteria. Root cause analysis needed."
  }
];

const getPriorityBadge = (priority: number) => {
  switch(priority) {
    case 3:
      return <Badge variant="destructive">High</Badge>;
    case 2:
      return <Badge variant="default">Medium</Badge>;
    case 1:
      return <Badge variant="outline">Low</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

const getStatusBadge = (status: CAPAStatus) => {
  switch(status) {
    case "Open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Open</Badge>;
    case "In Progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
    case "Investigation":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Investigation</Badge>;
    case "Closed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Closed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const CAPAPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCapas = capaData.filter(capa => {
    const matchesStatus = filterStatus ? capa.status === filterStatus : true;
    const matchesSearch = searchTerm 
      ? capa.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        capa.number.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="CAPA Management"
        description="Track and manage Corrective and Preventive Actions"
        icon={<AlertTriangle className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>CAPA Overview</CardTitle>
          <CardDescription>Current status of open CAPAs by priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">High Priority</div>
              <div className="text-2xl font-bold">4</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Medium Priority</div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Low Priority</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Closed (Last 30 Days)</div>
              <div className="text-2xl font-bold">12</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search CAPAs..." 
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          {filterStatus && (
            <Button variant="outline" size="sm" onClick={() => setFilterStatus(null)}>
              {filterStatus} <X className="ml-1 h-4 w-4" />
            </Button>
          )}
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New CAPA
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCapas.map((capa) => (
              <TableRow key={capa.id}>
                <TableCell className="font-medium">{capa.number}</TableCell>
                <TableCell>{capa.title}</TableCell>
                <TableCell>{capa.type}</TableCell>
                <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
                <TableCell>
                  <div className="cursor-pointer" onClick={() => setFilterStatus(capa.status)}>
                    {getStatusBadge(capa.status)}
                  </div>
                </TableCell>
                <TableCell>{capa.createdDate}</TableCell>
                <TableCell>{capa.dueDate || '-'}</TableCell>
                <TableCell>{capa.assignedTo}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open</span>
                    <Check className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCapas.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No matching CAPAs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
};

export default CAPAPage;
