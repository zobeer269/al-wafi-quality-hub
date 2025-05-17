
import React from "react";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AffectedArea, 
  ChangeControl, 
  RiskRating, 
  createChangeControl 
} from "@/services/changeControlService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ChangeControlForm: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<Partial<ChangeControl>>({
    defaultValues: {
      title: "",
      change_reason: "",
      affected_area: undefined,
      impact_assessment: "",
      risk_rating: undefined,
      implementation_plan: "",
    }
  });

  const onSubmit = async (data: Partial<ChangeControl>) => {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user?.id) {
      toast.error("User not authenticated");
      return;
    }
    
    const changeControlData = {
      ...data,
      initiator: userData.user.id,
    } as Omit<ChangeControl, 'id' | 'status' | 'created_at' | 'updated_at'>;
    
    const result = await createChangeControl(changeControlData);
    
    if (result) {
      navigate("/change");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Change Request</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter change title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="change_reason"
              rules={{ required: "Reason for change is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe why this change is necessary" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affected_area"
              rules={{ required: "Affected area is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affected Area</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select affected area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Process">Process</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="impact_assessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact Assessment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the potential impact of this change" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="risk_rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="implementation_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Implementation Plan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how this change will be implemented" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/change")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Change Request</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChangeControlForm;
