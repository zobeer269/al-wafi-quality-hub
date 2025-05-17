
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchProducts } from '@/services/productService';
import { createComplaint } from '@/services/complaintService';
import { Product } from '@/types/product';
import { ComplaintSeverity, ComplaintSource } from '@/types/complaint';

const ComplaintForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'Customer' as ComplaintSource,
    product_id: '',
    batch_number: '',
    severity: 'Medium' as ComplaintSeverity,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await createComplaint(formData);
    setIsSubmitting(false);
    
    if (result) {
      navigate(`/complaints/${result.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate('/complaints')}
          className="flex items-center gap-2 p-0 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Complaints
        </Button>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Complaint Title*</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter complaint title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source*</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => handleSelectChange('source', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="Distributor">Distributor</SelectItem>
                      <SelectItem value="Inspector">Inspector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="severity">Severity*</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => handleSelectChange('severity', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_id">Related Product</Label>
                  <Select
                    value={formData.product_id || ""}
                    onValueChange={(value) => handleSelectChange('product_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    name="batch_number"
                    placeholder="Enter batch number"
                    value={formData.batch_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the complaint"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/complaints')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Complaint
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ComplaintForm;
