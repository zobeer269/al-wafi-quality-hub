import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Product, ProductStatus, ProductFilters } from '@/types/product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductListProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterChange?: (filters: ProductFilters) => void;
}

// Replace the fetchProducts reference with getProducts
const ProductList: React.FC<ProductListProps> = ({ products = [], onSelectProduct, onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleStatusChange = (status: ProductStatus | 'all') => {
    setStatusFilter(status);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (dates: { from?: Date; to?: Date }) => {
    setDateRange(dates);
  };

  const applyFilters = () => {
    if (onFilterChange) {
      const filters: ProductFilters = {};
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      if (categoryFilter) {
        filters.category = categoryFilter;
      }
      
      if (dateRange.from) {
        filters.dateFrom = dateRange.from.toISOString();
      }
      
      if (dateRange.to) {
        filters.dateTo = dateRange.to.toISOString();
      }
      
      onFilterChange(filters);
    }
  };

  const filteredProducts = products?.filter(product => {
    const searchRegex = new RegExp(searchQuery, 'i');
    return searchRegex.test(product.name) || searchRegex.test(product.sku);
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-xs"
        />

        <Select onValueChange={(value) => handleStatusChange(value as ProductStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="In Development">In Development</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Released">Released</SelectItem>
            <SelectItem value="Obsolete">Obsolete</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Filter by Category..."
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="max-w-xs"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !dateRange.from && !dateRange.to ? "text-muted-foreground" : undefined
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                format(dateRange.from, "yyyy-MM-dd") + " - " + format(dateRange.to, "yyyy-MM-dd")
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts?.map((product) => (
            <TableRow key={product.id} onClick={() => onSelectProduct(product)} className="cursor-pointer hover:bg-gray-100">
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.manufacturer}</TableCell>
              <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
