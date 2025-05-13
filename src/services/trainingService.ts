import { supabase } from "@/integrations/supabase/client";
import { TrainingPlan, TrainingItem, TrainingAssignment, TrainingStatus } from "@/types/training";
import { toast } from "@/components/ui/use-toast";

// Training Plans
export const fetchTrainingPlans = async () => {
  const { data, error } = await supabase
    .from('training_plans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching training plans:", error);
    throw error;
  }
  
  return data as TrainingPlan[];
};

export const createTrainingPlan = async (plan: Omit<TrainingPlan, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('training_plans')
    .insert(plan)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating training plan:", error);
    toast({
      title: "Error",
      description: "Failed to create training plan",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training plan created successfully",
  });
  
  return data as TrainingPlan;
};

export const updateTrainingPlan = async (id: string, plan: Partial<TrainingPlan>) => {
  const { data, error } = await supabase
    .from('training_plans')
    .update(plan)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating training plan:", error);
    toast({
      title: "Error",
      description: "Failed to update training plan",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training plan updated successfully",
  });
  
  return data as TrainingPlan;
};

export const deleteTrainingPlan = async (id: string) => {
  const { error } = await supabase
    .from('training_plans')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting training plan:", error);
    toast({
      title: "Error",
      description: "Failed to delete training plan",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training plan deleted successfully",
  });
};

// Training Items
export const fetchTrainingItems = async (planId?: string) => {
  let query = supabase.from('training_items').select('*');
  
  if (planId) {
    query = query.eq('plan_id', planId);
  }
  
  const { data, error } = await query.order('title');
  
  if (error) {
    console.error("Error fetching training items:", error);
    throw error;
  }
  
  return data as TrainingItem[];
};

export const createTrainingItem = async (item: Omit<TrainingItem, 'id'>) => {
  const { data, error } = await supabase
    .from('training_items')
    .insert(item)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating training item:", error);
    toast({
      title: "Error",
      description: "Failed to create training item",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training item created successfully",
  });
  
  return data as TrainingItem;
};

export const updateTrainingItem = async (id: string, item: Partial<TrainingItem>) => {
  const { data, error } = await supabase
    .from('training_items')
    .update(item)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating training item:", error);
    toast({
      title: "Error",
      description: "Failed to update training item",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training item updated successfully",
  });
  
  return data as TrainingItem;
};

export const deleteTrainingItem = async (id: string) => {
  const { error } = await supabase
    .from('training_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting training item:", error);
    toast({
      title: "Error",
      description: "Failed to delete training item",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training item deleted successfully",
  });
};

// Training Assignments
export const fetchTrainingAssignments = async (options?: {
  userId?: string;
  trainingItemId?: string;
  status?: TrainingStatus;
}) => {
  let query = supabase
    .from('training_assignments')
    .select(`
      *,
      training_items(*)
    `);
  
  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }
  
  if (options?.trainingItemId) {
    query = query.eq('training_item_id', options.trainingItemId);
  }
  
  if (options?.status) {
    query = query.eq('status', options.status);
  }
  
  const { data, error } = await query.order('assigned_date', { ascending: false });
  
  if (error) {
    console.error("Error fetching training assignments:", error);
    throw error;
  }

  // Transform the response to match our expected structure
  return data.map(item => ({
    ...item,
    training_item: item.training_items
  }));
};

export const createTrainingAssignment = async (assignment: Omit<TrainingAssignment, 'id'>) => {
  const { data, error } = await supabase
    .from('training_assignments')
    .insert(assignment)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating training assignment:", error);
    toast({
      title: "Error",
      description: "Failed to create training assignment",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training assignment created successfully",
  });
  
  return data as TrainingAssignment;
};

export const updateTrainingAssignment = async (id: string, assignment: Partial<TrainingAssignment>) => {
  const { data, error } = await supabase
    .from('training_assignments')
    .update(assignment)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating training assignment:", error);
    toast({
      title: "Error",
      description: "Failed to update training assignment",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training assignment updated successfully",
  });
  
  return data as TrainingAssignment;
};

export const deleteTrainingAssignment = async (id: string) => {
  const { error } = await supabase
    .from('training_assignments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting training assignment:", error);
    toast({
      title: "Error",
      description: "Failed to delete training assignment",
      variant: "destructive",
    });
    throw error;
  }
  
  toast({
    title: "Success",
    description: "Training assignment deleted successfully",
  });
};

// Dashboard stats
export const getTrainingStats = async () => {
  const { data: pending, error: pendingError } = await supabase
    .from('training_assignments')
    .select('count', { count: 'exact' })
    .eq('status', 'Pending');
  
  const { data: inProgress, error: inProgressError } = await supabase
    .from('training_assignments')
    .select('count', { count: 'exact' })
    .eq('status', 'In Progress');
  
  const { data: completed, error: completedError } = await supabase
    .from('training_assignments')
    .select('count', { count: 'exact' })
    .eq('status', 'Completed');
  
  const { data: overdue, error: overdueError } = await supabase
    .from('training_assignments')
    .select('count', { count: 'exact' })
    .eq('status', 'Overdue');
  
  if (pendingError || inProgressError || completedError || overdueError) {
    console.error("Error fetching training stats");
    throw new Error("Failed to fetch training stats");
  }
  
  return {
    pending: pending?.[0]?.count || 0,
    inProgress: inProgress?.[0]?.count || 0,
    completed: completed?.[0]?.count || 0,
    overdue: overdue?.[0]?.count || 0
  };
};
