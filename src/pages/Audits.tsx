
import React, { useState, useEffect } from 'react';
import { CheckSquare, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Audit, AuditStatus, AuditType } from '@/types/audit';
import AuditForm from '@/components/audit/AuditForm';
import AuditList from '@/components/audit/AuditList';
import { fetchAudits } from '@/services/auditService';

const Audits: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState<boolean>(false);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadAudits = async () => {
      setIsLoading(true);
      try {
        const fetchedAudits = await fetchAudits();
        setAudits(fetchedAudits);
      } catch (error) {
        console.error('Error loading audits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAudits();
  }, []);

  // Filter audits based on tab and search term
  const filteredAudits = audits.filter((audit) => {
    const matchesTab = activeTab === "all" || 
      (activeTab === "scheduled" && audit.status === "Scheduled") ||
      (activeTab === "inProgress" && audit.status === "In Progress") ||
      (activeTab === "completed" && audit.status === "Completed");
    
    const matchesSearch = searchTerm === "" ||
      audit.audit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleAuditSaved = (savedAudit: Audit) => {
    // If audit exists in the list, update it; otherwise add it
    const auditIndex = audits.findIndex(a => a.id === savedAudit.id);
    if (auditIndex >= 0) {
      setAudits(audits.map(a => a.id === savedAudit.id ? savedAudit : a));
    } else {
      setAudits([savedAudit, ...audits]);
    }
  };

  const handleViewAudit = (audit: Audit) => {
    // In future iteration, navigate to audit details page
    console.log("Viewing audit:", audit);
  };

  // Calculate audit counts for the overview cards
  const scheduledCount = audits.filter(a => a.status === 'Scheduled').length;
  const inProgressCount = audits.filter(a => a.status === 'In Progress').length;
  const completedCount = audits.filter(a => a.status === 'Completed').length;
  const findingsCount = 0; // This would be populated from audit_findings in a future iteration

  return (
    <DashboardLayout>
      <PageHeader
        title="Audit Management"
        description="Schedule, conduct, and track internal and external audits"
        icon={<CheckSquare className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Audit Overview</CardTitle>
          <CardDescription>Summary of audit activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Scheduled Audits</div>
              <div className="text-2xl font-bold">{scheduledCount}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">In Progress</div>
              <div className="text-2xl font-bold">{inProgressCount}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Completed</div>
              <div className="text-2xl font-bold">{completedCount}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Findings</div>
              <div className="text-2xl font-bold">{findingsCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Audits</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search audits..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsNewAuditDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Audit
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center">Loading audits...</div>
        ) : (
          <AuditList audits={filteredAudits} onViewAudit={handleViewAudit} />
        )}
      </Card>

      <AuditForm 
        open={isNewAuditDialogOpen} 
        onOpenChange={setIsNewAuditDialogOpen} 
        onSaved={handleAuditSaved}
      />
    </DashboardLayout>
  );
};

export default Audits;
