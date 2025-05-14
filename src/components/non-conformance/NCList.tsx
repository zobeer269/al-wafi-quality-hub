
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import { NonConformance } from '@/types/nonConformance';

interface NCListProps {
  nonConformances: NonConformance[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Investigation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Containment':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Correction':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Verification':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityBadgeVariant = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Major':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Minor':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const NCList: React.FC<NCListProps> = ({ nonConformances }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NC ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reported Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>CAPA Required</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nonConformances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No non-conformances found.
              </TableCell>
            </TableRow>
          ) : (
            nonConformances.map((nc) => (
              <TableRow key={nc.id}>
                <TableCell className="font-medium">{nc.nc_number}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={nc.title}>{nc.title}</TableCell>
                <TableCell>{nc.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeVariant(nc.status)}>
                    {nc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSeverityBadgeVariant(nc.severity)}>
                    {nc.severity}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(nc.reported_date)}</TableCell>
                <TableCell>{nc.assigned_to || '-'}</TableCell>
                <TableCell>{nc.capa_required ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/nonconformance/${nc.id}`)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NCList;
