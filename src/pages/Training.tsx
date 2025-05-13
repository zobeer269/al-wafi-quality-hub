
import React, { useState } from 'react';
import { Users, Filter, Plus, Search, Check, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingStatus, TrainingType, TrainingAssignment } from '@/types/training';

// Sample data
const trainingData: TrainingAssignment[] = [
  {
    id: "1",
    userId: "1",
    userName: "Michael Chen",
    trainingItemId: "SOP-001",
    status: "Pending",
    assignedDate: "2024-05-01",
    dueDate: "2024-05-15",
    assignedBy: "Emily Johnson",
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Johnson",
    trainingItemId: "POL-003",
    status: "Completed",
    assignedDate: "2024-04-15",
    dueDate: "2024-04-30",
    completedDate: "2024-04-28",
    assignedBy: "David Kim",
    evaluationScore: 95,
    evaluatedBy: "Jessica Taylor",
  },
  {
    id: "3",
    userId: "3",
    userName: "Robert Garcia",
    trainingItemId: "WI-012",
    status: "Overdue",
    assignedDate: "2024-03-10",
    dueDate: "2024-04-10",
    assignedBy: "Emily Johnson",
  },
  {
    id: "4",
    userId: "4",
    userName: "Jessica Taylor",
    trainingItemId: "SOP-005",
    status: "In Progress",
    assignedDate: "2024-04-20",
    dueDate: "2024-05-20",
    assignedBy: "David Kim",
  }
];

const trainingItems = {
  "SOP-001": {
    title: "Document Control Procedure",
    type: "SOP" as TrainingType
  },
  "POL-003": {
    title: "Quality Policy",
    type: "Policy" as TrainingType
  },
  "WI-012": {
    title: "Equipment Calibration Work Instruction",
    type: "Work Instruction" as TrainingType
  },
  "SOP-005": {
    title: "CAPA Management Procedure",
    type: "SOP" as TrainingType
  }
};

const getStatusBadge = (status: TrainingStatus) => {
  switch(status) {
    case "Pending":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>;
    case "In Progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
    case "Completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    case "Overdue":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Overdue</Badge>;
    case "Waived":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Waived</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Training: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter training assignments based on tab and search term
  const filteredTrainings = trainingData.filter((training) => {
    const matchesTab = activeTab === "all" || 
      (activeTab === "pending" && training.status === "Pending") ||
      (activeTab === "inProgress" && training.status === "In Progress") ||
      (activeTab === "completed" && training.status === "Completed") ||
      (activeTab === "overdue" && training.status === "Overdue");
    
    const itemTitle = trainingItems[training.trainingItemId as keyof typeof trainingItems]?.title || "";
    
    const matchesSearch = searchTerm === "" ||
      training.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Training & Competency"
        description="Manage employee training records and competency assessments"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Training Overview</CardTitle>
          <CardDescription>Current training compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Completed</div>
              <div className="text-2xl font-bold">72%</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Pending</div>
              <div className="text-2xl font-bold">18%</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Overdue</div>
              <div className="text-2xl font-bold">10%</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Upcoming</div>
              <div className="text-2xl font-bold">15</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Training</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search training records..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Training Plan
          </Button>
          <Button className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Assign Training
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Training ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => {
                const item = trainingItems[training.trainingItemId as keyof typeof trainingItems];
                return (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.trainingItemId}</TableCell>
                    <TableCell>{item?.title || "Unknown"}</TableCell>
                    <TableCell>{item?.type || "Unknown"}</TableCell>
                    <TableCell>{training.userName}</TableCell>
                    <TableCell>{getStatusBadge(training.status)}</TableCell>
                    <TableCell>{training.assignedDate}</TableCell>
                    <TableCell>{training.dueDate || "-"}</TableCell>
                    <TableCell>
                      {training.status === "Completed" ? (
                        <div className="flex items-center">
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          {training.completedDate}
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">View details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Users className="h-8 w-8 mb-2 opacity-30" />
                    <p>No training data available yet</p>
                    <p className="text-sm">Create your first training record to get started</p>
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

export default Training;
