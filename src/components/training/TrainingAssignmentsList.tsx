
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { TrainingAssignment, TrainingStatus } from '@/types/training';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TrainingAssignmentWithDetails extends TrainingAssignment {
  training_item: {
    title: string;
    type: string;
  };
}

type TrainingAssignmentsListProps = {
  assignments: TrainingAssignmentWithDetails[];
  onComplete: (assignment: TrainingAssignmentWithDetails) => void;
  onMarkInProgress: (assignment: TrainingAssignmentWithDetails) => void;
  isLoading: boolean;
};

const getStatusBadge = (status: TrainingStatus) => {
  switch (status) {
    case 'Completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'In Progress':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
    case 'Pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'Overdue':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
    case 'Waived':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Waived</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TrainingAssignmentsList = ({ 
  assignments, 
  onComplete, 
  onMarkInProgress, 
  isLoading 
}: TrainingAssignmentsListProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading training assignments...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No training assignments found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Training</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Assigned Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment.id}>
            <TableCell className="font-medium">{assignment.training_item.title}</TableCell>
            <TableCell>{assignment.training_item.type}</TableCell>
            <TableCell>{format(new Date(assignment.assigned_date), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              {assignment.due_date 
                ? format(new Date(assignment.due_date), 'MMM d, yyyy') 
                : 'Not specified'}
            </TableCell>
            <TableCell>{getStatusBadge(assignment.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {assignment.status === 'Pending' && (
                    <DropdownMenuItem onClick={() => onMarkInProgress(assignment)}>
                      <AlertCircle className="mr-2 h-4 w-4" /> Mark as In Progress
                    </DropdownMenuItem>
                  )}
                  {(assignment.status === 'Pending' || assignment.status === 'In Progress' || assignment.status === 'Overdue') && (
                    <DropdownMenuItem onClick={() => onComplete(assignment)}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrainingAssignmentsList;
