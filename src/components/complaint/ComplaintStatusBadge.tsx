
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ComplaintSeverity, ComplaintStatus } from '@/types/complaint';

interface ComplaintStatusBadgeProps {
  status?: ComplaintStatus;
  severity?: ComplaintSeverity;
  showLabel?: boolean;
}

export const ComplaintStatusBadge: React.FC<ComplaintStatusBadgeProps> = ({ 
  status, 
  severity,
  showLabel = true 
}) => {
  if (status) {
    let className = '';
    
    switch (status) {
      case 'Open':
        className = 'bg-blue-100 text-blue-800';
        break;
      case 'Under Investigation':
        className = 'bg-purple-100 text-purple-800';
        break;
      case 'Resolved':
        className = 'bg-green-100 text-green-800';
        break;
      case 'Closed':
        className = 'bg-gray-100 text-gray-800';
        break;
      default:
        className = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <Badge className={className}>
        {showLabel ? status : ''}
      </Badge>
    );
  }
  
  if (severity) {
    let className = '';
    
    switch (severity) {
      case 'Low':
        className = 'bg-green-100 text-green-800';
        break;
      case 'Medium':
        className = 'bg-yellow-100 text-yellow-800';
        break;
      case 'High':
        className = 'bg-orange-100 text-orange-800';
        break;
      case 'Critical':
        className = 'bg-red-100 text-red-800';
        break;
      default:
        className = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <Badge className={className}>
        {showLabel ? severity : ''}
      </Badge>
    );
  }
  
  return null;
};

export default ComplaintStatusBadge;
