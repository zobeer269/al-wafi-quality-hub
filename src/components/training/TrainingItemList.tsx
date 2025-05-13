
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
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react';
import { TrainingItem } from '@/types/training';
import { Badge } from '@/components/ui/badge';

type TrainingItemListProps = {
  items: TrainingItem[];
  onEdit: (item: TrainingItem) => void;
  onDelete: (item: TrainingItem) => void;
  onAssign: (item: TrainingItem) => void;
  isLoading: boolean;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'SOP': return 'bg-blue-100 text-blue-800';
    case 'Policy': return 'bg-purple-100 text-purple-800';
    case 'Work Instruction': return 'bg-green-100 text-green-800';
    case 'External': return 'bg-orange-100 text-orange-800';
    case 'On-the-job': return 'bg-yellow-100 text-yellow-800';
    case 'Classroom': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const TrainingItemList = ({ 
  items, 
  onEdit, 
  onDelete, 
  onAssign,
  isLoading 
}: TrainingItemListProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading training items...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No training items found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Evaluation</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
            </TableCell>
            <TableCell>{item.frequency}</TableCell>
            <TableCell>
              {item.evaluation_required ? (
                <Badge variant="default">Required</Badge>
              ) : (
                <Badge variant="outline">Not Required</Badge>
              )}
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
                  <DropdownMenuItem onClick={() => onAssign(item)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Assign to Users
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(item)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Item
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

export default TrainingItemList;
