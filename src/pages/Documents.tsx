
import React from 'react';
import { FileText, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentList from '@/components/document-control/DocumentList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Document, DocumentStatus } from '@/types/document';

// Sample data for demo purposes
const documentData: Document[] = [
  { id: '1', number: 'QP-SOP-001', title: 'Document Control Procedure', type: 'SOP', version: '1.2', status: 'Approved', lastUpdated: '2024-03-15' },
  { id: '2', number: 'QP-SOP-002', title: 'CAPA Management Procedure', type: 'SOP', version: '2.0', status: 'In Review', lastUpdated: '2024-04-20' },
  { id: '3', number: 'QP-FRM-010', title: 'Supplier Qualification Form', type: 'Form', version: '1.0', status: 'Draft', lastUpdated: '2024-05-01' },
  { id: '4', number: 'QP-POL-001', title: 'Quality Policy', type: 'Policy', version: '2.1', status: 'Approved', lastUpdated: '2023-12-10' },
  { id: '5', number: 'QP-MAN-001', title: 'Quality Manual', type: 'Manual', version: '3.0', status: 'Approved', lastUpdated: '2024-01-05' },
  { id: '6', number: 'QP-SOP-003', title: 'Internal Audit Procedure', type: 'SOP', version: '1.1', status: 'Approved', lastUpdated: '2024-02-28' },
  { id: '7', number: 'QP-WI-001', title: 'Equipment Calibration Work Instruction', type: 'Work Instruction', version: '2.3', status: 'In Review', lastUpdated: '2024-04-30' },
  { id: '8', number: 'QP-FRM-012', title: 'Change Request Form', type: 'Form', version: '1.0', status: 'Draft', lastUpdated: '2024-05-02' },
];

const Documents: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Document Control"
        description="Manage and control quality management system documents"
        icon={<FileText className="h-6 w-6" />}
      />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Document Overview</CardTitle>
          <CardDescription>Current status of quality management system documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Total Documents</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Approved</div>
              <div className="text-2xl font-bold">16</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-sm text-yellow-600 font-medium">In Review</div>
              <div className="text-2xl font-bold">5</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-600 font-medium">Draft</div>
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
              placeholder="Search documents..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      <DocumentList documents={documentData} />
    </DashboardLayout>
  );
};

export default Documents;
