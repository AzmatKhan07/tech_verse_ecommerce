import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Trash2,
  ShoppingCart,
  Filter,
  Edit,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useAdminOrders,
  useUpdateOrderStatus,
} from "@/lib/query/hooks/useOrders";
import { useOrderStatuses } from "@/lib/query/hooks/useOrderStatuses";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/lib/hooks/use-toast";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [filterPaymentType, setFilterPaymentType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState("-created_at"); // Default: newest first

  // Build query parameters
  const queryParams = {
    page: currentPage,
    page_size: 20,
    ordering: ordering,
    ...(searchTerm && { search: searchTerm }),
    ...(filterStatus !== "All" && { order_status: filterStatus }),
    ...(filterPaymentStatus !== "All" && {
      payment_status: filterPaymentStatus,
    }),
    ...(filterPaymentType !== "All" && { payment_type: filterPaymentType }),
  };

  // Fetch orders data
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useAdminOrders(queryParams);

  // Fetch order statuses for dropdown options
  const { data: orderStatusesData, isLoading: orderStatusesLoading } =
    useOrderStatuses({
      page_size: 100, // Get all order statuses
      ordering: "orders_status",
    });

  // Update order status mutation
  const updateOrderStatusMutation = useUpdateOrderStatus();

  // Extract data from response
  const orders = ordersData?.results || [];
  const pagination = ordersData?.pagination || {
    count: 0,
    totalPages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get dynamic order statuses from API
  const orderStatuses = orderStatusesData?.orderStatuses || [];
  const statusOptions = orderStatuses.map((status) => status.orders_status);

  const paymentStatusOptions = ["Pending", "Success", "Failed"];
  const paymentTypeOptions = ["COD", "Gateway"];

  // Map status strings to integers using dynamic order statuses
  const getStatusId = (status) => {
    const statusObj = orderStatuses.find((s) => s.orders_status === status);
    return statusObj ? statusObj.id : 0;
  };

  // Map status integers to strings for display using dynamic order statuses
  const getStatusString = (statusId) => {
    const statusObj = orderStatuses.find((s) => s.id === statusId);
    return statusObj ? statusObj.orders_status : "Unknown";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const statusId = getStatusId(newStatus);
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        statusData: { order_status: statusId },
      });
      toast({
        title: "Order Status Updated",
        description: `Order #${orderId} status updated to ${newStatus}`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, detail) => {
      const price = parseFloat(detail.price) || 0;
      const qty = detail.qty || 0;
      return total + price * qty;
    }, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Orders
            </h1>
            <p className="text-gray-600 mt-1">Manage customer orders</p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="text-xs"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Order Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.orders_status}>
                      {status.orders_status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Payment Status Filter */}
              <Select
                value={filterPaymentStatus}
                onValueChange={setFilterPaymentStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payment Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Type Filter */}
              <Select
                value={filterPaymentType}
                onValueChange={setFilterPaymentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payment Types</SelectItem>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                  <SelectItem value="Gateway">Payment Gateway</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>
                  {error.message || "Failed to fetch orders. Please try again."}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refetch()}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xl font-bold">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      pagination.count || 0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic status cards - show first 3 order statuses */}
          {orderStatuses.slice(0, 3).map((status, index) => {
            const colors = ["bg-orange-500", "bg-yellow-500", "bg-green-500"];
            const color = colors[index] || "bg-gray-500";

            return (
              <Card key={status.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 ${color} rounded-full`}></div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {status.orders_status}
                      </p>
                      <p className="text-xl font-bold">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          orders.filter(
                            (o) =>
                              getStatusString(o.order_status) ===
                              status.orders_status
                          ).length
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading orders...</span>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Items
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Order Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderTotal = calculateOrderTotal(
                        order.order_details || []
                      );
                      const itemCount = order.order_details?.length || 0;

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <td className="py-4 px-4">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              #{order.id}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer_name || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="text-xs">
                              {itemCount} item{itemCount !== 1 ? "s" : ""}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {formatPrice(orderTotal)}
                          </td>
                          <td
                            className="py-4 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select
                              value={
                                getStatusString(order.order_status) || "Pending"
                              }
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value)
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <Badge
                                className={getPaymentStatusColor(
                                  order.payment_status
                                )}
                              >
                                {order.payment_status || "Unknown"}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {order.payment_type || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-4 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                                title="View Details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/orders/${order.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {orders.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    No orders found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 20 + 1} to{" "}
                  {Math.min(currentPage * 20, pagination.count)} of{" "}
                  {pagination.count} orders
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage === pagination.totalPages || isLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
