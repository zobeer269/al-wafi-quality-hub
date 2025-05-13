
import { Database } from "@/integrations/supabase/types";

export type TrainingPlan = {
  id: string;
  title: string;
  description?: string;
  job_role: string;
  department: string;
  status: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type TrainingType = Database["public"]["Enums"]["training_type"];
export type TrainingStatus = Database["public"]["Enums"]["training_status"];

export type TrainingItem = {
  id: string;
  plan_id?: string;
  title: string;
  description?: string;
  type: TrainingType;
  document_id?: string;
  required_by?: string;
  frequency: string;
  evaluation_required: boolean;
  evaluation_type?: string;
};

export type TrainingAssignment = {
  id: string;
  user_id: string;
  user_name: string;
  training_item_id: string;
  assigned_date: string;
  due_date?: string;
  completed_date?: string;
  status: TrainingStatus;
  assigned_by: string;
  evaluation_score?: number;
  evaluated_by?: string;
  comments?: string;
};

export type TrainingAssignmentWithDetails = TrainingAssignment & {
  training_item?: TrainingItem;
};
