import React from "react";
import { Badge } from "@/components/ui/badge";

const OrderStatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge
      variant="secondary"
      className={`${getStatusStyles(status)} font-medium`}
    >
      {status}
    </Badge>
  );
};

export default OrderStatusBadge;
