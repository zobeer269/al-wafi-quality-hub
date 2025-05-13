
export type AuditType = 'Internal' | 'External' | 'Supplier' | 'Regulatory';
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Audit {
  id: string;
  auditId: string;
  title: string;
  type: AuditType;
  scope: string;
  status: AuditStatus;
  startDate: string;
  endDate: string;
  leadAuditor: string;
  auditTeam?: string[];
  department?: string;
  description?: string;
}

export interface AuditFinding {
  id: string;
  auditId: string;
  findingNumber: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Observation';
  status: 'Open' | 'In Progress' | 'Closed';
  dueDate?: string;
  assignedTo?: string;
  capaRequired: boolean;
  capaId?: string;
}

export interface AuditEvidence {
  id: string;
  auditId: string;
  findingId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}
