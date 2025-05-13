
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TrainingItem, TrainingType } from '@/types/training';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  type: z.string().min(1, { message: 'Training type is required' }),
  document_id: z.string().optional(),
  required_by: z.string().optional(),
  frequency: z.string().min(1, { message: 'Frequency is required' }),
  evaluation_required: z.boolean().default(false),
  evaluation_type: z.string().optional(),
});

const trainingTypes = [
  'SOP', 'Policy', 'Work Instruction', 'External', 'On-the-job', 'Classroom'
] as const;

type TrainingItemFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  planId?: string;
  defaultValues?: Partial<TrainingItem>;
};

const TrainingItemForm = ({ 
  onSubmit, 
  onCancel, 
  planId,
  defaultValues 
}: TrainingItemFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'SOP',
      document_id: defaultValues?.document_id || '',
      required_by: defaultValues?.required_by 
        ? new Date(defaultValues.required_by).toISOString().split('T')[0]
        : '',
      frequency: defaultValues?.frequency || 'Annual',
      evaluation_required: defaultValues?.evaluation_required || false,
      evaluation_type: defaultValues?.evaluation_type || '',
    },
  });

  const watchEvaluationRequired = form.watch('evaluation_required');

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      plan_id: planId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Training Item Title" {...field} />
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
                <Textarea 
                  placeholder="Describe what this training covers" 
                  {...field}
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select training type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Annual, Biennial, One-time" {...field} />
                </FormControl>
                <FormDescription>How often this training must be repeated</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="document_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Document ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Document ID" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="required_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required By (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="evaluation_required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Evaluation Required</FormLabel>
                <FormDescription>
                  Does this training require an evaluation?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {watchEvaluationRequired && (
          <FormField
            control={form.control}
            name="evaluation_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Quiz, Practical Demonstration, Written Test" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {defaultValues ? 'Update' : 'Create'} Training Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TrainingItemForm;
