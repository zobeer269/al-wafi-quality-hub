
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarClock, ChevronLeft, Edit, Paperclip, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NonConformance } from '@/types/nonConformance';
import { toast } from '@/hooks/use-toast';

interface NCDetailProps {
  nonConformance: NonConformance;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Investigation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Containment':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Correction':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Verification':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Major':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Minor':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const NCDetail: React.FC<NCDetailProps> = ({ nonConformance }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center" 
          onClick={() => navigate('/nonconformance')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate(`/nonconformance/edit/${nonConformance.id}`)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold">{nonConformance.title}</h2>
          <div className="flex items-center mt-2 text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            <span className="font-medium mr-2">{nonConformance.nc_number}</span>
            <span className="mx-2">•</span>
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>Reported on {formatDate(nonConformance.reported_date)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`${getStatusColor(nonConformance.status)} px-3 py-1`}>
            {nonConformance.status}
          </Badge>
          <Badge variant="outline" className={`${getSeverityColor(nonConformance.severity)} px-3 py-1`}>
            {nonConformance.severity}
          </Badge>
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 px-3 py-1">
            {nonConformance.category}
          </Badge>
          {nonConformance.capa_required && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
              CAPA Required
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Non-Conformance Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Product Affected</h4>
              <p className="mt-1">{nonConformance.product_affected || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Lot Number</h4>
              <p className="mt-1">{nonConformance.lot_number || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Reported By</h4>
              <p className="mt-1">{nonConformance.reported_by}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
              <p className="mt-1">{nonConformance.assigned_to || 'Not assigned'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
              <p className="mt-1">{formatDate(nonConformance.due_date)}</p>
            </div>
            {nonConformance.closed_date && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Closed Date</h4>
                <p className="mt-1">{formatDate(nonConformance.closed_date)}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 whitespace-pre-wrap">{nonConformance.description}</p>
          </div>

          {nonConformance.containment_action && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Containment Action</h4>
              <p className="mt-1 whitespace-pre-wrap">{nonConformance.containment_action}</p>
            </div>
          )}

          {nonConformance.root_cause && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Root Cause</h4>
              <p className="mt-1 whitespace-pre-wrap">{nonConformance.root_cause}</p>
            </div>
          )}

          {nonConformance.correction && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Correction</h4>
              <p className="mt-1 whitespace-pre-wrap">{nonConformance.correction}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {nonConformance.linked_capa_id && (
        <Card>
          <CardHeader>
            <CardTitle>Linked CAPA</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(`/capa/${nonConformance.linked_capa_id}`)}>
              View CAPA
            </Button>
          </CardContent>
        </Card>
      )}

      {nonConformance.linked_audit_finding_id && (
        <Card>
          <CardHeader>
            <CardTitle>Linked Audit Finding</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(`/audits/finding/${nonConformance.linked_audit_finding_id}`)}>
              View Audit Finding
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NCDetail;
