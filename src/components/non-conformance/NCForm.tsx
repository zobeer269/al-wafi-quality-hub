
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Link as LinkIcon, AlertCircle } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { getOpenAuditFindings, getOpenCAPAs, createCAPAFromNC, AuditFinding, CAPA } from '@/services/integrationService';

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
  linked_audit_finding_id: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
  root_cause: z.string().optional(),
  immediate_action: z.string().optional(),
  final_action: z.string().optional(),
  capa_required: z.boolean().optional(),
});

const NCForm: React.FC<NCFormProps> = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [openCAPAs, setOpenCAPAs] = useState<CAPA[]>([]);
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const [createCAPADialogOpen, setCreateCAPADialogOpen] = useState(false);
  
  // Initialize form with default values or initial data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      due_date: initialData.due_date ? new Date(initialData.due_date) : undefined,
      capa_required: initialData.capa_required || false,
    } : {
      title: '',
      description: '',
      severity: 'Minor' as NonConformanceSeverity,
      status: 'Open' as NonConformanceStatus,
      source: '',
      linked_batch: '',
      linked_supplier_id: '',
      linked_capa_id: '',
      linked_audit_finding_id: '',
      assigned_to: '',
      root_cause: '',
      immediate_action: '',
      final_action: '',
      capa_required: false,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      // Load sources
      const sourceData = await getNCSources();
      setSources(sourceData);

      // Load open CAPAs for linking
      const capasData = await getOpenCAPAs();
      setOpenCAPAs(capasData);

      // Load open audit findings for linking
      const findingsData = await getOpenAuditFindings();
      setAuditFindings(findingsData);
    };
    
    loadData();
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
          linked_audit_finding_id: ncData.linked_audit_finding_id,
          immediate_action: ncData.immediate_action,
          reported_by: ncData.reported_by,
          assigned_to: ncData.assigned_to,
          due_date: ncData.due_date,
          capa_required: ncData.capa_required,
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

  const handleCreateCAPAFromNC = async () => {
    const formData = form.getValues();
    
    try {
      setIsSubmitting(true);
      
      const capaResult = await createCAPAFromNC({
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        nc_id: initialData?.id || '',
        reported_by: initialData?.reported_by || "00000000-0000-0000-0000-000000000000",
      });
      
      if (capaResult) {
        // Update the form with the linked CAPA ID
        form.setValue('linked_capa_id', capaResult.id);
        
        // Update the CAPAs list
        setOpenCAPAs([...openCAPAs, capaResult]);
        
        setCreateCAPADialogOpen(false);
        
        toast({
          title: "Success",
          description: `CAPA ${capaResult.number} created and linked to this non-conformance`,
        });
      }
    } catch (error) {
      console.error('Error creating CAPA:', error);
      toast({
        title: "Error",
        description: `Failed to create CAPA: ${(error as Error).message}`,
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
                    {['Manufacturing', 'Supplier', 'QA Inspection', 'Customer Complaint', 'Other']
                      .concat(sources)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((source) => (
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
                      <SelectItem value="Containment">Containment</SelectItem>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="Verification">Verification</SelectItem>
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
          
          {/* New fields for CAPA and Audit Finding integration */}
          <FormField
            control={form.control}
            name="linked_audit_finding_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linked Audit Finding</FormLabel>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Link to an audit finding" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {auditFindings.map((finding) => (
                        <SelectItem key={finding.id} value={finding.id}>
                          {finding.finding_number} - {finding.description.substring(0, 30)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription>
                  If this non-conformance relates to an audit finding, select it here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="capa_required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>CAPA Required</FormLabel>
                    <FormDescription>
                      Is a Corrective and Preventive Action (CAPA) required for this non-conformance?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="linked_capa_id"
              render={({ field }) => (
                <FormItem className={!form.watch('capa_required') ? 'opacity-50' : ''}>
                  <FormLabel>Linked CAPA</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""}
                      disabled={!form.watch('capa_required')}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Link to a CAPA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {openCAPAs.map((capa) => (
                          <SelectItem key={capa.id} value={capa.id}>
                            {capa.number} - {capa.title.substring(0, 30)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Dialog open={createCAPADialogOpen} onOpenChange={setCreateCAPADialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled={!form.watch('capa_required')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New CAPA</DialogTitle>
                          <DialogDescription>
                            This will create a new CAPA record linked to this non-conformance.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            A new CAPA will be created with the following details:
                          </p>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Title:</span> CAPA for {form.watch('title')}
                            </div>
                            <div>
                              <span className="font-medium">Description:</span> {form.watch('description').substring(0, 100)}...
                            </div>
                            <div>
                              <span className="font-medium">Type:</span> {form.watch('severity') === 'Critical' ? 'Corrective' : 'Both'}
                            </div>
                            <div>
                              <span className="font-medium">Priority:</span> {form.watch('severity') === 'Critical' ? 'High' : form.watch('severity') === 'Major' ? 'Medium' : 'Low'}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setCreateCAPADialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleCreateCAPAFromNC} 
                            disabled={isSubmitting}
                          >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create CAPA
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <FormDescription>
                    Select an existing CAPA or create a new one.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
