
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CAPAStatus, CAPAType, CAPA, CAPAPriority, priorityLabelMap } from '@/types/document';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CAPAListProps {
  capas: CAPA[];
  onSelectCAPA: (capa: CAPA) => void;
  onFilterStatus?: (status: CAPAStatus | null) => void;
}

const CAPAList: React.FC<CAPAListProps> = ({ capas, onSelectCAPA, onFilterStatus }) => {
  const [filterStatus, setFilterStatus] = useState<CAPAStatus | null>(null);
  
  const handleStatusClick = (status: CAPAStatus) => {
    const newStatus = filterStatus === status ? null : status;
    setFilterStatus(newStatus);
    if (onFilterStatus) {
      onFilterStatus(newStatus);
    }
  };
  
  const getPriorityBadge = (priority: CAPAPriority) => {
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
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Open</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 cursor-pointer" onClick={() => handleStatusClick(status)}>In Progress</Badge>;
      case "Investigation":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Investigation</Badge>;
      case "Closed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Closed</Badge>;
      default:
        return <Badge variant="outline" className="cursor-pointer" onClick={() => handleStatusClick(status)}>Unknown</Badge>;
    }
  };

  return (
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
        {capas.map((capa) => (
          <TableRow key={capa.id} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelectCAPA(capa)}>
            <TableCell className="font-medium">{capa.number}</TableCell>
            <TableCell>{capa.title}</TableCell>
            <TableCell>{capa.type}</TableCell>
            <TableCell>{getPriorityBadge(capa.priority)}</TableCell>
            <TableCell>{getStatusBadge(capa.status)}</TableCell>
            <TableCell>{new Date(capa.createdDate).toLocaleDateString()}</TableCell>
            <TableCell>{capa.dueDate ? new Date(capa.dueDate).toLocaleDateString() : '-'}</TableCell>
            <TableCell>{capa.assignedTo || '-'}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">View</span>
                <Check className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {capas.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="h-24 text-center">
              No CAPAs found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CAPAList;
