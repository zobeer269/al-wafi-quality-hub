
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ApprovalStatus } from "@/types/document";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SignatureDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string, reason?: string) => void;
  title: string;
  action: ApprovalStatus;
  loading?: boolean;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  action,
  loading = false,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      reason: "",
    },
  });

  const handleSubmit = (values: FormData) => {
    onConfirm(values.password, values.reason);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            This action requires electronic signature verification. 
            Please enter your password to confirm your identity.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter reason for your decision" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 border rounded-md bg-slate-50">
              <div className="text-sm text-slate-500 mb-2">
                By providing your signature, you acknowledge that this is equivalent to your handwritten signature
                and complies with 21 CFR Part 11 requirements for electronic records.
              </div>
              <div className="font-medium">
                {action === "Approved" ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Signing to APPROVE
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Signing to REJECT
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                variant={action === "Approved" ? "default" : "destructive"}
              >
                {loading ? "Signing..." : "Sign and Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
