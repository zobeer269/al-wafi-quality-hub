
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, Filter, Plus, Search, X, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import CAPAList from '@/components/capa/CAPAList';
import CAPADetail from '@/components/capa/CAPADetail';
import CAPAForm from '@/components/capa/CAPAForm';
import { CAPA, CAPAStatus, CAPAType, CAPAPriority } from '@/types/document';
import { fetchCAPAs, createCAPA, getCAPAStatistics } from '@/services/capaService';
import { checkOverdueItems, filterByTags } from '@/utils/aiHelpers';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const CAPAPage: React.FC = () => {
  const [capas, setCapas] = useState<CAPA[]>([]);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [filterStatus, setFilterStatus] = useState<CAPAStatus | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statistics, setStatistics] = useState({
    high: 0,
    medium: 0,
    low: 0,
    closed: 0
  });
  const [activeTab, setActiveTab] = useState<string>('all');
  const [overdueItems, setOverdueItems] = useState<CAPA[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    loadCAPAs();
    loadStatistics();
  }, []);

  const loadCAPAs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCAPAs();
      setCapas(data);
      
      // Extract all unique tags
      const allTags = new Set<string>();
      data.forEach(capa => {
        if (capa.tags) {
          capa.tags.forEach(tag => allTags.add(tag));
        }
      });
      setAvailableTags(Array.from(allTags));
      
      // Find overdue items
      const overdue = checkOverdueItems(data, 10) as CAPA[];
      setOverdueItems(overdue);
      
    } catch (error) {
      console.error("Error loading CAPAs:", error);
      toast({
        title: "Error",
        description: "Failed to load CAPAs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getCAPAStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading CAPA statistics:", error);
    }
  };

  const handleCreateCAPA = async (formData: any) => {
    setIsLoading(true);
    try {
      // Mock user ID for now - replace with actual authentication
      const userId = "system";
      
      const capaData = {
        number: formData.number,
        title: formData.title,
        type: formData.type as CAPAType,
        priority: parseInt(formData.priority, 10) as CAPAPriority,
        description: formData.description,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
        status: "Open" as CAPAStatus,
        tags: formData.tags || [],
        ai_notes: formData.ai_notes || "",
        source: formData.source || undefined,
      };
      
      await createCAPA(capaData, userId);
      setShowForm(false);
      loadCAPAs();
      loadStatistics();
      
      toast({
        title: "Success",
        description: "CAPA created successfully",
      });
    } catch (error) {
      console.error("Error creating CAPA:", error);
      toast({
        title: "Error",
        description: "Failed to create CAPA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setFilterStatus(null);
    } else if (value === 'open') {
      setFilterStatus('Open');
    } else if (value === 'investigation') {
      setFilterStatus('Investigation');
    } else if (value === 'inProgress') {
      setFilterStatus('In Progress');
    } else if (value === 'closed') {
      setFilterStatus('Closed');
    }
  };

  const handleTagSelect = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Filter CAPAs by status, search term, and tags
  const filteredCAPAs = capas
    .filter(capa => {
      const matchesStatus = filterStatus ? capa.status === filterStatus : true;
      const matchesSearch = searchTerm 
        ? capa.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          capa.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (capa.description && capa.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchesStatus && matchesSearch;
    })
    .filter(capa => {
      if (filterTags.length === 0) return true;
      return filterTags.every(tag => capa.tags?.includes(tag));
    });

  return (
    <DashboardLayout>
      <PageHeader
        title="CAPA Management"
        description="Track and manage Corrective and Preventive Actions"
        icon={<AlertTriangle className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>CAPA Overview</CardTitle>
          <CardDescription>Current status of open CAPAs by priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">High Priority</div>
              <div className="text-2xl font-bold">{statistics.high}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Medium Priority</div>
              <div className="text-2xl font-bold">{statistics.medium}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Low Priority</div>
              <div className="text-2xl font-bold">{statistics.low}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Closed (Last 30 Days)</div>
              <div className="text-2xl font-bold">{statistics.closed}</div>
            </div>
          </div>
          
          {overdueItems.length > 0 && (
            <Alert className="mt-4 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-600">Predictive Alert</AlertTitle>
              <AlertDescription>
                ⚠️ {overdueItems.length} open {overdueItems.length === 1 ? 'CAPA is' : 'CAPAs are'} overdue by more than 10 days
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full max-w-sm mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search CAPAs..." 
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium mb-2">Filter by AI Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant={filterTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                      {filterTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
                {availableTags.length === 0 && (
                  <div className="text-sm text-gray-500">No tags available</div>
                )}
                
                <div className="pt-4">
                  <h5 className="font-medium mb-2">Smart Filters</h5>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setFilterTags(['supplier-related']);
                        setFilterStatus('Open');
                      }}
                    >
                      Show open supplier-related CAPAs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setFilterTags(['recurring']);
                      }}
                    >
                      Show recurring deviations
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setFilterTags(['critical']);
                      }}
                    >
                      Show critical CAPAs
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2">
          {filterStatus && (
            <Button variant="outline" size="sm" onClick={() => setFilterStatus(null)}>
              {filterStatus} <X className="ml-1 h-4 w-4" />
            </Button>
          )}
          
          {filterTags.length > 0 && (
            <div className="flex gap-1">
              {filterTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  {tag}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => setFilterTags(prev => prev.filter(t => t !== tag))}
                  />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2" 
                onClick={() => setFilterTags([])}
              >
                Clear
              </Button>
            </div>
          )}
          
          <Button className="w-full md:w-auto" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New CAPA
          </Button>
        </div>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="all">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="investigation">Investigation</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0 px-0">
            <CAPAList 
              capas={filteredCAPAs} 
              onSelectCAPA={setSelectedCAPA}
              onFilterStatus={setFilterStatus}
            />
          </TabsContent>
          
          <TabsContent value="open" className="mt-0 px-0">
            <CAPAList 
              capas={filteredCAPAs} 
              onSelectCAPA={setSelectedCAPA}
            />
          </TabsContent>
          
          <TabsContent value="investigation" className="mt-0 px-0">
            <CAPAList 
              capas={filteredCAPAs} 
              onSelectCAPA={setSelectedCAPA}
            />
          </TabsContent>
          
          <TabsContent value="inProgress" className="mt-0 px-0">
            <CAPAList 
              capas={filteredCAPAs} 
              onSelectCAPA={setSelectedCAPA}
            />
          </TabsContent>
          
          <TabsContent value="closed" className="mt-0 px-0">
            <CAPAList 
              capas={filteredCAPAs} 
              onSelectCAPA={setSelectedCAPA}
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* CAPA Detail Dialog */}
      <Dialog open={!!selectedCAPA} onOpenChange={(open) => !open && setSelectedCAPA(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCAPA && (
            <CAPADetail 
              capa={selectedCAPA} 
              onClose={() => setSelectedCAPA(null)}
              onStatusChange={() => {
                loadCAPAs();
                loadStatistics();
                setSelectedCAPA(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create CAPA Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New CAPA</DialogTitle>
          </DialogHeader>
          <CAPAForm 
            onSubmit={handleCreateCAPA}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CAPAPage;
