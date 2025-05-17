
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChangeControl, 
  ChangeControlHistory, 
  fetchChangeControlById, 
  fetchChangeControlHistory,
  submitForReview,
  approveChangeControl,
  rejectChangeControl,
  implementChangeControl
} from "@/services/changeControlService";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChangeControlStatusBadge from "./ChangeControlStatusBadge";
import { formatDate } from "@/lib/utils";
import { 
  Clock, 
  AlertCircle, 
  FileText, 
  User, 
  CheckCircle2, 
  XCircle, 
  Send, 
  PlayCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChangeControlDetailProps {
  changeControlId: string;
}

const ChangeControlDetail: React.FC<ChangeControlDetailProps> = ({ changeControlId }) => {
  const navigate = useNavigate();
  const [changeControl, setChangeControl] = useState<ChangeControl | null>(null);
  const [history, setHistory] = useState<ChangeControlHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isQaAdmin, setIsQaAdmin] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData?.user?.id || null);
      
      // Check if user is QA/Admin (simple check - can be enhanced)
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData?.user?.id);
      
      setIsQaAdmin(!!userRoles?.some(r => r.role === 'qa' || r.role === 'admin'));
      
      // Get change control data
      const data = await fetchChangeControlById(changeControlId);
      setChangeControl(data);
      
      // Get history
      const historyData = await fetchChangeControlHistory(changeControlId);
      setHistory(historyData);
      
      setLoading(false);
    };
    
    loadData();
  }, [changeControlId]);

  const handleSubmitForReview = async () => {
    if (!changeControl) return;
    
    const updated = await submitForReview(changeControl.id);
    if (updated) {
      setChangeControl(updated);
      // Refresh history
      const historyData = await fetchChangeControlHistory(changeControlId);
      setHistory(historyData);
    }
  };

  const handleApprove = async () => {
    if (!changeControl || !userId) return;
    
    const updated = await approveChangeControl(changeControl.id, userId);
    if (updated) {
      setChangeControl(updated);
      // Refresh history
      const historyData = await fetchChangeControlHistory(changeControlId);
      setHistory(historyData);
    }
  };

  const handleReject = async () => {
    if (!changeControl) return;
    
    const updated = await rejectChangeControl(changeControl.id);
    if (updated) {
      setChangeControl(updated);
      // Refresh history
      const historyData = await fetchChangeControlHistory(changeControlId);
      setHistory(historyData);
    }
  };

  const handleImplement = async () => {
    if (!changeControl) return;
    
    const updated = await implementChangeControl(changeControl.id);
    if (updated) {
      setChangeControl(updated);
      // Refresh history
      const historyData = await fetchChangeControlHistory(changeControlId);
      setHistory(historyData);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800" />
      </div>
    );
  }

  if (!changeControl) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Change Control Not Found</h2>
        <p className="text-gray-500 mb-4">The requested change control could not be found.</p>
        <Button onClick={() => navigate("/change")}>
          Back to Change Controls
        </Button>
      </div>
    );
  }

  // Check if user can edit (is initiator and status is Open)
  const canEdit = userId === changeControl.initiator && changeControl.status === 'Open';
  
  // Check if user can submit for review (is initiator and status is Open)
  const canSubmitForReview = userId === changeControl.initiator && changeControl.status === 'Open';
  
  // Check if user can approve/reject (is QA/Admin and status is Under Review)
  const canApproveReject = isQaAdmin && changeControl.status === 'Under Review';
  
  // Check if user can implement (is QA/Admin or initiator and status is Approved)
  const canImplement = (isQaAdmin || userId === changeControl.initiator) && changeControl.status === 'Approved';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{changeControl.title}</CardTitle>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>Created {formatDate(changeControl.created_at || '')}</span>
            </div>
          </div>
          <ChangeControlStatusBadge status={changeControl.status} />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Reason for Change</h3>
            <p className="text-gray-700 whitespace-pre-line">{changeControl.change_reason}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Affected Area</h3>
              <p className="text-gray-700">{changeControl.affected_area}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Risk Rating</h3>
              <p className="text-gray-700">{changeControl.risk_rating || 'Not assessed'}</p>
            </div>
          </div>
          
          {changeControl.impact_assessment && (
            <div>
              <h3 className="font-medium mb-2">Impact Assessment</h3>
              <p className="text-gray-700 whitespace-pre-line">{changeControl.impact_assessment}</p>
            </div>
          )}
          
          {changeControl.implementation_plan && (
            <div>
              <h3 className="font-medium mb-2">Implementation Plan</h3>
              <p className="text-gray-700 whitespace-pre-line">{changeControl.implementation_plan}</p>
            </div>
          )}
          
          {changeControl.implementation_date && (
            <div>
              <h3 className="font-medium mb-2">Implementation Date</h3>
              <p className="text-gray-700">{formatDate(changeControl.implementation_date)}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap justify-end gap-2">
          {canEdit && (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/change/${changeControl.id}/edit`)}
            >
              Edit
            </Button>
          )}
          
          {canSubmitForReview && (
            <Button onClick={handleSubmitForReview}>
              <Send className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          )}
          
          {canApproveReject && (
            <>
              <Button variant="outline" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          
          {canImplement && (
            <Button onClick={handleImplement}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Mark as Implemented
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <ol className="relative border-l border-gray-200">
              {history.map((item, index) => (
                <li key={item.id} className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    {item.status === 'Approved' ? (
                      <CheckCircle2 className="w-3 h-3 text-blue-800" />
                    ) : item.status === 'Rejected' ? (
                      <XCircle className="w-3 h-3 text-red-800" />
                    ) : item.status === 'Implemented' ? (
                      <PlayCircle className="w-3 h-3 text-green-800" />
                    ) : (
                      <FileText className="w-3 h-3 text-blue-800" />
                    )}
                  </span>
                  <div className="flex items-center">
                    <h3 className="flex items-center font-medium text-gray-900">
                      <ChangeControlStatusBadge status={item.status} />
                    </h3>
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      {formatDate(item.created_at || '')}
                    </span>
                  </div>
                  {item.comments && <p className="mb-2 text-sm text-gray-600">{item.comments}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-500">No history available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeControlDetail;
