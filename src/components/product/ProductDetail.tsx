
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Product, ProductVersion } from "@/types/product";
import { fetchProductById, fetchProductVersions, updateProduct } from "@/services/productService";
import { formatDate } from "@/lib/utils";
import { Loader2, PlusCircle, Link as LinkIcon } from "lucide-react";
import ProductForm from "./ProductForm";
import ProductVersionForm from "./ProductVersionForm";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [editingVersion, setEditingVersion] = useState<ProductVersion | null>(null);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      const productData = await fetchProductById(productId);
      const productVersions = await fetchProductVersions(productId);

      if (productData) {
        setProduct(productData);
        setVersions(productVersions);
      }
      setLoading(false);
    };

    loadProductData();
  }, [productId]);

  const handleRefresh = async () => {
    setLoading(true);
    const productData = await fetchProductById(productId);
    const productVersions = await fetchProductVersions(productId);
    
    if (productData) {
      setProduct(productData);
      setVersions(productVersions);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Development":
        return <Badge variant="secondary">In Development</Badge>;
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Discontinued":
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getVersionStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Active":
        return <Badge variant="default">Active</Badge>;
      case "Retired":
        return <Badge variant="outline">Retired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleEditVersion = (version: ProductVersion) => {
    setEditingVersion(version);
    setShowVersionForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="mt-2 text-muted-foreground">
          The requested product could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  if (editMode) {
    return <ProductForm initialData={product} isEditing={true} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              SKU: {product.sku}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit Product
            </Button>
            <Button onClick={() => setShowVersionForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Version
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">{getStatusBadge(product.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Category</h3>
                <p className="mt-1">{product.category || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Manufacturer</h3>
                <p className="mt-1">{product.manufacturer || "-"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-1">{product.description || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Registration Number</h3>
                <p className="mt-1">{product.registration_number || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Creation Date</h3>
                <p className="mt-1">{formatDate(product.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="versions">
        <TabsList>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>
        <TabsContent value="versions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Linked Documents</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {versions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No versions found. Add a new version to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      versions.map((version) => (
                        <TableRow key={version.id}>
                          <TableCell className="font-medium">
                            {version.version}
                          </TableCell>
                          <TableCell>
                            {getVersionStatusBadge(version.status)}
                          </TableCell>
                          <TableCell>
                            {version.effective_date
                              ? formatDate(version.effective_date)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              {version.documents?.title && (
                                <div className="flex items-center text-xs">
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  <span>SOP: {version.documents.number}</span>
                                </div>
                              )}
                              {version.capas?.title && (
                                <div className="flex items-center text-xs">
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  <span>CAPA: {version.capas.number}</span>
                                </div>
                              )}
                              {!version.documents?.title && !version.capas?.title && "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(version.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            {version.status !== "Retired" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditVersion(version)}
                              >
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showVersionForm && (
        <ProductVersionForm
          productId={productId}
          isOpen={showVersionForm}
          onClose={() => {
            setShowVersionForm(false);
            setEditingVersion(null);
          }}
          initialData={editingVersion || undefined}
          isEditing={!!editingVersion}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default ProductDetail;
