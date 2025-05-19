
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, FilterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Product, ProductStatus } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ProductFilters {
  status: ProductStatus | 'all';
  search: string;
  manufacturer?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterChange?: (filters: ProductFilters) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSelectProduct, onFilterChange }) => {
  const [filters, setFilters] = useState<ProductFilters>({
    status: 'all' as ProductStatus | 'all',
    search: '',
    manufacturer: '',
  });
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleFilterChange = (field: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        dateFrom: range.from,
        dateTo: range.to,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Development':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Development</Badge>;
      case 'Pending Approval':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Approval</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'Released':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Released</Badge>;
      case 'Obsolete':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Obsolete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 pb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or SKU..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Development">In Development</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Released">Released</SelectItem>
              <SelectItem value="Obsolete">Obsolete</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Manufacturer"
            value={filters.manufacturer || ''}
            onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
            className="w-[180px]"
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={(range) => handleDateRangeChange(range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon" onClick={() => {
            setFilters({ status: 'all' as ProductStatus | 'all', search: '', manufacturer: '' });
            setDateRange({});
            if (onFilterChange) {
              onFilterChange({ status: 'all' as ProductStatus | 'all', search: '', manufacturer: '' });
            }
          }}>
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="cursor-pointer hover:bg-gray-100" onClick={() => onSelectProduct(product)}>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category || '-'}</TableCell>
                <TableCell>{product.manufacturer || '-'}</TableCell>
                <TableCell>{getStatusBadge(product.status as string)}</TableCell>
                <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">View</span>
                    <Check className="h-4 w-4" />
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

export default ProductList;
