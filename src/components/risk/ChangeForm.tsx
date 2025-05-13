
import React, { useEffect } from 'react';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Change, Risk, getRiskLevel, getRiskLevelColor } from '@/types/risk';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { fetchRisks } from '@/services/riskService';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  change_title: z.string().min(2, { message: 'Title is required' }),
  change_reason: z.string().optional(),
  linked_area: z.string().optional(),
  risk_id: z.string().optional(),
  implementation_plan: z.string().optional(),
  implementation_date: z.date().optional(),
  status: z.enum(['Pending', 'Under Review', 'Approved', 'Rejected', 'Implemented']).default('Pending'),
  approval_notes: z.string().optional(),
});

const changeAreas = [
  'SOP',
  'Product',
  'Equipment',
  'Process',
  'Facility',
  'Material',
  'Supplier',
  'Computer System',
  'Other'
];

type ChangeFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<Change>;
  linkedRisk?: Risk;
  isLoading?: boolean;
  isEdit?: boolean;
  isApprovalMode?: boolean;
};

const ChangeForm = ({ 
  onSubmit, 
  defaultValues, 
  linkedRisk, 
  isLoading,
  isEdit = false, 
  isApprovalMode = false 
}: ChangeFormProps) => {
  const { data: risks, isLoading: isLoadingRisks } = useQuery({
    queryKey: ['risks'],
    queryFn: () => fetchRisks(),
    enabled: !linkedRisk && !isEdit // Only fetch risks if not editing and no linked risk provided
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      change_title: defaultValues?.change_title || '',
      change_reason: defaultValues?.change_reason || '',
      linked_area: defaultValues?.linked_area || '',
      risk_id: defaultValues?.risk_id || linkedRisk?.id || '',
      implementation_plan: defaultValues?.implementation_plan || '',
      implementation_date: defaultValues?.implementation_date ? new Date(defaultValues.implementation_date) : undefined,
      status: defaultValues?.status || 'Pending',
      approval_notes: defaultValues?.approval_notes || '',
    },
  });

  // Watch for risk_id changes to fetch risk data
  const selectedRiskId = form.watch('risk_id');
  const [selectedRisk, setSelectedRisk] = React.useState<Risk | undefined>(linkedRisk);

  useEffect(() => {
    if (risks && selectedRiskId && !selectedRisk) {
      const risk = risks.find(r => r.id === selectedRiskId);
      setSelectedRisk(risk);
    }
  }, [risks, selectedRiskId, selectedRisk]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isApprovalMode ? 'Review Change Request' : (isEdit ? 'Edit Change Request' : 'New Change Request')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="change_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter change request title" 
                      {...field} 
                      disabled={isApprovalMode} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="change_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why this change is needed" 
                      {...field} 
                      disabled={isApprovalMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linked_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Affected</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isApprovalMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area affected by change" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {changeAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!linkedRisk && !isEdit && (
              <FormField
                control={form.control}
                name="risk_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Risk (Optional)</FormLabel>
                    {isLoadingRisks ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isApprovalMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Link to an existing risk" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {risks?.map(risk => (
                            <SelectItem key={risk.id} value={risk.id}>
                              {risk.title} (Score: {risk.risk_score})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedRisk && (
              <div className="p-4 border rounded-md bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Linked Risk</h4>
                <div className="text-sm mb-1"><span className="font-medium">Title:</span> {selectedRisk.title}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm"><span className="font-medium">Score:</span> {selectedRisk.risk_score}</div>
                  <Badge className={getRiskLevelColor(getRiskLevel(selectedRisk.risk_score))}>
                    {getRiskLevel(selectedRisk.risk_score)}
                  </Badge>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="implementation_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implementation Plan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how this change will be implemented" 
                      {...field}
                      disabled={isApprovalMode} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="implementation_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Planned Implementation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild disabled={isApprovalMode}>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isApprovalMode}
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isApprovalMode && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Approved">Approve</SelectItem>
                        <SelectItem value="Rejected">Reject</SelectItem>
                        <SelectItem value="Under Review">Need More Information</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isApprovalMode && (
              <FormField
                control={form.control}
                name="approval_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approval Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide feedback or notes on your decision" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (
                isApprovalMode ? 'Submit Decision' : (isEdit ? 'Update Change' : 'Submit Change Request')
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChangeForm;
