
import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ProductDetail from "@/components/product/ProductDetail";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout>
      <PageHeader 
        title="Product Details" 
        description="View and manage product information and versions"
        backLink="/products"
      />
      <div className="mt-8">
        {id && <ProductDetail productId={id} />}
      </div>
    </DashboardLayout>
  );
};

export default ProductDetailPage;
