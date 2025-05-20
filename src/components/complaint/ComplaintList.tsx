import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  Search,
  PlusCircle,
  Calendar,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Complaint, ComplaintFilters, ComplaintSeverity, ComplaintStatus } from '@/types/complaint';
import { fetchComplaints, getComplaintStatistics } from '@/services/complaintService';
import { formatDate } from '@/lib/utils';

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ComplaintFilters>({});
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    underInvestigation: 0,
    resolved: 0,
    closed: 0,
    critical: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaints();
    loadStatistics();
  }, [filters]);

  const loadComplaints = async () => {
    setLoading(true);
    const data = await fetchComplaints(filters);
    setComplaints(data);
    setLoading(false);
  };

  const loadStatistics = async () => {
    const statistics = await getComplaintStatistics();
    setStats(statistics);
  };

  const handleFilterChange = (key: keyof ComplaintFilters, value: string | null) => {
    setFilters(prev => {
      if (value === null || value === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const getSeverityColor = (severity: ComplaintSeverity) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/complaints/create')}
            className="flex gap-2 items-center"
          >
            <PlusCircle className="h-4 w-4" />
            New Complaint
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex gap-2 items-center"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.underInvestigation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>
      
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select
                  onValueChange={value => handleFilterChange('status', value || null)}
                  value={filters.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Severity</label>
                <Select
                  onValueChange={value => handleFilterChange('severity', value || null)}
                  value={filters.severity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All severities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    className="pl-8"
                    onChange={e => handleFilterChange('date_from', e.target.value || null)}
                    value={filters.date_from || ''}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    className="pl-8"
                    onChange={e => handleFilterChange('date_to', e.target.value || null)}
                    value={filters.date_to || ''}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading complaints...
                  </TableCell>
                </TableRow>
              ) : complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                      <p>No complaints found</p>
                      {Object.keys(filters).length > 0 && (
                        <Button 
                          variant="link" 
                          onClick={() => setFilters({})}
                          className="text-blue-600"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((complaint) => (
                  <TableRow key={complaint.id} onClick={() => navigate(`/complaints/${complaint.id}`)} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{complaint.reference_number}</TableCell>
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>{complaint.product_name || '-'}</TableCell>
                    <TableCell>{complaint.source}</TableCell>
                    <TableCell>
                      <Badge className={`${getSeverityColor(complaint.severity)}`}>
                        {complaint.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(complaint.reported_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/complaints/${complaint.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintList;
