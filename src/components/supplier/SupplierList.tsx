
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Supplier, SupplierStatus } from '@/types/supplier';
import { format } from 'date-fns';
import { Package, PlusCircle, Search, File, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SupplierListProps = {
  suppliers: Supplier[];
  isLoading: boolean;
  onAddClick: () => void;
  onFilterChange: (filter: { status: string; category: string; search: string }) => void;
};

const getStatusColor = (status: SupplierStatus) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-amber-100 text-amber-800';
    case 'Suspended':
      return 'bg-orange-100 text-orange-800';
    case 'Blacklisted':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const SupplierList = ({ suppliers, isLoading, onAddClick, onFilterChange }: SupplierListProps) => {
  const [filters, setFilters] = React.useState({
    status: '',
    category: '',
    search: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const supplierCategories = [
    'API Supplier',
    'Packaging Supplier',
    'Equipment Supplier',
    'Distributor',
    'Contract Manufacturer',
    'Laboratory Service',
    'Consultant',
    'Software Provider',
    'Logistics Provider',
    'Other'
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search suppliers..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Blacklisted">Blacklisted</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {supplierCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAddClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading suppliers...
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Package className="h-8 w-8 mb-2 opacity-30" />
                    <p>No suppliers found</p>
                    <p className="text-sm">Add your first supplier to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {supplier.contact_email && (
                      <a href={`mailto:${supplier.contact_email}`} className="text-blue-600 hover:underline">
                        {supplier.contact_email}
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {supplier.updated_at ? format(new Date(supplier.updated_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/suppliers/${supplier.id}`}>
                              <File className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/suppliers/${supplier.id}/audits`}>
                              <Users className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Audit History</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SupplierList;
