
export type TrainingStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Waived';
export type TrainingType = 'SOP' | 'Policy' | 'Work Instruction' | 'External' | 'On-the-job' | 'Classroom';

export interface TrainingPlan {
  id: string;
  title: string;
  description?: string;
  jobRole: string;
  department: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  status: 'Active' | 'Draft' | 'Archived';
}

export interface TrainingItem {
  id: string;
  planId?: string;
  title: string;
  type: TrainingType;
  documentId?: string;
  requiredBy?: string;
  frequency: 'One-time' | 'Annual' | 'Biannual' | 'Quarterly' | 'Monthly';
  description?: string;
  evaluationRequired: boolean;
  evaluationType?: 'Quiz' | 'Practical' | 'Observation' | 'None';
}

export interface TrainingAssignment {
  id: string;
  userId: string;
  userName: string;
  trainingItemId: string;
  status: TrainingStatus;
  assignedDate: string;
  dueDate?: string;
  completedDate?: string;
  assignedBy: string;
  evaluationScore?: number;
  evaluatedBy?: string;
  comments?: string;
}
