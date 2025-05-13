
import React, { useState } from 'react';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { TrainingItem } from '@/types/training';

const formSchema = z.object({
  user_name: z.string().min(3, { message: 'User name is required' }),
  due_date: z.string().optional(),
});

type AssignTrainingFormProps = {
  onSubmit: (data: {
    user_id: string;
    user_name: string;
    training_item_id: string;
    due_date?: string;
    assigned_by: string;
  }) => void;
  onCancel: () => void;
  trainingItem: TrainingItem;
};

const AssignTrainingForm = ({ onSubmit, onCancel, trainingItem }: AssignTrainingFormProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      due_date: trainingItem.required_by || '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    
    if (!currentUserId) {
      setError('You must be logged in to assign training');
      return;
    }
    
    // In a real application, we would have a user selection dropdown
    // For now, we're assigning to the current user for demonstration purposes
    onSubmit({
      user_id: currentUserId,
      user_name: data.user_name,
      training_item_id: trainingItem.id,
      due_date: data.due_date,
      assigned_by: currentUserId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="mb-4">
          <h3 className="font-medium">Assigning Training:</h3>
          <p className="text-muted-foreground">{trainingItem.title}</p>
        </div>
        
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm mb-4">
            {error}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input placeholder="Full name of assignee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Assign Training
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignTrainingForm;
