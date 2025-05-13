import React from 'react';
import { AlertTriangle, ClipboardCheck, FilePlus, FileText, Shield, Users } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import StatusCard from '@/components/dashboard/StatusCard';
import MetricsChart from '@/components/dashboard/MetricsChart';
import DocumentList from '@/components/document-control/DocumentList';

// Sample data for demo purposes
const documentData = [
  { id: '1', number: 'QP-SOP-001', title: 'Document Control Procedure', type: 'SOP', version: '1.2', status: 'Approved', lastUpdated: '2024-03-15' },
  { id: '2', number: 'QP-SOP-002', title: 'CAPA Management Procedure', type: 'SOP', version: '2.0', status: 'In Review', lastUpdated: '2024-04-20' },
  { id: '3', number: 'QP-FRM-010', title: 'Supplier Qualification Form', type: 'Form', version: '1.0', status: 'Draft', lastUpdated: '2024-05-01' },
  { id: '4', number: 'QP-POL-001', title: 'Quality Policy', type: 'Policy', version: '2.1', status: 'Approved', lastUpdated: '2023-12-10' },
  { id: '5', number: 'QP-MAN-001', title: 'Quality Manual', type: 'Manual', version: '3.0', status: 'Approved', lastUpdated: '2024-01-05' },
];

const capaStatusData = [
  { name: 'Open', value: 12 },
  { name: 'In Progress', value: 8 },
  { name: 'Closed', value: 25 },
];

const qualityMetricsData = [
  { month: 'Jan', deviations: 4, complaints: 2, capas: 5 },
  { month: 'Feb', deviations: 3, complaints: 4, capas: 4 },
  { month: 'Mar', deviations: 5, complaints: 3, capas: 6 },
  { month: 'Apr', deviations: 2, complaints: 1, capas: 3 },
  { month: 'May', deviations: 4, complaints: 3, capas: 5 },
];

const Index: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Quality Management Dashboard" 
        description="Monitor key quality indicators and recent activities"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatusCard 
          title="Documents Pending Review" 
          value="7" 
          icon={<FileText className="h-5 w-5" />}
          change={{ value: 15, trend: 'up' }} 
        />
        <StatusCard 
          title="Open CAPAs" 
          value="12" 
          icon={<AlertTriangle className="h-5 w-5" />}
          change={{ value: 5, trend: 'down' }} 
        />
        <StatusCard 
          title="Upcoming Audits" 
          value="3" 
          icon={<ClipboardCheck className="h-5 w-5" />} 
        />
        <StatusCard 
          title="Changes Pending Approval" 
          value="5" 
          icon={<FilePlus className="h-5 w-5" />} 
        />
        <StatusCard 
          title="Overdue Training" 
          value="9" 
          icon={<Users className="h-5 w-5" />}
          change={{ value: 20, trend: 'up' }} 
        />
        <StatusCard 
          title="High Risk Items" 
          value="4" 
          icon={<Shield className="h-5 w-5" />}
          change={{ value: 10, trend: 'down' }} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MetricsChart
            title="Quality Metrics Trend"
            subtitle="Monthly overview of key quality indicators"
            type="bar"
            data={qualityMetricsData}
            dataKeys={{ x: 'month', y: ['deviations', 'complaints', 'capas'] }}
            colors={['#5CB85C', '#F0AD4E', '#D9534F']}
          />
        </div>
        <div>
          <MetricsChart
            title="CAPA Status"
            subtitle="Distribution of current CAPAs"
            type="pie"
            data={capaStatusData}
            dataKeys={{ x: 'name', y: 'value' }}
            colors={['#F0AD4E', '#0A6ED1', '#5CB85C']}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recently Updated Documents</h2>
        <DocumentList documents={documentData} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
