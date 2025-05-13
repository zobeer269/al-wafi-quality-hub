
import React, { useState, useEffect } from 'react';
import { FileText, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import DocumentList from '@/components/document-control/DocumentList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Document } from '@/types/document';
import { fetchDocuments } from '@/services/documentService';
import DocumentForm from '@/components/document-control/DocumentForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    review: 0,
    draft: 0
  });
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        approved: data.filter(doc => doc.status === 'Approved').length,
        review: data.filter(doc => doc.status === 'In Review').length,
        draft: data.filter(doc => doc.status === 'Draft').length
      });
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const handleNewDocument = () => {
    setFormDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Document Control"
        description="Manage and control quality management system documents"
        icon={<FileText className="h-6 w-6" />}
        primaryAction={{
          label: "New Document",
          onClick: handleNewDocument,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Document Overview</CardTitle>
          <CardDescription>Current status of quality management system documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Total Documents</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Approved</div>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-sm text-yellow-600 font-medium">In Review</div>
              <div className="text-2xl font-bold">{stats.review}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-600 font-medium">Draft</div>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="sop">SOPs</TabsTrigger>
          <TabsTrigger value="policy">Policies</TabsTrigger>
          <TabsTrigger value="form">Forms</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <DocumentList 
            documents={documents} 
            onRefresh={loadDocuments} 
          />
        </TabsContent>
        <TabsContent value="sop" className="mt-4">
          <DocumentList 
            documents={documents.filter(doc => doc.type === 'SOP')} 
            onRefresh={loadDocuments} 
          />
        </TabsContent>
        <TabsContent value="policy" className="mt-4">
          <DocumentList 
            documents={documents.filter(doc => doc.type === 'Policy')} 
            onRefresh={loadDocuments} 
          />
        </TabsContent>
        <TabsContent value="form" className="mt-4">
          <DocumentList 
            documents={documents.filter(doc => doc.type === 'Form')} 
            onRefresh={loadDocuments} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          <DocumentForm 
            onSuccess={() => {
              setFormDialogOpen(false);
              loadDocuments();
            }}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Documents;
