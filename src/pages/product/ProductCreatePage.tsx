
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import ProductForm from "@/components/product/ProductForm";

const ProductCreatePage = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Add New Product" 
        description="Create a new product for lifecycle management"
        backLink="/products"
      />
      <div className="mt-8">
        <ProductForm />
      </div>
    </DashboardLayout>
  );
};

export default ProductCreatePage;
