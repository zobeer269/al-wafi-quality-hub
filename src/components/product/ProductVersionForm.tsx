
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { ProductVersion } from '@/types/product';

// Define the form schema
const formSchema = z.object({
  version: z.string().min(1, { message: "Version number is required" }),
  changes_summary: z.string().optional(),
  linked_capa_id: z.string().optional(),
  linked_sop_id: z.string().optional(),
  effective_date: z.date().optional(),
});

type ProductVersionFormValues = z.infer<typeof formSchema>;


interface ProductVersionFormProps {
  productId: string;
  onSubmit: (values: Partial<ProductVersion>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<ProductVersion>;
  onClose?: () => void; // لحل خطأ props
  isEditing?: boolean;
  onSuccess?: () => Promise<void>; // لحل خطأ onSuccess
}



const ProductVersionForm: React.FC<ProductVersionFormProps> = ({
  onSubmit,
  onCancel,
  productId,
  initialData,
  isLoading = false,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    initialData?.effective_date ? new Date(initialData.effective_date) : undefined
  );

  const form = useForm<ProductVersionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: initialData?.version || '',
      changes_summary: initialData?.changes_summary || '',
      linked_capa_id: initialData?.linked_capa_id || '',
      linked_sop_id: initialData?.linked_sop_id || '',
      effective_date: initialData?.effective_date ? new Date(initialData.effective_date) : undefined,
    },
  });

  const handleSubmit = (values: ProductVersionFormValues) => {
    const submissionValues: Partial<ProductVersion> = {
      ...values,
      product_id: productId,
      effective_date: values.effective_date ? values.effective_date.toISOString() : null,
      status: initialData?.status || 'Draft',
      created_by: initialData?.created_by || 'system',
    };
    
    if (initialData?.id) {
      submissionValues.id = initialData.id;
    }
    
    onSubmit(submissionValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version Number</FormLabel>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="linked_capa_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked CAPA ID</FormLabel>
                <FormControl>
                  <Input placeholder="CAPA reference" {...field} />
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
                <FormLabel>Linked SOP ID</FormLabel>
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
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData?.id ? "Update Version" : "Create Version"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductVersionForm;
