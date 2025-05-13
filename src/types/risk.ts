
export type RiskStatus = 'Open' | 'Mitigated' | 'Closed';
export type ChangeStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Risk {
  id: string;
  title: string;
  description?: string;
  area?: string;
  likelihood: number;
  impact: number;
  risk_score: number;
  status: RiskStatus;
  mitigation_plan?: string;
  responsible?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Change {
  id: string;
  change_title: string;
  change_reason?: string;
  linked_area?: string;
  requested_by?: string;
  status: ChangeStatus;
  risk_id?: string;
  implementation_plan?: string;
  approval_notes?: string;
  approved_by?: string;
  implementation_date?: string;
  created_at?: string;
  updated_at?: string;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 15) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

export function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case 'Critical': return 'bg-red-600 text-white';
    case 'High': return 'bg-red-500 text-white';
    case 'Medium': return 'bg-amber-500 text-white';
    case 'Low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}
