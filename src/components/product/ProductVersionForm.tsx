
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductVersion } from "@/types/product";
import { createProductVersion, updateProductVersion } from "@/services/productService";
import { fetchDocuments } from "@/services/documentService";
import { fetchCAPAs } from "@/services/capaService";
import { CAPA } from "@/types/document";
import { Document } from "@/types/document";

const productVersionSchema = z.object({
  version: z.string().min(1, "Version is required"),
  changes_summary: z.string().optional(),
  status: z.enum(["Draft", "Active", "Retired"]),
  linked_sop_id: z.string().optional(),
  linked_capa_id: z.string().optional(),
  effective_date: z.date().optional(),
});

type ProductVersionFormValues = z.infer<typeof productVersionSchema>;

interface ProductVersionFormProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProductVersion;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const ProductVersionForm: React.FC<ProductVersionFormProps> = ({
  productId,
  isOpen,
  onClose,
  initialData,
  isEditing = false,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [capas, setCapas] = useState<CAPA[]>([]);

  useEffect(() => {
    const loadReferences = async () => {
      // Load SOPs (filtered for documents of type SOP)
      const docsData = await fetchDocuments();
      setDocuments(docsData);
      
      // Load CAPAs
      const capasData = await fetchCAPAs();
      setCapas(capasData);
    };
    
    if (isOpen) {
      loadReferences();
    }
  }, [isOpen]);

  const form = useForm<ProductVersionFormValues>({
    resolver: zodResolver(productVersionSchema),
    defaultValues: {
      version: initialData?.version || "",
      changes_summary: initialData?.changes_summary || "",
      status: initialData?.status || "Draft",
      linked_sop_id: initialData?.linked_sop_id || undefined,
      linked_capa_id: initialData?.linked_capa_id || undefined,
      effective_date: initialData?.effective_date ? new Date(initialData.effective_date) : undefined,
    },
  });

  const onSubmit = async (values: ProductVersionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const versionData = {
        ...values,
        product_id: productId,
        effective_date: values.effective_date ? values.effective_date.toISOString() : undefined,
        status: values.status,
      };
      
      if (isEditing && initialData) {
        await updateProductVersion(initialData.id, versionData as ProductVersion);
      } else {
        await createProductVersion(versionData as ProductVersion);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error submitting product version:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Version" : "Add New Version"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1.0.0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Version number or identifier
                  </FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === "Active" && "Only one version can be active at a time"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="effective_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Effective Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this version becomes effective
                  </FormDescription>
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
                      placeholder="Describe the changes in this version"
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
              name="linked_sop_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked SOP</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a related SOP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.number} - {doc.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Link to a controlled document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linked_capa_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linked CAPA</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a related CAPA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {capas.map((capa) => (
                        <SelectItem key={capa.id} value={capa.id}>
                          {capa.number} - {capa.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Link to a CAPA if this change was caused by a deviation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update Version" : "Create Version"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductVersionForm;
