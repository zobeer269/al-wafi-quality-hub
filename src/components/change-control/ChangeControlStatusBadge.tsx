
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ChangeControlStatus } from "@/services/changeControlService";

interface ChangeControlStatusBadgeProps {
  status: ChangeControlStatus;
}

const ChangeControlStatusBadge: React.FC<ChangeControlStatusBadgeProps> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "Implemented":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={`${getStatusStyle()} font-medium`} variant="outline">
      {status}
    </Badge>
  );
};

export default ChangeControlStatusBadge;
