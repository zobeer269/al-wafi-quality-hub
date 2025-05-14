
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, Eye, Pencil } from 'lucide-react';
import { NonConformance } from '@/types/nonConformance';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface NCListProps {
  nonConformances: NonConformance[];
  loading?: boolean;
}

const NCList: React.FC<NCListProps> = ({ nonConformances, loading = false }) => {
  const navigate = useNavigate();

  const handleViewNC = (id: string) => {
    navigate(`/nonconformance/${id}`);
  };

  const handleEditNC = (id: string) => {
    navigate(`/nonconformance/edit/${id}`);
    // Prevent the row click from triggering
    return false;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-red-500">{severity}</Badge>;
      case 'Major':
        return <Badge className="bg-amber-500">{severity}</Badge>;
      case 'Minor':
        return <Badge className="bg-blue-500">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{status}</Badge>;
      case 'In Investigation':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">{status}</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="border-green-500 text-green-500">{status}</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!nonConformances || nonConformances.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No non-conformances found
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">
              ID <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Date Reported</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nonConformances.map((nc) => (
            <TableRow 
              key={nc.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleViewNC(nc.id)}
            >
              <TableCell className="font-medium">{nc.nc_number}</TableCell>
              <TableCell>{nc.title}</TableCell>
              <TableCell>{getStatusBadge(nc.status)}</TableCell>
              <TableCell>{getSeverityBadge(nc.severity)}</TableCell>
              <TableCell>{formatDate(nc.created_at)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); handleViewNC(nc.id); }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleEditNC(nc.id);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NCList;
