
import React, { useState } from 'react';
import { Package, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSuppliers, createSupplier } from '@/services/supplierService';
import SupplierList from '@/components/supplier/SupplierList';
import SupplierForm from '@/components/supplier/SupplierForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Supplier } from '@/types/supplier';

const Suppliers: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });

  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers
  });

  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowAddDialog(false);
    }
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    return (
      (filters.status === '' || supplier.status === filters.status) &&
      (filters.category === '' || supplier.category === filters.category) &&
      (filters.search === '' || 
        supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (supplier.contact_email && supplier.contact_email.toLowerCase().includes(filters.search.toLowerCase())))
    );
  });

  const handleAddSupplier = (supplier: Omit<Supplier, 'id'>) => {
    createMutation.mutate(supplier);
  };

  const supplierCounts = {
    approved: suppliers.filter(s => s.status === 'Approved').length,
    provisional: suppliers.filter(s => s.status === 'Pending').length,
    disqualified: suppliers.filter(s => s.status === 'Blacklisted').length,
    dueForEvaluation: suppliers.filter(s => {
      if (!s.requalification_due) return false;
      const dueDate = new Date(s.requalification_due);
      const now = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(now.getMonth() + 3);
      return dueDate <= threeMonthsFromNow;
    }).length
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Supplier Management"
        description="Qualify, monitor, and evaluate suppliers and vendors"
        icon={<Package className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Supplier Overview</CardTitle>
          <CardDescription>Current supplier qualification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Approved</div>
              <div className="text-2xl font-bold">{supplierCounts.approved}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Provisional</div>
              <div className="text-2xl font-bold">{supplierCounts.provisional}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Disqualified</div>
              <div className="text-2xl font-bold">{supplierCounts.disqualified}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Evaluation Due</div>
              <div className="text-2xl font-bold">{supplierCounts.dueForEvaluation}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <SupplierList 
        suppliers={filteredSuppliers}
        isLoading={isLoading}
        onAddClick={() => setShowAddDialog(true)}
        onFilterChange={setFilters}
      />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <SupplierForm 
            onSubmit={handleAddSupplier}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Suppliers;
