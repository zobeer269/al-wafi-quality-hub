
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, DocumentStatus } from '@/types/document';
import { Clock, Download, FileText, User } from 'lucide-react';
import { updateDocumentStatus } from '@/services/documentService';

interface DocumentDetailProps {
  document: Document;
  onClose: () => void;
  onStatusChange: () => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ 
  document, 
  onClose,
  onStatusChange
}) => {
  const handleStatusChange = async (status: DocumentStatus) => {
    await updateDocumentStatus(document.id, status);
    onStatusChange();
  };

  // Format status badge class
  const getStatusBadgeClass = (status: DocumentStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Obsolete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium text-gray-500">{document.number}</div>
            <CardTitle className="text-xl mt-1">{document.title}</CardTitle>
          </div>
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(document.status)}`}>
              {document.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Document Type</div>
            <div>{document.type}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500">Version</div>
            <div>{document.version}</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Description</div>
          <div className="text-gray-700">{document.description || 'No description provided'}</div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last updated: {document.lastUpdated}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="space-x-2">
            {document.status === 'Draft' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleStatusChange('In Review')}
              >
                Submit for Review
              </Button>
            )}
            {document.status === 'In Review' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={() => handleStatusChange('Approved')}
              >
                Approve
              </Button>
            )}
            {document.status === 'Approved' && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
                onClick={() => handleStatusChange('Obsolete')}
              >
                Mark as Obsolete
              </Button>
            )}
          </div>
          <div className="space-x-2">
            {document.content_url && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentDetail;
