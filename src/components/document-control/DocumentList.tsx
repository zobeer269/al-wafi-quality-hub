
import React, { useState } from 'react';
import { Clock, Download, Eye, FileText, Filter, Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document, DocumentStatus } from '@/types/document';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DocumentDetail from './DocumentDetail';
import { updateDocumentStatus } from '@/services/documentService';
import { toast } from '@/components/ui/use-toast';

interface DocumentListProps {
  documents: Document[];
  onRefresh: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'All'>('All');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  React.useEffect(() => {
    const filtered = documents.filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedStatus, documents]);
  
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

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (document: Document, status: DocumentStatus) => {
    const success = await updateDocumentStatus(document.id, status);
    if (success) {
      onRefresh();
      toast({
        title: "Status updated",
        description: `Document status changed to ${status}`
      });
    }
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10 w-[300px]"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedStatus === 'All' ? 'All Statuses' : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus('All')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedStatus('Draft')}>
                    <div className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></div> Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('In Review')}>
                    <div className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></div> In Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Approved')}>
                    <div className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></div> Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Obsolete')}>
                    <div className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></div> Obsolete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{document.title}</div>
                            <div className="text-sm text-gray-500">{document.number}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>{document.version}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(document.status)}`}>
                          {document.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{document.lastUpdated}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDocument(document)} className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {document.content_url && (
                              <DropdownMenuItem className="flex items-center">
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                              </DropdownMenuItem>
                            )}
                            {document.status === 'Draft' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(document, 'In Review')} className="flex items-center">
                                <span>Submit for Review</span>
                              </DropdownMenuItem>
                            )}
                            {document.status === 'In Review' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(document, 'Approved')} className="flex items-center">
                                <span>Approve</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          {selectedDocument && (
            <DocumentDetail 
              document={selectedDocument} 
              onClose={() => setDetailsOpen(false)}
              onStatusChange={() => {
                setDetailsOpen(false);
                onRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentList;
