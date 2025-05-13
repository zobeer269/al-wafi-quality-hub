import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import {
  fetchTrainingPlans,
  createTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  fetchTrainingItems,
  createTrainingItem,
  updateTrainingItem,
  deleteTrainingItem,
  createTrainingAssignment,
  fetchTrainingAssignments,
  updateTrainingAssignment
} from '@/services/trainingService';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import TrainingPlanForm from '@/components/training/TrainingPlanForm';
import TrainingPlanList from '@/components/training/TrainingPlanList';
import TrainingItemForm from '@/components/training/TrainingItemForm';
import TrainingItemList from '@/components/training/TrainingItemList';
import AssignTrainingForm from '@/components/training/AssignTrainingForm';
import TrainingAssignmentsList from '@/components/training/TrainingAssignmentsList';
import { TrainingPlan, TrainingItem, TrainingAssignment, TrainingAssignmentWithDetails } from '@/types/training';

const Training = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Dialog states
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // Selected items for editing
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [selectedItem, setSelectedItem] = useState<TrainingItem | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Queries
  const { 
    data: trainingPlans, 
    isLoading: isLoadingPlans 
  } = useQuery({
    queryKey: ['trainingPlans'],
    queryFn: fetchTrainingPlans
  });
  
  const { 
    data: trainingItems, 
    isLoading: isLoadingItems 
  } = useQuery({
    queryKey: ['trainingItems', selectedPlanId],
    queryFn: () => fetchTrainingItems(selectedPlanId || undefined),
    enabled: activeTab === 'items'
  });

  const { 
    data: trainingAssignments, 
    isLoading: isLoadingAssignments 
  } = useQuery({
    queryKey: ['trainingAssignments'],
    queryFn: () => fetchTrainingAssignments(),
    enabled: activeTab === 'assignments',
  });
  
  // Mutations
  const createPlanMutation = useMutation({
    mutationFn: createTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingPlans'] });
      setIsPlanDialogOpen(false);
    },
  });
  
  const updatePlanMutation = useMutation({
    mutationFn: (plan: { id: string, data: Partial<TrainingPlan> }) => 
      updateTrainingPlan(plan.id, plan.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingPlans'] });
      setIsPlanDialogOpen(false);
      setSelectedPlan(null);
    },
  });
  
  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => deleteTrainingPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingPlans'] });
    },
  });
  
  const createItemMutation = useMutation({
    mutationFn: createTrainingItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingItems', selectedPlanId] });
      setIsItemDialogOpen(false);
    },
  });
  
  const updateItemMutation = useMutation({
    mutationFn: (item: { id: string, data: Partial<TrainingItem> }) => 
      updateTrainingItem(item.id, item.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingItems', selectedPlanId] });
      setIsItemDialogOpen(false);
      setSelectedItem(null);
    },
  });
  
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => deleteTrainingItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingItems', selectedPlanId] });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: createTrainingAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['trainingStats'] });
      setIsAssignDialogOpen(false);
      setSelectedItem(null);
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: (assignment: { id: string, data: Partial<TrainingAssignment> }) => 
      updateTrainingAssignment(assignment.id, assignment.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['trainingStats'] });
    },
  });
  
  // Handlers
  const handleCreatePlan = (data: any) => {
    createPlanMutation.mutate(data);
  };
  
  const handleUpdatePlan = (data: any) => {
    if (selectedPlan) {
      updatePlanMutation.mutate({ id: selectedPlan.id, data });
    }
  };
  
  const handleEditPlan = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setIsPlanDialogOpen(true);
  };
  
  const handleDeletePlan = (plan: TrainingPlan) => {
    if (window.confirm(`Are you sure you want to delete the training plan "${plan.title}"?`)) {
      deletePlanMutation.mutate(plan.id);
    }
  };
  
  const handleViewTrainingItems = (planId: string) => {
    setSelectedPlanId(planId);
    setActiveTab('items');
  };
  
  const handleAddTrainingItem = (planId: string) => {
    setSelectedPlanId(planId);
    setIsItemDialogOpen(true);
  };
  
  const handleCreateItem = (data: any) => {
    createItemMutation.mutate(data);
  };
  
  const handleUpdateItem = (data: any) => {
    if (selectedItem) {
      updateItemMutation.mutate({ id: selectedItem.id, data });
    }
  };
  
  const handleEditItem = (item: TrainingItem) => {
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };
  
  const handleDeleteItem = (item: TrainingItem) => {
    if (window.confirm(`Are you sure you want to delete the training item "${item.title}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleAssignTraining = (item: TrainingItem) => {
    setSelectedItem(item);
    setIsAssignDialogOpen(true);
  };

  const handleCreateAssignment = (data: any) => {
    createAssignmentMutation.mutate(data);
  };

  const handleCompleteTraining = (assignment: TrainingAssignmentWithDetails) => {
    updateAssignmentMutation.mutate({
      id: assignment.id,
      data: {
        status: 'Completed',
        completed_date: new Date().toISOString(),
      }
    });
  };

  const handleMarkInProgress = (assignment: TrainingAssignmentWithDetails) => {
    updateAssignmentMutation.mutate({
      id: assignment.id,
      data: {
        status: 'In Progress'
      }
    });
  };
  
  return (
    <DashboardLayout>
      <PageHeader 
        title="Training Management" 
        description="Plan, assign, track, and evaluate employee training"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="plans">Training Plans</TabsTrigger>
            <TabsTrigger value="items">Training Items</TabsTrigger>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          </TabsList>
          
          {activeTab === 'plans' && (
            <Button onClick={() => setIsPlanDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" /> New Training Plan
            </Button>
          )}
        </div>
        
        <TabsContent value="dashboard" className="mt-4">
          <TrainingDashboard />
        </TabsContent>
        
        <TabsContent value="plans" className="mt-4">
          <TrainingPlanList 
            plans={trainingPlans || []}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
            onAddTrainingItem={handleAddTrainingItem}
            onViewTrainingItems={handleViewTrainingItems}
            isLoading={isLoadingPlans}
          />
        </TabsContent>
        
        <TabsContent value="items" className="mt-4">
          {selectedPlanId ? (
            <div>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">
                  Training Items {trainingPlans?.find(p => p.id === selectedPlanId)?.title ? 
                    `for ${trainingPlans?.find(p => p.id === selectedPlanId)?.title}` : ''}
                </h3>
                <Button onClick={() => handleAddTrainingItem(selectedPlanId)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Training Item
                </Button>
              </div>
              <TrainingItemList 
                items={trainingItems || []}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onAssign={handleAssignTraining}
                isLoading={isLoadingItems}
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Select a training plan to view its items</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-4">
          <TrainingAssignmentsList 
            assignments={trainingAssignments as TrainingAssignmentWithDetails[] || []}
            onComplete={handleCompleteTraining}
            onMarkInProgress={handleMarkInProgress}
            isLoading={isLoadingAssignments}
          />
        </TabsContent>
      </Tabs>
      
      {/* Training Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Update Training Plan' : 'Create Training Plan'}</DialogTitle>
          </DialogHeader>
          <TrainingPlanForm 
            onSubmit={selectedPlan ? handleUpdatePlan : handleCreatePlan}
            onCancel={() => {
              setIsPlanDialogOpen(false);
              setSelectedPlan(null);
            }}
            defaultValues={selectedPlan || undefined}
          />
        </DialogContent>
      </Dialog>
      
      {/* Training Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Update Training Item' : 'Create Training Item'}</DialogTitle>
          </DialogHeader>
          <TrainingItemForm 
            onSubmit={selectedItem ? handleUpdateItem : handleCreateItem}
            onCancel={() => {
              setIsItemDialogOpen(false);
              setSelectedItem(null);
            }}
            planId={selectedPlanId || undefined}
            defaultValues={selectedItem || undefined}
          />
        </DialogContent>
      </Dialog>
      
      {/* Assign Training Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Training</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <AssignTrainingForm 
              onSubmit={handleCreateAssignment}
              onCancel={() => {
                setIsAssignDialogOpen(false);
                setSelectedItem(null);
              }}
              trainingItem={selectedItem}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Training;
