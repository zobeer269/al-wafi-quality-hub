
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { NonConformance, NonConformanceSeverity, NonConformanceStatus } from '@/types/nonConformance';
import { createNonConformance, updateNonConformance, getNCSources } from '@/services/nonConformanceService';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface NCFormProps {
  initialData?: NonConformance;
  isEditing?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  severity: z.string().min(1, 'Severity is required'),
  source: z.string().optional(),
  linked_batch: z.string().optional(),
  linked_supplier_id: z.string().optional(),
  linked_capa_id: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
  root_cause: z.string().optional(),
  immediate_action: z.string().optional(),
  final_action: z.string().optional(),
});

const NCForm: React.FC<NCFormProps> = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  
  // Initialize form with default values or initial data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      due_date: initialData.due_date ? new Date(initialData.due_date) : undefined,
    } : {
      title: '',
      description: '',
      severity: 'Minor' as NonConformanceSeverity,
      status: 'Open' as NonConformanceStatus,
      source: '',
      linked_batch: '',
      linked_supplier_id: '',
      linked_capa_id: '',
      assigned_to: '',
      root_cause: '',
      immediate_action: '',
      final_action: '',
    },
  });

  useEffect(() => {
    const loadSources = async () => {
      const sourceData = await getNCSources();
      setSources(sourceData);
    };
    
    loadSources();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (!data.title || !data.description || !data.severity) {
        toast({
          title: "Validation Error",
          description: "Title, description and severity are required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Transform data for API
      const ncData = {
        ...data,
        title: data.title,
        description: data.description,
        severity: data.severity,
        due_date: data.due_date ? data.due_date.toISOString() : undefined,
        // For now, we're using a mock user ID
        reported_by: initialData?.reported_by || "00000000-0000-0000-0000-000000000000",
      };
      
      let result;
      
      if (isEditing && initialData?.id) {
        // Update existing NC
        result = await updateNonConformance(initialData.id, ncData as Partial<NonConformance>);
      } else {
        // Create new NC
        result = await createNonConformance({
          title: ncData.title,
          description: ncData.description,
          severity: ncData.severity,
          source: ncData.source,
          linked_batch: ncData.linked_batch,
          linked_supplier_id: ncData.linked_supplier_id,
          linked_capa_id: ncData.linked_capa_id,
          immediate_action: ncData.immediate_action,
          reported_by: ncData.reported_by,
          assigned_to: ncData.assigned_to,
          due_date: ncData.due_date,
        });
      }
      
      if (result) {
        toast({
          title: "Success",
          description: isEditing 
            ? `Non-conformance ${result.nc_number} updated successfully` 
            : `New non-conformance ${result.nc_number} created`,
        });
        navigate('/nonconformance');
      } else {
        toast({
          title: "Error",
          description: "Failed to save non-conformance",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting non-conformance:', error);
      toast({
        title: "Error",
        description: `An error occurred: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter non-conformance title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or enter source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Manufacturing', 'Supplier', 'QA Inspection', 'Customer Complaint', 'Other'].concat(sources).filter((v, i, a) => a.indexOf(v) === i).map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Where was this non-conformance identified?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
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
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Investigation">Investigation</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="linked_batch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter affected batch number (if applicable)" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
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
                  When should this non-conformance be addressed by?
                </FormDescription>
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
                  placeholder="Describe the non-conformance in detail..."
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <>
            <FormField
              control={form.control}
              name="root_cause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Root Cause</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the root cause of the non-conformance..." 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="immediate_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immediate/Containment Action</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any immediate actions taken..." 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="final_action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Corrective Action</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the final corrective action..." 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/nonconformance')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NCForm;
