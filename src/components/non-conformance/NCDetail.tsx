
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, Edit, FileText, UploadCloud, User } from 'lucide-react';
import { 
  NonConformance, 
  NonConformanceAttachment 
} from '@/types/nonConformance';
import { getAttachments, uploadAttachment } from '@/services/nonConformanceService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface NCDetailProps {
  nonConformance: NonConformance;
}

const NCDetail: React.FC<NCDetailProps> = ({ nonConformance }) => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<NonConformanceAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  
  useEffect(() => {
    const loadAttachments = async () => {
      const data = await getAttachments(nonConformance.id);
      setAttachments(data);
    };
    
    loadAttachments();
  }, [nonConformance.id]);
  
  const handleEditNC = () => {
    navigate(`/nonconformance/edit/${nonConformance.id}`);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const result = await uploadAttachment(
        nonConformance.id,
        selectedFile,
        // For now, we're using a mock user ID
        "00000000-0000-0000-0000-000000000000",
        fileDescription
      );
      
      if (result) {
        setAttachments([result, ...attachments]);
        setSelectedFile(null);
        setFileDescription('');
        setUploadDialogOpen(false);
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-red-500">{severity}</Badge>;
      case 'Major':
        return <Badge className="bg-amber-500">{severity}</Badge>;
      case 'Minor':
        return <Badge className="bg-blue-500">{severity}</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{status}</Badge>;
      case 'In Investigation':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">{status}</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="border-green-500 text-green-500">{status}</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold">{nonConformance.nc_number}</h2>
              {getStatusBadge(nonConformance.status)}
              {getSeverityBadge(nonConformance.severity)}
            </div>
            <CardTitle>{nonConformance.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <CalendarCheck className="h-4 w-4" />
                <span>Reported on: {formatDate(nonConformance.created_at)}</span>
              </div>
            </CardDescription>
          </div>
          <Button onClick={handleEditNC}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{nonConformance.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Source:</dt>
                  <dd>{nonConformance.source || 'Not specified'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Batch Number:</dt>
                  <dd>{nonConformance.linked_batch || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Due Date:</dt>
                  <dd className="flex items-center">
                    {nonConformance.due_date && (
                      <>
                        <Clock className="mr-1 h-3 w-3" /> 
                        {formatDate(nonConformance.due_date)}
                      </>
                    ) || 'No deadline specified'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Assigned To:</dt>
                  <dd className="flex items-center">
                    <User className="mr-1 h-3 w-3" /> 
                    {nonConformance.assigned_to || 'Unassigned'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Linked CAPA:</dt>
                  <dd>
                    {nonConformance.linked_capa_id ? (
                      <a 
                        href={`/capa/${nonConformance.linked_capa_id}`} 
                        className="text-primary hover:underline"
                      >
                        View CAPA
                      </a>
                    ) : 'None'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Resolution Progress</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Root Cause:</span>
                    <span className={`text-xs ${nonConformance.root_cause ? 'text-green-500' : 'text-amber-500'}`}>
                      {nonConformance.root_cause ? 'Identified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm">{nonConformance.root_cause || 'Not yet identified'}</p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Immediate/Containment Action:</span>
                    <span className={`text-xs ${nonConformance.immediate_action ? 'text-green-500' : 'text-amber-500'}`}>
                      {nonConformance.immediate_action ? 'Implemented' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm">{nonConformance.immediate_action || 'No immediate actions recorded'}</p>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Final Corrective Action:</span>
                    <span className={`text-xs ${nonConformance.final_action ? 'text-green-500' : 'text-amber-500'}`}>
                      {nonConformance.final_action ? 'Implemented' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm">{nonConformance.final_action || 'No final corrective actions recorded'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Attachments</h3>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Attachment</DialogTitle>
                    <DialogDescription>
                      Attach files related to this non-conformance
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="file">File</Label>
                      <Input 
                        id="file" 
                        type="file" 
                        onChange={handleFileChange} 
                        className="mt-2" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter a description for this file..."
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!selectedFile || isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attachments found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="border rounded-md p-3 flex items-center">
                    <FileText className="h-8 w-8 mr-3 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <a 
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline truncate block"
                      >
                        {attachment.file_name}
                      </a>
                      <p className="text-xs text-muted-foreground truncate">
                        {attachment.description || 'No description'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div>Created: {formatDate(nonConformance.created_at)}</div>
          <div>Last Updated: {formatDate(nonConformance.updated_at)}</div>
        </CardFooter>
      </Card>
    </>
  );
};

export default NCDetail;
