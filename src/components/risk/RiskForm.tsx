
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Risk, getRiskLevel, getRiskLevelColor } from '@/types/risk';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title is required' }),
  description: z.string().optional(),
  area: z.string().optional(),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  mitigation_plan: z.string().optional(),
  responsible: z.string().optional(),
  status: z.enum(['Open', 'Mitigated', 'Closed']).default('Open'),
});

const riskAreas = [
  'Supplier',
  'Process',
  'Product',
  'Facility',
  'Equipment',
  'Documentation',
  'Quality System',
  'Computer System',
  'Other'
];

type RiskFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<Risk>;
  isLoading?: boolean;
  isEdit?: boolean;
};

const RiskForm = ({ onSubmit, defaultValues, isLoading, isEdit = false }: RiskFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      area: defaultValues?.area || '',
      likelihood: defaultValues?.likelihood || 1,
      impact: defaultValues?.impact || 1,
      mitigation_plan: defaultValues?.mitigation_plan || '',
      responsible: defaultValues?.responsible || '',
      status: defaultValues?.status || 'Open',
    },
  });

  const likelihood = form.watch('likelihood');
  const impact = form.watch('impact');
  const riskScore = likelihood * impact;
  const riskLevel = getRiskLevel(riskScore);
  const riskColor = getRiskLevelColor(riskLevel);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Risk Assessment' : 'New Risk Assessment'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter risk title" {...field} />
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
                    <Textarea placeholder="Describe the risk in detail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Area</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {riskAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="likelihood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Likelihood (1-5)</FormLabel>
                    <FormControl>
                      <div className="pt-4">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="mb-3"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Rare</span>
                          <span>Unlikely</span>
                          <span>Possible</span>
                          <span>Likely</span>
                          <span>Certain</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact (1-5)</FormLabel>
                    <FormControl>
                      <div className="pt-4">
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="mb-3"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Negligible</span>
                          <span>Minor</span>
                          <span>Moderate</span>
                          <span>Major</span>
                          <span>Critical</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="text-sm font-medium">Risk Score:</div>
                <div className="text-2xl font-bold">{riskScore}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Risk Level:</div>
                <Badge className={`${riskColor} text-sm`}>{riskLevel}</Badge>
              </div>
            </div>

            <FormField
              control={form.control}
              name="mitigation_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitigation Plan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe how this risk will be mitigated" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit && (
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
                        <SelectItem value="Mitigated">Mitigated</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEdit ? 'Update Risk' : 'Create Risk')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RiskForm;
