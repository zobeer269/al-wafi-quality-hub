
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import ProductDetail from '@/components/product/ProductDetail';
import { Product } from '@/types/product';
import { getProductById } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return (
    <DashboardLayout>
      <PageHeader 
        title={product ? product.name : 'Product Details'} 
        description={product ? `Details for ${product.name}` : 'Loading product details...'}
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : product ? (
        <ProductDetail product={product} />
      ) : null}
    </DashboardLayout>
  );
};

export default ProductDetailPage;
