
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import ProductList from "@/components/product/ProductList";

const Products = () => {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Product Lifecycle Management" 
        description="Manage products, versions, and monitor lifecycle stages"
      />
      <div className="mt-8">
        <ProductList />
      </div>
    </DashboardLayout>
  );
};

export default Products;
