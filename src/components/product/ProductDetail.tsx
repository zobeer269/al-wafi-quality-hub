import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Save, Trash2 } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Product } from '@/types/product';
import {
  fetchProductById,
  updateProduct,
  createProductVersion,
  getProductVersions,
  updateProductVersion,
  deleteProductVersion,
} from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

const formSchema = z.object({
  version: z.string().min(1, { message: "Version is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  release_date: z.string().optional(),
  status: z.string().optional(),
  features: z.string().optional(),
  technical_notes: z.string().optional(),
  testing_results: z.string().optional(),
  regulatory_compliance: z.string().optional(),
  customer_feedback: z.string().optional(),
  documentation_link: z.string().optional(),
  support_contact: z.string().optional(),
  known_issues: z.string().optional(),
  related_products: z.string().optional(),
  future_enhancements: z.string().optional(),
});

interface ProductVersionFormProps {
  productId: string;
  onSubmit: (values: ProductVersionFormValues) => void;
  onCancel: () => void;
  initialData?: ProductVersion;
  isEditing: boolean;
}

type ProductVersionFormValues = z.infer<typeof formSchema>;

interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  description: string;
  release_date?: string | null;
  status?: string | null;
  features?: string | null;
  technical_notes?: string | null;
  testing_results?: string | null;
  regulatory_compliance?: string | null;
  customer_feedback?: string | null;
  documentation_link?: string | null;
  support_contact?: string | null;
  known_issues?: string | null;
  related_products?: string | null;
  future_enhancements?: string | null;
  created_at: string;
  updated_at: string;
}

const ProductVersionForm: React.FC<ProductVersionFormProps> = ({ productId, onSubmit, onCancel, initialData, isEditing }) => {
  const form = useForm<ProductVersionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: initialData?.version || "",
      description: initialData?.description || "",
      release_date: initialData?.release_date || "",
      status: initialData?.status || "",
      features: initialData?.features || "",
      technical_notes: initialData?.technical_notes || "",
      testing_results: initialData?.testing_results || "",
      regulatory_compliance: initialData?.regulatory_compliance || "",
      customer_feedback: initialData?.customer_feedback || "",
      documentation_link: initialData?.documentation_link || "",
      support_contact: initialData?.support_contact || "",
      known_issues: initialData?.known_issues || "",
      related_products: initialData?.related_products || "",
      future_enhancements: initialData?.future_enhancements || "",
    },
  });

  const handleSubmit = async (values: ProductVersionFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="1.0.0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this version" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="release_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Alpha, Beta, Production" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <Textarea placeholder="List of features" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technical_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Technical details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="testing_results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testing Results</FormLabel>
              <FormControl>
                <Textarea placeholder="Testing outcomes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="regulatory_compliance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regulatory Compliance</FormLabel>
              <FormControl>
                <Textarea placeholder="Compliance details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Feedback</FormLabel>
              <FormControl>
                <Textarea placeholder="Feedback summary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentation_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentation Link</FormLabel>
              <FormControl>
                <Input placeholder="Link to documentation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="support_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Contact</FormLabel>
              <FormControl>
                <Input placeholder="Support email/phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="known_issues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Known Issues</FormLabel>
              <FormControl>
                <Textarea placeholder="List of known issues" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="related_products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Products</FormLabel>
              <FormControl>
                <Textarea placeholder="Related product IDs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="future_enhancements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Future Enhancements</FormLabel>
              <FormControl>
                <Textarea placeholder="Planned enhancements" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEditing ? "Update Version" : "Add Version"}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  );
};

const EditVersionModal: React.FC<{ 
  productId: string; 
  onClose: () => void; 
  initialData: ProductVersion;
  isEditing: boolean;
  onSuccess: () => Promise<void>;
}> = ({ productId, onClose, initialData, isEditing, onSuccess }) => {

  const handleSubmit = async (data: ProductVersionFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateProductVersion(initialData.id, data);
        toast({
          title: "Success",
          description: "Product version updated successfully",
        });
      } else {
        await createProductVersion({
          product_id: productId,
          ...data
        });
        toast({
          title: "Success",
          description: "Product version created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product version",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProductVersionForm
        productId={productId}
        initialData={initialData}
        isEditing={isEditing}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(initialProduct.name);
  const [description, setDescription] = useState(initialProduct.description);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [isAddingVersion, setIsAddingVersion] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);
  const [versionToEdit, setVersionToEdit] = useState<ProductVersion | null>(null);

  useEffect(() => {
    const loadVersions = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const versionsData = await getProductVersions(id);
        setVersions(versionsData);
      } catch (error) {
        console.error("Failed to fetch product versions:", error);
        toast({
          title: "Error",
          description: "Failed to load product versions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [id]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setName(product.name);
    setDescription(product.description);
  };

  const handleSaveClick = async () => {
    if (!id) return;

    try {
      await updateProduct(id, { name, description });
      setProduct({ ...product, name, description });
      setIsEditMode(false);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleAddVersionClick = () => {
    setIsAddingVersion(true);
  };

  const handleCloseVersionModal = () => {
    setIsAddingVersion(false);
    setVersionToEdit(null);
  };

  const handleVersionAdded = async () => {
    if (!id) return;
    try {
      const versionsData = await getProductVersions(id);
      setVersions(versionsData);
    } catch (error) {
      console.error("Failed to reload product versions:", error);
      toast({
        title: "Error",
        description: "Failed to reload product versions",
        variant: "destructive",
      });
    }
  };

  const handleEditVersion = async (versionId: string) => {
    try {
      // Find the version in the current versions array
      const versionData = versions.find(v => v.id === versionId);
      if (versionData) {
        setVersionToEdit(versionData);
        setIsAddingVersion(true);
      } else {
        toast({
          title: "Error",
          description: "Version not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch version for editing:", error);
      toast({
        title: "Error",
        description: "Failed to fetch version details",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    setVersionToDelete(versionId);
  };

  const confirmDeleteVersion = async () => {
    if (versionToDelete) {
      try {
        await deleteProductVersion(versionToDelete);
        setVersions(versions.filter(version => version.id !== versionToDelete));
        setVersionToDelete(null);
        toast({
          title: "Success",
          description: "Product version deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting product version:", error);
        toast({
          title: "Error",
          description: "Failed to delete product version",
          variant: "destructive",
        });
      }
    }
  };

  const cancelDeleteVersion = () => {
    setVersionToDelete(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="Product Details" description="Loading product details..." />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <PageHeader title="Product Details" description="Product not found" />
        <Card>
          <CardContent className="p-6">
            Product not found.
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
              />
            ) : (
              product.name
            )}
          </CardTitle>
          <CardDescription>
            {isEditMode ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product Description"
              />
            ) : (
              product.description
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          {isEditMode ? (
            <>
              <Button variant="secondary" onClick={handleCancelEdit} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSaveClick}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <Button onClick={handleEditClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Versions</CardTitle>
          <Button size="sm" onClick={handleAddVersionClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Version
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : versions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {versions.map((version) => (
                <Card key={version.id}>
                  <CardHeader>
                    <CardTitle>{version.version}</CardTitle>
                    <CardDescription>{version.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {version.status && <p className="text-sm">Status: {version.status}</p>}
                    {version.release_date && <p className="text-sm">Release: {new Date(version.release_date).toLocaleDateString()}</p>}
                  </CardContent>
                  <CardContent className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditVersion(version.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteVersion(version.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No versions available.</p>
          )}
        </CardContent>
      </Card>

      {isAddingVersion && (
        <Dialog open={isAddingVersion} onOpenChange={setIsAddingVersion}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{versionToEdit ? "Edit Version" : "Add Version"}</DialogTitle>
              <DialogDescription>
                {versionToEdit ? "Edit the details for this product version." : "Create a new version for this product."}
              </DialogDescription>
            </DialogHeader>
            <EditVersionModal
              productId={id || ''}
              onClose={handleCloseVersionModal}
              initialData={versionToEdit || {
                id: "",
                product_id: id || "",
                version: "",
                description: "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
              isEditing={!!versionToEdit}
              onSuccess={handleVersionAdded}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={versionToDelete !== null} onOpenChange={(open) => {
        if (!open) cancelDeleteVersion();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this version? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDeleteVersion}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteVersion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDetail;
