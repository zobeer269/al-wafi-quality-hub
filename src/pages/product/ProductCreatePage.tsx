
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Package } from 'lucide-react';
import ProductForm from '@/components/product/ProductForm';
import { Card, CardContent } from '@/components/ui/card';
import { createProduct } from '@/services/productService';
import { toast } from '@/hooks/use-toast';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const result = await createProduct(values);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
        navigate(`/products/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Create New Product"
        description="Add a new product to the system"
        icon={<Package className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <ProductForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ProductCreatePage;
