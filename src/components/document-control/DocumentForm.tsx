
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentInput, createDocument } from '@/services/documentService';
import { DocumentStatus } from '@/types/document';
import { toast } from '@/components/ui/use-toast';

const documentTypes = [
  "SOP", 
  "Policy", 
  "Form", 
  "Manual", 
  "Work Instruction", 
  "Template",
  "Specification"
];

interface DocumentFormProps {
  onSuccess: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DocumentInput>({
    number: '',
    title: '',
    description: '',
    document_type: 'SOP',
    version: '1.0',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, document_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.number || !formData.title || !formData.document_type) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createDocument(formData);
      if (result) {
        toast({
          title: "Document created",
          description: "Your document has been created successfully.",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Document</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="document-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Document Number *</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="e.g., QP-SOP-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g., 1.0"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Document title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type *</Label>
            <Select value={formData.document_type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Document description"
              className="min-h-[100px]"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => onSuccess()} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          form="document-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Document"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentForm;
