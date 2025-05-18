import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { CAPAType, CAPAStatus, CAPAPriority, priorityLabelMap } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { suggestCAPAPriority, generateSmartTags } from '@/utils/aiHelpers';
import { NonConformanceSeverity } from '@/types/nonConformance';

const formSchema = z.object({
  number: z.string().min(1, { message: "CAPA ID is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["Corrective", "Preventive", "Both"] as const),
  priority: z.enum(["1", "2", "3"] as const), // Form uses string values
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  linked_nc_id: z.string().optional(),
  linkedAuditFindingId: z.string().optional(), // Updated to match our interface
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ai_notes: z.string().optional(),
});

type CAPAFormValues = z.infer<typeof formSchema>;

interface CAPAFormProps {
  onSubmit: (values: CAPAFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CAPAFormValues>;
  isLoading?: boolean;
  linkedNC?: {
    severity?: NonConformanceSeverity;
    source?: string;
    description?: string;
  };
}

const CAPAForm: React.FC<CAPAFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues,
  isLoading = false,
  linkedNC
}) => {
  // Generate a default CAPA number if not provided
  const today = new Date();
  const defaultCAPANumber = defaultValues?.number || `CAPA-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
  
  // AI suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<{ priority: CAPAPriority; reason: string } | null>(null);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: defaultValues?.number || '',
      title: defaultValues?.title || '',
      type: (defaultValues?.type as CAPAType) || "Corrective",
      priority: (defaultValues?.priority?.toString() as "1" | "2" | "3") || "2",
      description: defaultValues?.description || '',
      assignedTo: defaultValues?.assignedTo || '',
      dueDate: defaultValues?.dueDate || '',
      linked_nc_id: defaultValues?.linked_nc_id || '',
      linkedAuditFindingId: defaultValues?.linkedAuditFindingId || '', // Updated to match our interface
      source: defaultValues?.source || linkedNC?.source || '',
      tags: defaultValues?.tags || [],
      ai_notes: defaultValues?.ai_notes || '',
    }
  });

  // Get AI suggestions when description or severity changes
  useEffect(() => {
    const description = form.watch('description');
    const source = linkedNC?.source || form.watch('source');
    
    if (description && description.length > 10) {
      // Get priority suggestion
      const suggestion = suggestCAPAPriority(
        source, 
        linkedNC?.severity, 
        description
      );
      setAiSuggestion(suggestion);
      
      // Set the suggested priority if it's different from current
      if (suggestion && suggestion.priority.toString() !== form.getValues('priority')) {
        form.setValue('priority', suggestion.priority.toString() as "1" | "2" | "3");
      }
      
      // Generate tags
      const tags = generateSmartTags(description, linkedNC?.severity, source);
      setGeneratedTags(tags);
      form.setValue('tags', tags);
      
      // Set AI notes
      form.setValue('ai_notes', `Priority suggestion: ${suggestion.reason}\nDetected themes: ${tags.join(', ')}`);
    }
  }, [form.watch('description'), linkedNC?.severity, linkedNC?.source]);

  const handleSubmit = (values: CAPAFormValues) => {
    onSubmit({
      ...values,
      priority: values.priority,
      tags: generatedTags,
    });
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                {aiSuggestion && (
                  <div className="text-xs text-muted-foreground mt-1">
                    AI suggests: {priorityLabelMap[aiSuggestion.priority]} – {aiSuggestion.reason}
                  </div>
                )}
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
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || (linkedNC?.source || "")}
                disabled={!!linkedNC?.source}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Regulatory">Regulatory</SelectItem>
                </SelectContent>
              </Select>
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
        
        {generatedTags.length > 0 && (
          <div>
            <label className="text-sm font-medium">AI-Generated Tags</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {generatedTags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {aiSuggestion && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Analysis</AlertTitle>
            <AlertDescription>
              {aiSuggestion.reason}
              {linkedNC?.severity && (
                <div className="mt-1">Based on {linkedNC.severity} severity from linked Non-Conformance</div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
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
        
        {/* Hidden fields for linked items and AI data */}
        <input type="hidden" {...form.register("linked_nc_id")} />
        <input type="hidden" {...form.register("linkedAuditFindingId")} /> {/* Updated to match our interface */}
        <input type="hidden" {...form.register("tags")} />
        <input type="hidden" {...form.register("ai_notes")} />
        
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
