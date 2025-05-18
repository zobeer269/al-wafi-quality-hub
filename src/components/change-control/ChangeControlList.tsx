
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChangeControl, 
  AffectedArea, 
  ChangeControlStatus, 
  fetchChangeControls 
} from "@/services/changeControlService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangeControlStatusBadge from "./ChangeControlStatusBadge";
import { formatDateSimple } from "@/lib/utils";
import { PlusCircle, Filter } from "lucide-react";

const ChangeControlList: React.FC = () => {
  const navigate = useNavigate();
  const [changeControls, setChangeControls] = useState<ChangeControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status?: ChangeControlStatus;
    area?: AffectedArea;
  }>({});

  useEffect(() => {
    const loadChangeControls = async () => {
      setLoading(true);
      const data = await fetchChangeControls(filters);
      setChangeControls(data);
      setLoading(false);
    };
    
    loadChangeControls();
  }, [filters]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Change Controls</CardTitle>
        <Button onClick={() => navigate("/change/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Change Request
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Filter:</span>
          </div>
          
          <Select
            value={filters.status}
            onValueChange={(value: ChangeControlStatus | undefined) => 
              setFilters(prev => ({ ...prev, status: value || undefined }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Implemented">Implemented</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.area}
            onValueChange={(value: AffectedArea | undefined) => 
              setFilters(prev => ({ ...prev, area: value || undefined }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Process">Process</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Document">Document</SelectItem>
              <SelectItem value="Supplier">Supplier</SelectItem>
              <SelectItem value="System">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Risk Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeControls.length > 0 ? (
                  changeControls.map((changeControl) => (
                    <TableRow 
                      key={changeControl.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/change/${changeControl.id}`)}
                    >
                      <TableCell className="font-medium">{changeControl.title}</TableCell>
                      <TableCell>{changeControl.affected_area}</TableCell>
                      <TableCell>
                        <ChangeControlStatusBadge status={changeControl.status} />
                      </TableCell>
                      <TableCell>{formatDateSimple(changeControl.created_at || '')}</TableCell>
                      <TableCell>
                        {changeControl.risk_rating || 'Not Assessed'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No change controls found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangeControlList;
