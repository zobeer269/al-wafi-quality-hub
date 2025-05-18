import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Link as LinkIcon,
  UserCheck,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { fetchComplaintById, assignComplaint, closeComplaint, linkComplaint } from '@/services/complaintService';
import { fetchCAPAs } from '@/services/capaService';
import { getNonConformances } from '@/services/nonConformanceService';
import { supabase } from '@/integrations/supabase/client';
import { CAPA } from '@/types/document';
import { NonConformance } from '@/types/nonConformance';
import { formatDate } from '@/lib/utils';

interface ComplaintDetailProps {
  complaintId: string;
  onStatusChange?: () => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaintId, onStatusChange }) => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [assignedUser, setAssignedUser] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [capas, setCAPAs] = useState<CAPA[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [linkType, setLinkType] = useState<'nc' | 'capa'>('nc');
  const [linkId, setLinkId] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLinkCAPA, setShowLinkCAPA] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaint();
    checkUserRoles();
    loadUsers();
    loadLinkableItems();
  }, [complaintId]);

  const loadComplaint = async () => {
    setLoading(true);
    const data = await fetchComplaintById(complaintId);
    setComplaint(data);
    setLoading(false);
  };

  const checkUserRoles = async () => {
    try {
      const { data } = await supabase.rpc('is_qa_or_admin');
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking user roles:', error);
      setIsAdmin(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadLinkableItems = async () => {
    const ncData = await getNonConformances();
    const capaData = await fetchCAPAs();
    setNonConformances(ncData.filter(nc => nc.status !== 'Closed'));
    setCAPAs(capaData.filter(capa => capa.status !== 'Closed'));
  };

  const loadCAPAData = async () => {
    if (!showLinkCAPA) return;
    
    const capas = await fetchCAPAs();
    
    // Map the database fields to the CAPA interface
    const formattedCapas: CAPA[] = capas.map(item => ({
      id: item.id,
      number: item.number,
      title: item.title,
      description: item.description,
      type: item.capa_type as CAPAType,
      priority: item.priority as CAPAPriority,
      status: item.status as CAPAStatus,
      createdDate: item.created_at,
      dueDate: item.due_date,
      assignedTo: item.assigned_to,
      root_cause: item.root_cause,
      action_plan: item.action_plan,
      created_by: item.created_by,
      closed_date: item.closed_date,
      effectiveness_check_required: item.effectiveness_check_required,
      effectiveness_verified: item.effectiveness_verified,
      linked_nc_id: item.linked_nc_id,
      linkedAuditFindingId: item.linked_audit_finding_id,
      approval_status: item.approval_status,
      approved_by: item.approved_by,
      approved_at: item.approved_at,
      tags: item.tags || []
    }));
    
    setCAPAs(formattedCapas);
  };

  const handleAssign = async () => {
    if (!assignedUser) return;
    
    setAssigning(true);
    const result = await assignComplaint(complaintId, assignedUser);
    setAssigning(false);
    
    if (result) {
      setComplaint(result);
      setShowAssignDialog(false);
      if (onStatusChange) onStatusChange();
    }
  };

  const handleLink = async () => {
    if (!linkId) return;
    
    const result = await linkComplaint(complaintId, linkType, linkId);
    
    if (result) {
      setComplaint(result);
      setShowLinkDialog(false);
      if (onStatusChange) onStatusChange();
    }
  };

  const handleClose = async () => {
    if (!justification) return;
    
    const result = await closeComplaint(complaintId, justification, resolution);
    
    if (result) {
      setComplaint(result);
      setShowCloseDialog(false);
      if (onStatusChange) onStatusChange();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500" />
        <p>Complaint not found</p>
        <Button onClick={() => navigate('/complaints')}>
          Back to Complaints
        </Button>
      </div>
    );
  }

  const isClosed = complaint.status === 'Closed';

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/complaints')} 
        className="flex items-center gap-2 p-0 mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Complaints
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{complaint.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">
              {complaint.reference_number}
            </span>
            <Badge className={`${getSeverityColor(complaint.severity)}`}>
              {complaint.severity}
            </Badge>
            <Badge className={`${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isClosed && (
            <>
              <Button 
                variant="outline"
                onClick={() => setShowAssignDialog(true)}
                disabled={isClosed}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Assign
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowLinkDialog(true)}
                disabled={isClosed}
                className="flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Link
              </Button>
            </>
          )}
          
          {isAdmin && complaint.status !== 'Closed' && (
            <Button 
              variant={complaint.severity === 'Critical' ? 'destructive' : 'default'}
              onClick={() => setShowCloseDialog(true)}
              className="flex items-center gap-2"
            >
              {complaint.severity === 'Critical' ? (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Close Critical
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Close
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Description</h3>
                <p className="whitespace-pre-wrap">{complaint.description}</p>
              </div>
              
              {complaint.product_id && complaint.product && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Related Product</h3>
                  <p>{complaint.product.name} {complaint.batch_number ? `(Batch: ${complaint.batch_number})` : ''}</p>
                </div>
              )}
              
              {complaint.linked_nc_id && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Linked Non-Conformance</h3>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => navigate(`/non-conformance/${complaint.linked_nc_id}`)}
                  >
                    View non-conformance
                  </Button>
                </div>
              )}
              
              {complaint.linked_capa_id && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Linked CAPA</h3>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => navigate(`/capa/${complaint.linked_capa_id}`)}
                  >
                    View CAPA
                  </Button>
                </div>
              )}
              
              {complaint.resolution_notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Resolution</h3>
                  <p className="whitespace-pre-wrap">{complaint.resolution_notes}</p>
                </div>
              )}
              
              {complaint.justification && complaint.status === 'Closed' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Closure Justification</h3>
                  <p className="whitespace-pre-wrap">{complaint.justification}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Complaint Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Source</h3>
                <p>{complaint.source}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Reported By</h3>
                <p>{getUserName(complaint.reported_by)}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Reported On</h3>
                <p>{formatDate(complaint.reported_at)}</p>
              </div>
              <Separator />
              {complaint.assigned_to && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Assigned To</h3>
                    <p>{getUserName(complaint.assigned_to)}</p>
                  </div>
                </>
              )}
              {complaint.status === 'Closed' && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Closed By</h3>
                    <p>{complaint.closed_by ? getUserName(complaint.closed_by) : 'Unknown'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Closed On</h3>
                    <p>{formatDate(complaint.closed_at || '')}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Complaint</DialogTitle>
            <DialogDescription>
              Assign this complaint to a user for investigation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignUser">User</Label>
              <Select
                value={assignedUser}
                onValueChange={setAssignedUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAssignDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAssign}
              disabled={!assignedUser || assigning}
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Complaint</DialogTitle>
            <DialogDescription>
              Link this complaint to a Non-Conformance or CAPA
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkType">Link Type</Label>
              <Select
                value={linkType}
                onValueChange={(value: 'nc' | 'capa') => setLinkType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nc">Non-Conformance</SelectItem>
                  <SelectItem value="capa">CAPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="linkId">{linkType === 'nc' ? 'Non-Conformance' : 'CAPA'}</Label>
              <Select
                value={linkId}
                onValueChange={setLinkId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${linkType === 'nc' ? 'non-conformance' : 'CAPA'}`} />
                </SelectTrigger>
                <SelectContent>
                  {linkType === 'nc' ? (
                    nonConformances.map((nc) => (
                      <SelectItem key={nc.id} value={nc.id}>
                        {nc.nc_number} - {nc.title}
                      </SelectItem>
                    ))
                  ) : (
                    capas.map((capa) => (
                      <SelectItem key={capa.id} value={capa.id}>
                        {capa.number} - {capa.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowLinkDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleLink}
              disabled={!linkId}
            >
              Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Close Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {complaint.severity === 'Critical' ? (
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Close Critical Complaint
                </span>
              ) : (
                'Close Complaint'
              )}
            </DialogTitle>
            <DialogDescription>
              {complaint.severity === 'Critical' 
                ? 'Closing a critical complaint requires justification'
                : 'Provide resolution details before closing'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                placeholder="Describe how this complaint was resolved"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="justification">
                {complaint.severity === 'Critical' ? (
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    Justification for Closure*
                  </span>
                ) : (
                  'Justification (Optional)'
                )}
              </Label>
              <Textarea
                id="justification"
                placeholder={complaint.severity === 'Critical' 
                  ? 'Justify why this critical complaint can be closed'
                  : 'Optional justification for closing this complaint'}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                required={complaint.severity === 'Critical'}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowCloseDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant={complaint.severity === 'Critical' ? 'destructive' : 'default'}
              onClick={handleClose}
              disabled={complaint.severity === 'Critical' && !justification}
            >
              Close Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintDetail;
