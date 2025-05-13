
import React from 'react';
import { ArrowRight, CheckSquare, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Audit, AuditStatus, AuditType } from '@/types/audit';

interface AuditListProps {
  audits: Audit[];
  onViewAudit: (audit: Audit) => void;
}

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

const AuditList: React.FC<AuditListProps> = ({ audits, onViewAudit }) => {
  return (
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
        {audits.length > 0 ? (
          audits.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell className="font-medium">{audit.audit_number}</TableCell>
              <TableCell>{audit.title}</TableCell>
              <TableCell>{getTypeBadge(audit.audit_type)}</TableCell>
              <TableCell>{getStatusBadge(audit.status)}</TableCell>
              <TableCell>{audit.scheduled_start_date && audit.scheduled_end_date 
                ? `${new Date(audit.scheduled_start_date).toLocaleDateString()} to ${new Date(audit.scheduled_end_date).toLocaleDateString()}`
                : 'Not scheduled'}
              </TableCell>
              <TableCell>{audit.auditor_names ? audit.auditor_names[0] : 'Not assigned'}</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onViewAudit(audit)}>
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
  );
};

export default AuditList;
