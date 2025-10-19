import React, { useState } from "react";
import { useOrders } from "@/lib/query/hooks/useOrders";
import OrdersTable from "./OrdersTable";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrdersSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useOrders({
    page: currentPage,
    page_size: pageSize,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Orders History
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Orders History
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-red-700 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Failed to load orders</span>
          </div>
          <p className="text-red-600 mb-4">
            {error.message ||
              "Something went wrong while fetching your orders."}
          </p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Handle different API response structures
  const orders = ordersData?.results || ordersData?.data || ordersData || [];

  // Debug: Log the API response to see the structure
  console.log("🔍 Orders API Response:", ordersData);
  console.log("🔍 Orders count:", ordersData?.count);
  console.log("🔍 Orders next:", ordersData?.next);
  console.log("🔍 Orders previous:", ordersData?.previous);

  // Extract pagination info from API response
  const totalCount = ordersData?.count || 0;
  const hasNext = !!ordersData?.next;
  const hasPrevious = !!ordersData?.previous;
  const totalPages = Math.ceil(totalCount / pageSize);

  console.log("🔍 Calculated pagination:", {
    totalCount,
    hasNext,
    hasPrevious,
    totalPages,
  });

  const pagination = {
    count: totalCount,
    totalPages: totalPages,
    currentPage: currentPage,
    hasNext: hasNext,
    hasPrevious: hasPrevious,
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Orders History
      </h2>
      <OrdersTable
        orders={orders}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default OrdersSection;
