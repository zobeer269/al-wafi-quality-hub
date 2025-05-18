import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CAPA } from '@/types/document';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define the form schema
const formSchema = z.object({
  version: z.string().min(1, {
    message: "Version is required",
  }),
  effective_date: z.date({
    required_error: "Effective date is required",
  }),
  changes_summary: z.string().optional(),
  linked_capa_id: z.string().optional(),
  linked_sop_id: z.string().optional(),
});

// Define the form values type
type ProductVersionFormValues = z.infer<typeof formSchema>;

interface Document {
  id: string;
  number: string;
  title: string;
  type: string;
  status: string;
}

interface ProductVersionFormProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductVersionForm: React.FC<ProductVersionFormProps> = ({
  productId,
  onSuccess,
  onCancel
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [capas, setCAPAs] = useState<CAPA[]>([]);
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProductVersionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "",
      effective_date: new Date(),
      changes_summary: "",
      linked_capa_id: "",
      linked_sop_id: "",
    },
  });

  useEffect(() => {
    fetchRelatedCAPAs();
    fetchRelatedDocuments();
  }, []);

  const handleSubmit = async (values: ProductVersionFormValues) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_versions')
        .insert([
          {
            product_id: productId,
            version: values.version,
            effective_date: values.effective_date.toISOString(),
            changes_summary: values.changes_summary,
            linked_capa_id: values.linked_capa_id,
            linked_sop_id: values.linked_sop_id,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating product version:", error);
        toast({
          title: "Error",
          description: "Failed to create product version",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product version created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRelatedCAPAs = async () => {
    try {
      const { data, error } = await supabase
        .from('capas')
        .select('*')
        .eq('status', 'Closed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data.map(item => ({
        id: item.id,
        number: item.number,
        title: item.title,
        description: item.description,
        type: item.capa_type,
        priority: item.priority,
        status: item.status,
        createdDate: item.created_at,
        dueDate: item.due_date,
        assignedTo: item.assigned_to,
        root_cause: item.root_cause,
        action_plan: item.action_plan,
        created_by: item.created_by,
        closed_date: item.closed_date
      }));
      
      setCAPAs(formattedData);
    } catch (error) {
      console.error('Error fetching CAPAs:', error);
      toast({
        title: "Error",
        description: "Failed to load CAPAs",
        variant: "destructive",
      });
    }
  };
  
  const fetchRelatedDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, number, title, document_type, status')
        .eq('document_type', 'SOP')
        .eq('status', 'Approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDocuments(data.map(doc => ({
        id: doc.id,
        number: doc.number,
        title: doc.title,
        type: doc.document_type,
        status: doc.status
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load SOPs",
        variant: "destructive",
      });
    }
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0" {...field} />
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
                                "w-[240px] pl-3 text-left font-normal",
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                          placeholder="Summarize the changes in this version"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly describe the changes made in this version.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="links">
                <FormField
                  control={form.control}
                  name="linked_capa_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linked CAPA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a CAPA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {capas.map((capa) => (
                            <SelectItem key={capa.id} value={capa.id}>
                              {capa.number} - {capa.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link to a Corrective Action (CAPA) if applicable.
                      </FormDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a SOP" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documents.map((document) => (
                            <SelectItem key={document.id} value={document.id}>
                              {document.number} - {document.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link to a Standard Operating Procedure (SOP) if applicable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Version"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductVersionForm;
