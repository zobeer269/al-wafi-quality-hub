
import React, { useState } from 'react';
import { CheckSquare, Filter, Plus, Search, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Audit, AuditStatus, AuditType } from '@/types/audit';

// Sample data
const auditData: Audit[] = [
  {
    id: "1",
    auditId: "IA-2024-001",
    title: "Annual Quality System Review",
    type: "Internal",
    scope: "All QMS processes",
    status: "Scheduled",
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    leadAuditor: "Emily Johnson",
    auditTeam: ["Robert Garcia", "Michael Chen"],
    department: "Quality Assurance",
    description: "Comprehensive review of all quality system processes and procedures."
  },
  {
    id: "2",
    auditId: "EA-2024-001",
    title: "ISO 13485 Surveillance Audit",
    type: "External",
    scope: "Medical Device QMS",
    status: "Scheduled",
    startDate: "2024-07-10",
    endDate: "2024-07-12",
    leadAuditor: "External - TÜV SÜD",
    department: "All Departments",
    description: "Annual surveillance audit for ISO 13485:2016 certification."
  },
  {
    id: "3",
    auditId: "SA-2024-001",
    title: "Critical Component Supplier Audit",
    type: "Supplier",
    scope: "Manufacturing processes",
    status: "Completed",
    startDate: "2024-02-05",
    endDate: "2024-02-06",
    leadAuditor: "David Kim",
    auditTeam: ["Sarah Johnson"],
    department: "Purchasing",
    description: "On-site audit of critical component supplier XYZ Manufacturing."
  }
];

const getStatusBadge = (status: AuditStatus) => {
  switch(status) {
    case "Scheduled":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "In Progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
    case "Completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case "Cancelled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getTypeBadge = (type: AuditType) => {
  switch(type) {
    case "Internal":
      return <Badge variant="secondary">Internal</Badge>;
    case "External":
      return <Badge variant="default">External</Badge>;
    case "Supplier":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Supplier</Badge>;
    case "Regulatory":
      return <Badge variant="destructive">Regulatory</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Audits: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState<boolean>(false);
  
  // Filter audits based on tab and search term
  const filteredAudits = auditData.filter((audit) => {
    const matchesTab = activeTab === "all" || 
      (activeTab === "scheduled" && audit.status === "Scheduled") ||
      (activeTab === "inProgress" && audit.status === "In Progress") ||
      (activeTab === "completed" && audit.status === "Completed");
    
    const matchesSearch = searchTerm === "" ||
      audit.auditId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Audit Management"
        description="Schedule, conduct, and track internal and external audits"
        icon={<CheckSquare className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Audit Overview</CardTitle>
          <CardDescription>Summary of audit activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Scheduled Audits</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">In Progress</div>
              <div className="text-2xl font-bold">2</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Completed</div>
              <div className="text-2xl font-bold">8</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Findings</div>
              <div className="text-2xl font-bold">12</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Audits</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search audits..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isNewAuditDialogOpen} onOpenChange={setIsNewAuditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Audit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Audit</DialogTitle>
              <DialogDescription>
                Create a new audit by filling in the details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auditTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="auditTitle"
                  placeholder="Audit title"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auditType" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select audit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Audit Types</SelectLabel>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scope" className="text-right">
                  Scope
                </Label>
                <Input
                  id="scope"
                  placeholder="Audit scope"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leadAuditor" className="text-right">
                  Lead Auditor
                </Label>
                <Input
                  id="leadAuditor"
                  placeholder="Lead auditor name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Schedule Audit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Lead Auditor</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.auditId}</TableCell>
                  <TableCell>{audit.title}</TableCell>
                  <TableCell>{getTypeBadge(audit.type)}</TableCell>
                  <TableCell>{getStatusBadge(audit.status)}</TableCell>
                  <TableCell>{`${audit.startDate} to ${audit.endDate}`}</TableCell>
                  <TableCell>{audit.leadAuditor}</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">View details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <CheckSquare className="h-8 w-8 mb-2 opacity-30" />
                    <p>No audit data available yet</p>
                    <p className="text-sm">Schedule your first audit to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
};

export default Audits;
