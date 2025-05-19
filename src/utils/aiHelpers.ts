import { CAPAType, CAPAPriority } from '@/types/document';
import { NonConformance } from '@/types/nonConformance';
import { CAPA as CAPA_Interface } from '@/types/document';

/**
 * AI-powered priority suggestion for CAPAs
 */
export function suggestCAPAPriority(
  source?: string, 
  severity?: NonConformanceSeverity, 
  description?: string
): { priority: CAPAPriority; reason: string } {
  // Default to medium priority
  let priority: CAPAPriority = 2;
  let reason = "Based on standard evaluation";
  
  // Check for audit-related critical issues
  if (source?.toLowerCase().includes('audit') && severity === 'Critical') {
    priority = 3;
    reason = "Critical finding from audit requires high priority";
  }
  // Check for supplier-related major issues
  else if ((source?.toLowerCase().includes('supplier') || 
          description?.toLowerCase().includes('supplier')) && 
          severity === 'Major') {
    priority = 3;
    reason = "Major supplier-related issue requires high priority";
  }
  // Check for patient safety concerns
  else if (description && (
      description.toLowerCase().includes('patient') || 
      description.toLowerCase().includes('safety') ||
      description.toLowerCase().includes('adverse')
    )) {
    priority = 3;
    reason = "Patient safety concern detected";
  }
  // Minor issues with clear containment
  else if (severity === 'Minor' && description?.toLowerCase().includes('contain')) {
    priority = 1;
    reason = "Minor issue with containment in place";
  }
  // Default for critical issues
  else if (severity === 'Critical') {
    priority = 3;
    reason = "Critical issue requires high priority";
  }
  // Default for major issues
  else if (severity === 'Major') {
    priority = 2;
    reason = "Major issue suggests medium priority";
  }
  // Default for minor issues
  else if (severity === 'Minor') {
    priority = 1;
    reason = "Minor issue suggests low priority";
  }
  
  return { priority, reason };
}

/**
 * Generate smart tags based on description and metadata
 */
export function generateSmartTags(
  description: string,
  severity?: NonConformanceSeverity,
  source?: string,
  recurrenceCount?: number
): string[] {
  const tags: string[] = [];
  const normalizedDesc = description.toLowerCase();
  
  // Source-based tags
  if (source) {
    const sourceTag = `source-${source.toLowerCase().replace(/\s+/g, '-')}`;
    tags.push(sourceTag);
  }
  
  // Severity-based tags
  if (severity) {
    tags.push(severity.toLowerCase());
  }
  
  // Content-based tags
  if (normalizedDesc.includes('supplier') || normalizedDesc.includes('vendor')) {
    tags.push('supplier-related');
  }
  
  if (normalizedDesc.includes('specification') || normalizedDesc.includes('spec') || normalizedDesc.includes('oos')) {
    tags.push('out-of-spec');
  }
  
  if (normalizedDesc.includes('deviation') || normalizedDesc.includes('protocol')) {
    tags.push('deviation');
  }
  
  if (normalizedDesc.includes('equipment') || normalizedDesc.includes('machine')) {
    tags.push('equipment-related');
  }
  
  if (normalizedDesc.includes('training') || normalizedDesc.includes('personnel')) {
    tags.push('personnel-related');
  }
  
  if (normalizedDesc.includes('document') || normalizedDesc.includes('documentation')) {
    tags.push('documentation');
  }
  
  // Recurrence detection
  if (recurrenceCount && recurrenceCount > 1) {
    tags.push('recurring');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Generate AI notes based on analysis
 */
export function generateAINotes(
  item: NonConformance | CAPA_Interface,
  daysOpen?: number,
  similarIssues?: number
): string {
  const notes: string[] = [];
  
  // Priority suggestion if it's a CAPA and has a priority
  if ('priority' in item) {
    const capa = item as CAPA_Interface;
    const priorityText = capa.priority === 3 ? 'High' : capa.priority === 2 ? 'Medium' : 'Low';
    notes.push(`Suggested Priority: ${priorityText}`);
  }
  
  // Overdue alerts
  if (daysOpen && daysOpen > 10) {
    notes.push(`⚠️ Warning: Issue has been open for ${daysOpen} days`);
  }
  
  // Similar issues detection
  if (similarIssues && similarIssues > 0) {
    notes.push(`Found ${similarIssues} similar issues in the past 6 months`);
  }
  
  // Status-specific notes
  if ('status' in item) {
    if (item.status === 'Open' && daysOpen && daysOpen > 5) {
      notes.push(`Recommendation: Escalate to investigation phase`);
    } else if (item.status === 'Investigation' && daysOpen && daysOpen > 15) {
      notes.push(`Recommendation: Review for potential CAPA`);
    }
  }
  
  return notes.join('\n');
}

/**
 * Check for overdue items
 */
export function checkOverdueItems(items: (CAPA_Interface | NonConformance)[], daysThreshold: number = 10): (CAPA_Interface | NonConformance)[] {
  const today = new Date();
  
  return items.filter(item => {
    if (item.status === 'Closed') return false;
    
    // If there's a due date, check if it's past due
    if (item.due_date) {
      const dueDate = new Date(item.due_date);
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > daysThreshold;
    }
    
    // If no due date but created more than X days ago
    const createdDate = new Date('createdDate' in item ? item.createdDate : item.created_at);
    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > daysThreshold * 2; // Double threshold for items without due dates
  });
}

/**
 * Filter items by tags
 */
export function filterByTags(items: (CAPA_Interface | NonConformance)[], filterTags: string[]): (CAPA_Interface | NonConformance)[] {
  if (!filterTags || filterTags.length === 0) return items;
  
  return items.filter(item => {
    const itemTags = item.tags || [];
    return filterTags.some(tag => itemTags.includes(tag));
  });
}

/**
 * Generate risk score based on item's properties
 */
export function generateRiskScore(item: CAPA_Interface | NonConformance): number {
  let score = 0;

  // Base score calculation
  if ('priority' in item && typeof item.priority === 'number') {
    // For CAPAs
    score += item.priority * 20;
  } else if ('severity' in item) {
    // For NonConformances
    switch (item.severity) {
      case 'Critical':
        score += 100;
        break;
      case 'Major':
        score += 70;
        break;
      case 'Minor':
        score += 30;
        break;
      default:
        score += 10;
    }
  }

  // Due date factor
  const dueDateProperty = 'dueDate' in item ? item.dueDate : ('due_date' in item ? item.due_date : null);
  
  if (dueDateProperty) {
    const dueDate = new Date(dueDateProperty);
    const today = new Date();
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      // Overdue
      score += 50;
    } else if (daysUntilDue < 7) {
      // Due soon
      score += 30;
    } else if (daysUntilDue < 14) {
      // Due in 1-2 weeks
      score += 15;
    }
  }

  // Status factor
  if ('status' in item) {
    if (item.status === 'Open' || item.status === 'Investigation') {
      score += 20;
    }
  }

  return score;
}

/**
 * Check if an item is overdue based on its due date
 */
export function isOverdue(item: NonConformance | CAPA_Interface): boolean {
  if (!item.due_date) return false;
  
  const dueDate = new Date(item.due_date);
  const today = new Date();
  
  return dueDate < today;
}
