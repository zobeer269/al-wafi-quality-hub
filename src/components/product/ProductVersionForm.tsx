
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOpenCAPAs } from '@/services/integrationService';
import { createProductVersion, updateProductVersion } from '@/services/productService';
import { ProductVersion } from '@/types/product';
import { CAPA } from '@/types/document';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  version: z.string().min(1, { message: "Version is required" }),
  changes_summary: z.string().optional(),
  linked_capa_id: z.string().optional(),
  linked_sop_id: z.string().optional(),
  effective_date: z.string().optional(),
});

export interface ProductVersionFormProps {
  productId: string;
  onClose: () => void;
  initialData?: ProductVersion;
  isEditing?: boolean;
  onSuccess: () => Promise<void>;
}

const ProductVersionForm: React.FC<ProductVersionFormProps> = ({
  productId,
  onClose,
  initialData,
  isEditing = false,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCAPAs, setAvailableCAPAs] = useState<CAPA[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: initialData?.version || "",
      changes_summary: initialData?.changes_summary || "",
      linked_capa_id: initialData?.linked_capa_id || "",
      linked_sop_id: initialData?.linked_sop_id || "",
      effective_date: initialData?.effective_date ? new Date(initialData.effective_date).toISOString().split('T')[0] : "",
    },
  });

  useEffect(() => {
    const fetchCAPAs = async () => {
      try {
        const capas = await getOpenCAPAs();
        setAvailableCAPAs(capas);
      } catch (error) {
        console.error("Error fetching CAPAs", error);
        toast({
          title: "Error",
          description: "Failed to load CAPAs. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchCAPAs();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const versionData = {
        version: values.version,
        changes_summary: values.changes_summary,
        linked_capa_id: values.linked_capa_id || null,
        linked_sop_id: values.linked_sop_id || null,
        effective_date: values.effective_date || null,
        product_id: productId,
      };

      if (isEditing && initialData) {
        await updateProductVersion(initialData.id, versionData);
        toast({
          title: "Success",
          description: "Product version updated successfully",
        });
      } else {
        await createProductVersion(versionData);
        toast({
          title: "Success",
          description: "Product version created successfully",
        });
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting product version", error);
      toast({
        title: "Error",
        description: "Failed to save product version. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCAPAOption = (capa: CAPA) => {
    const { number, title, status, priority } = capa;
    let priorityLabel = "Low";
    if (priority === 2) priorityLabel = "Medium";
    if (priority === 3) priorityLabel = "High";
    
    return `${number} - ${title} (${status}, ${priorityLabel})`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isEditing ? "Edit Product Version" : "Add New Product Version"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1.0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="changes_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Changes Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe changes in this version"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linked_capa_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked CAPA (if applicable)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a CAPA" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {availableCAPAs.map((capa) => (
                      <SelectItem key={capa.id} value={capa.id}>
                        {capa.number} - {capa.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linked_sop_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked SOP (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="SOP reference" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effective_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Version"
                : "Create Version"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductVersionForm;
