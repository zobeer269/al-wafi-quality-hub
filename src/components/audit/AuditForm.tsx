
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAudit, updateAudit } from '@/services/auditService';
import { Audit, AuditType, AuditStatus } from '@/types/audit';
import { toast } from '@/components/ui/use-toast';

interface AuditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audit?: Audit;
  onSaved?: (audit: Audit) => void;
}

type AuditFormValues = {
  audit_number: string;
  title: string;
  audit_type: AuditType;
  scope: string;
  department?: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  auditor_names?: string;
  status: AuditStatus;
};

const AuditForm: React.FC<AuditFormProps> = ({ open, onOpenChange, audit, onSaved }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<AuditFormValues>({
    defaultValues: audit ? {
      audit_number: audit.audit_number,
      title: audit.title,
      audit_type: audit.audit_type,
      scope: audit.scope,
      department: audit.department,
      scheduled_start_date: audit.scheduled_start_date,
      scheduled_end_date: audit.scheduled_end_date,
      auditor_names: audit.auditor_names?.join(', '),
      status: audit.status,
    } : {
      audit_number: `A-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
      title: '',
      audit_type: 'Internal',
      scope: '',
      status: 'Scheduled',
    }
  });

  const handleStatusChange = (value: string) => {
    setValue('status', value as AuditStatus);
  };

  const handleTypeChange = (value: string) => {
    setValue('audit_type', value as AuditType);
  };

  const onSubmit = async (values: AuditFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Process auditor names from comma-separated string to array
      const auditorNames = values.auditor_names ? values.auditor_names.split(',').map(name => name.trim()) : [];
      
      const auditData = {
        ...values,
        auditor_names: auditorNames,
        created_by: 'current-user-id', // This should be replaced with actual authentication logic
      };
      
      let result: Audit | null;
      if (audit) {
        result = await updateAudit(audit.id, auditData);
      } else {
        result = await createAudit(auditData as Omit<Audit, "id" | "created_at" | "updated_at">);
      }
      
      if (result && onSaved) {
        onSaved(result);
        reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error submitting audit form:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{audit ? 'Edit Audit' : 'Schedule New Audit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditNumber" className="text-right">
              Audit ID
            </Label>
            <Input
              id="auditNumber"
              {...register('audit_number', { required: "Audit ID is required" })}
              className="col-span-3"
              disabled={!!audit} // Disable editing for existing audits
            />
            {errors.audit_number && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.audit_number.message}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              {...register('title', { required: "Title is required" })}
              placeholder="Audit title"
              className="col-span-3"
            />
            {errors.title && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.title.message}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditType" className="text-right">
              Type
            </Label>
            <Select defaultValue={audit?.audit_type || 'Internal'} onValueChange={handleTypeChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select audit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Regulatory">Regulatory</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scope" className="text-right">
              Scope
            </Label>
            <Textarea
              id="scope"
              {...register('scope', { required: "Scope is required" })}
              placeholder="Audit scope"
              className="col-span-3"
            />
            {errors.scope && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.scope.message}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              id="department"
              {...register('department')}
              placeholder="Department"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              {...register('scheduled_start_date')}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              {...register('scheduled_end_date')}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditorNames" className="text-right">
              Auditors
            </Label>
            <Input
              id="auditorNames"
              {...register('auditor_names')}
              placeholder="Enter auditor names, separated by commas"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select defaultValue={audit?.status || 'Scheduled'} onValueChange={handleStatusChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select audit status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : audit ? 'Update Audit' : 'Schedule Audit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuditForm;
