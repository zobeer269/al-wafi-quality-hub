
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, FilePlus, Pencil, Trash2 } from 'lucide-react';
import { TrainingPlan } from '@/types/training';
import { Badge } from '@/components/ui/badge';

type TrainingPlanListProps = {
  plans: TrainingPlan[];
  onEdit: (plan: TrainingPlan) => void;
  onDelete: (plan: TrainingPlan) => void;
  onAddTrainingItem: (planId: string) => void;
  onViewTrainingItems: (planId: string) => void;
  isLoading: boolean;
};

const TrainingPlanList = ({ 
  plans, 
  onEdit, 
  onDelete, 
  onAddTrainingItem,
  onViewTrainingItems,
  isLoading 
}: TrainingPlanListProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading training plans...</div>;
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No training plans found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Job Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            <TableCell className="font-medium">{plan.title}</TableCell>
            <TableCell>{plan.job_role}</TableCell>
            <TableCell>{plan.department}</TableCell>
            <TableCell>
              <Badge variant={plan.status === 'Active' ? 'default' : 'outline'}>
                {plan.status}
              </Badge>
            </TableCell>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewTrainingItems(plan.id)}>
                    <FilePlus className="mr-2 h-4 w-4" /> View Training Items
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddTrainingItem(plan.id)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Training Item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(plan)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(plan)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Plan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrainingPlanList;
