
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import ProductList from "@/components/product/ProductList";
import { Product } from "@/types/product";
import { getProducts } from "@/services/productService";
import { toast } from "@/hooks/use-toast";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Product Lifecycle Management" 
        description="Manage products, versions, and monitor lifecycle stages"
      />
      <div className="mt-8">
        <ProductList 
          products={products} 
          onSelectProduct={handleSelectProduct} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Products;
