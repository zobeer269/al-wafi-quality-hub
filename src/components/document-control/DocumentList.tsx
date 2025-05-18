
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Document, DocumentStatus } from '@/types/document';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import DocumentDetail from './DocumentDetail';

interface DocumentListProps {
  documents: Document[];
  onFilterStatus?: (status: DocumentStatus | null) => void;
  onRefresh?: () => Promise<void>;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onFilterStatus, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handleStatusClick = (status: DocumentStatus) => {
    const newStatus = filterStatus === status ? null : status;
    setFilterStatus(newStatus);
    if (onFilterStatus) {
      onFilterStatus(newStatus);
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Draft":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Draft</Badge>;
      case "In Review":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 cursor-pointer" onClick={() => handleStatusClick(status)}>In Review</Badge>;
      case "Approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Approved</Badge>;
      case "Obsolete":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 cursor-pointer" onClick={() => handleStatusClick(status)}>Obsolete</Badge>;
      default:
        return <Badge variant="outline" className="cursor-pointer" onClick={() => handleStatusClick(status)}>Unknown</Badge>;
    }
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocumentId(document.id);
    setShowDetail(true);
  };
  
  const handleStatusChange = async () => {
    if (onRefresh) {
      await onRefresh();
    }
    setShowDetail(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleViewDocument(document)}>
            <TableCell className="font-medium">{document.number}</TableCell>
            <TableCell>{document.title}</TableCell>
            <TableCell>{document.type}</TableCell>
            <TableCell>{document.version}</TableCell>
            <TableCell>{getStatusBadge(document.status)}</TableCell>
            <TableCell>{document.lastUpdated}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">View</span>
                <Check className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {documents.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No documents found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {showDetail && selectedDocumentId && (
        <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DocumentDetail 
              documentId={selectedDocumentId} 
              onStatusChange={handleStatusChange}
            />
          </DialogContent>
        </Dialog>
      )}
    </Table>
  );
};

// Export as named export
export { DocumentList };
