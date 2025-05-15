import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { CAPAType, CAPAStatus } from '@/types/document';

const formSchema = z.object({
  number: z.string().min(1, { message: "CAPA ID is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["Corrective", "Preventive", "Both"] as const),
  priority: z.enum(["1", "2", "3"] as const),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  linked_nc_id: z.string().optional(),
  linked_audit_finding_id: z.string().optional(),
});

type CAPAFormValues = z.infer<typeof formSchema>;

interface CAPAFormProps {
  onSubmit: (values: CAPAFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CAPAFormValues>;
  isLoading?: boolean;
}

const CAPAForm: React.FC<CAPAFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues,
  isLoading = false
}) => {
  // Generate a default CAPA number if not provided
  const today = new Date();
  const defaultCAPANumber = defaultValues?.number || `CAPA-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

  const form = useForm<CAPAFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: defaultCAPANumber,
      title: defaultValues?.title || "",
      type: (defaultValues?.type as CAPAType) || "Corrective",
      priority: (defaultValues?.priority as "1" | "2" | "3") || "2",
      description: defaultValues?.description || "",
      assignedTo: defaultValues?.assignedTo || "",
      dueDate: defaultValues?.dueDate || "",
      linked_nc_id: defaultValues?.linked_nc_id || "",
      linked_audit_finding_id: defaultValues?.linked_audit_finding_id || "",
    }
  });

  const handleSubmit = (values: CAPAFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAPA ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Low</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the issue or opportunity for improvement..."
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter user name or ID" />
              </FormControl>
              <FormDescription>
                Enter the name of the person responsible for this CAPA
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Hidden fields for linked items */}
        <input type="hidden" {...form.register("linked_nc_id")} />
        <input type="hidden" {...form.register("linked_audit_finding_id")} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create CAPA'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CAPAForm;
