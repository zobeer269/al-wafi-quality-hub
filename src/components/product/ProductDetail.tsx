
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Plus, History, Download, AlertCircle, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { fetchProductById, fetchProductVersions } from '@/services/productService';
import { Product, ProductVersion } from '@/types/product';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ProductVersionForm from './ProductVersionForm';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productVersions, setProductVersions] = useState<ProductVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [editingVersion, setEditingVersion] = useState<ProductVersion | undefined>(undefined);

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        if (!productData) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          });
          navigate('/products');
          return;
        }
        
        setProduct(productData);
        
        const versions = await fetchProductVersions(id);
        setProductVersions(versions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
        console.error("Error loading product details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProductData();
  }, [id, navigate]);

  const handleVersionFormClose = () => {
    setShowVersionForm(false);
    setEditingVersion(undefined);
  };

  const handleEditVersion = (version: ProductVersion) => {
    setEditingVersion(version);
    setShowVersionForm(true);
  };

  const refreshProductVersions = async () => {
    if (!id) return;
    const versions = await fetchProductVersions(id);
    setProductVersions(versions);
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'In Development':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">In Development</Badge>;
      case 'Pending Approval':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pending Approval</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case 'Released':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">Released</Badge>;
      case 'Obsolete':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Obsolete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderVersionStatusBadge = (status: string) => {
    switch(status) {
      case 'Draft':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Draft</Badge>;
      case 'Under Review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Under Review</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case 'Released':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">Released</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <div className="mt-4 text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Product could not be found. It may have been deleted or you may not have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500">SKU: {product.sku}</span>
            {renderStatusBadge(product.status)}
          </div>
        </div>
        <Button onClick={() => { setShowVersionForm(true); setEditingVersion(undefined); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Version
        </Button>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={product.name} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={product.sku} readOnly className="bg-gray-50" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={product.category || 'N/A'} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" value={product.manufacturer || 'N/A'} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input id="regNumber" value={product.registration_number || 'N/A'} readOnly className="bg-gray-50" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <div id="description" className="mt-1 p-3 border rounded bg-gray-50 min-h-[100px]">
                  {product.description || 'No description provided.'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="created">Created Date</Label>
                  <div id="created" className="mt-1 text-gray-700">
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="updated">Last Updated</Label>
                  <div id="updated" className="mt-1 text-gray-700">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <div id="status" className="mt-1">
                    {renderStatusBadge(product.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Versions</CardTitle>
              <Button size="sm" onClick={() => { setShowVersionForm(true); setEditingVersion(undefined); }}>
                <Plus className="mr-1 h-4 w-4" />
                Add Version
              </Button>
            </CardHeader>
            <CardContent>
              {productVersions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productVersions.map((version) => (
                      <TableRow key={version.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{version.version}</TableCell>
                        <TableCell>{renderVersionStatusBadge(version.status)}</TableCell>
                        <TableCell>
                          {version.effective_date 
                            ? new Date(version.effective_date).toLocaleDateString() 
                            : 'Not set'}
                        </TableCell>
                        <TableCell>
                          {new Date(version.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEditVersion(version)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No versions available for this product
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                No documents linked to this product
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                Product history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Version Form Dialog */}
      <Dialog open={showVersionForm} onOpenChange={setShowVersionForm}>
        <DialogContent className="max-w-2xl">
          <ProductVersionForm 
            productId={id!}
            onClose={handleVersionFormClose}
            initialData={editingVersion}
            isEditing={!!editingVersion}
            onSuccess={refreshProductVersions}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
