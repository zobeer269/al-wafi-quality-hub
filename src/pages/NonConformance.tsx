import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Filter, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NCList from '@/components/non-conformance/NCList';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NonConformance, NonConformanceFilters, NonConformanceSummary } from '@/types/nonConformance';
import { getNonConformances, getNonConformanceSummary, getNCSources } from '@/services/nonConformanceService';
import { toast } from '@/hooks/use-toast';

const NonConformancePage: React.FC = () => {
  const navigate = useNavigate();
  const [nonConformances, setNonConformances] = useState<NonConformance[]>([]);
  const [summary, setSummary] = useState<NonConformanceSummary[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NonConformanceFilters>({
    status: 'all',
    severity: 'all',
    source: 'all'
  });
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch non-conformances with filters
      const ncData = await getNonConformances(filters);
      
      // Filter by search query if provided
      const filteredData = searchQuery 
        ? ncData.filter(nc => 
            nc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            nc.nc_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nc.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : ncData;
      
      setNonConformances(filteredData);
      
      // Fetch summary statistics
      const summaryData = await getNonConformanceSummary();
      setSummary(summaryData);
      
      // Fetch sources for filter
      const sourceData = await getNCSources();
      setSources(sourceData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch non-conformance data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as NonConformanceFilters['status'] }));
  };

  const handleSeverityChange = (value: string) => {
    setFilters(prev => ({ ...prev, severity: value as NonConformanceFilters['severity'] }));
  };

  const handleSourceChange = (value: string) => {
    setFilters(prev => ({ ...prev, source: value as NonConformanceFilters['source'] }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateNC = () => {
    navigate('/nonconformance/create');
  };

  // Find summary counts for each status
  const getStatusCount = (status: string) => {
    const statusSummary = summary.find(item => item.status === status);
    return statusSummary ? statusSummary.count : 0;
  };

  const getCriticalCount = () => {
    return summary.reduce((total, item) => total + (item.critical_count || 0), 0);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Non-Conformance"
        description="Record and investigate quality deviations and non-conformances"
        icon={<ClipboardCheck className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Non-Conformance Overview</CardTitle>
          <CardDescription>Current non-conformance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">Open</div>
              <div className="text-2xl font-bold">{getStatusCount('Open')}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium">Investigation</div>
              <div className="text-2xl font-bold">{getStatusCount('Investigation')}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-sm text-green-600 font-medium">Verification/Closed</div>
              <div className="text-2xl font-bold">{getStatusCount('Verification') + getStatusCount('Closed')}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="text-sm text-red-600 font-medium">Critical</div>
              <div className="text-2xl font-bold">{getCriticalCount()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search non-conformances..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Non-Conformances</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Investigation">Investigation</SelectItem>
                      <SelectItem value="Containment">Containment</SelectItem>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="Verification">Verification</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={filters.severity} onValueChange={handleSeverityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Major">Major</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source</label>
                  <Select value={filters.source} onValueChange={handleSourceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {['Manufacturing', 'Supplier', 'QA Inspection', 'Customer Complaint', 'Other']
                        .concat(sources)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .map((source) => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button className="w-full md:w-auto" onClick={handleCreateNC}>
          <Plus className="h-4 w-4 mr-2" />
          Report Non-Conformance
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <NCList nonConformances={nonConformances} loading={loading} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NonConformancePage;
