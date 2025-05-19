
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
import { NonConformance, NonConformanceSeverity, NonConformanceStatus } from '@/types/nonConformance';
import { CAPA } from '@/types/document';
import { getOpenCAPAs } from '@/services/integrationService';

const formSchema = z.object({
  nc_number: z.string().min(1, { message: "NC Number is required" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  source: z.string().optional(),
  status: z.enum(["Open", "Investigation", "Containment", "Correction", "Verification", "Closed"] as const),
  severity: z.enum(["Minor", "Major", "Critical"] as const),
  linked_batch: z.string().optional(),
  linked_supplier_id: z.string().optional(),
  linked_capa_id: z.string().optional(),
  linked_audit_finding_id: z.string().optional(),
  root_cause: z.string().optional(),
  immediate_action: z.string().optional(),
  final_action: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
  capa_required: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  ai_notes: z.string().optional(),
});

type NCFormValues = z.infer<typeof formSchema>;

interface NCFormProps {
  onSubmit: (values: NCFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<NCFormValues>;
  isLoading?: boolean;
  initialData?: NonConformance;
  isEditing?: boolean;
}

interface LinkedCAPAProps {
  capas: CAPA[];
  linkedCAPAValue: string;
  onLinkedCAPAChange: (value: string) => void;
}

const LinkedCAPA: React.FC<LinkedCAPAProps> = ({ capas, linkedCAPAValue, onLinkedCAPAChange }) => {
  return (
    <FormField
      name="linked_capa_id"
      render={() => (
        <FormItem>
          <FormLabel>Linked CAPA (Optional)</FormLabel>
          <Select onValueChange={onLinkedCAPAChange} defaultValue={linkedCAPAValue}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a CAPA" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {capas.map((capa) => (
                <SelectItem key={capa.id} value={capa.id}>{capa.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Link this non-conformance to an existing CAPA.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const NCForm: React.FC<NCFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
  initialData,
  isEditing = false
}) => {
  const [capas, setCAPAs] = useState<CAPA[]>([]);
  const [linkedCAPA, setLinkedCAPA] = useState<CAPA | null>(null);
  const [linkedCAPAValue, setLinkedCAPAValue] = useState<string>("none");

  const actualDefaultValues = initialData || defaultValues;

  useEffect(() => {
    const loadCAPAs = async () => {
      try {
        const data = await getOpenCAPAs();
        setCAPAs(data || []);
      } catch (error) {
        console.error("Error loading CAPAs", error);
      }
    };

    loadCAPAs();
  }, []);

  const handleLinkedCAPAChange = (value: string) => {
    setLinkedCAPAValue(value);

    if (value && value !== "none") {
      const selectedCAPA = capas.find(capa => capa.id === value);
      if (selectedCAPA) {
        setLinkedCAPA(selectedCAPA);
      } else {
        setLinkedCAPA(null);
      }
    } else {
      setLinkedCAPA(null);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nc_number: actualDefaultValues?.nc_number || '',
      title: actualDefaultValues?.title || '',
      description: actualDefaultValues?.description || '',
      source: actualDefaultValues?.source || '',
      status: (actualDefaultValues?.status as NonConformanceStatus) || "Open",
      severity: (actualDefaultValues?.severity as NonConformanceSeverity) || "Minor",
      linked_batch: actualDefaultValues?.linked_batch || '',
      linked_supplier_id: actualDefaultValues?.linked_supplier_id || '',
      linked_capa_id: actualDefaultValues?.linked_capa_id || '',
      linked_audit_finding_id: actualDefaultValues?.linked_audit_finding_id || '',
      root_cause: actualDefaultValues?.root_cause || '',
      immediate_action: actualDefaultValues?.immediate_action || '',
      final_action: actualDefaultValues?.final_action || '',
      assigned_to: actualDefaultValues?.assigned_to || '',
      due_date: actualDefaultValues?.due_date || '',
      capa_required: actualDefaultValues?.capa_required || false,
      tags: actualDefaultValues?.tags || [],
      ai_notes: actualDefaultValues?.ai_notes || '',
    },
  });

  const handleSubmit = (values: NCFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nc_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NC Number</FormLabel>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
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
        </div>

        <LinkedCAPA capas={capas} linkedCAPAValue={linkedCAPAValue} onLinkedCAPAChange={handleLinkedCAPAChange} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : isEditing ? "Update Non-Conformance" : "Create Non-Conformance"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default NCForm;
