import React, { useState } from "react";
import { ChevronDown, ChevronRight, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import OrderStatusBadge from "./OrderStatusBadge";

const OrdersTable = ({ orders }) => {
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, detail) => {
      const price = parseFloat(detail.price) || 0;
      const qty = detail.qty || 0;
      return total + price * qty;
    }, 0);
  };

  // Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Pagination logic
  const totalPages = Math.ceil(safeOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = safeOrders.slice(startIndex, endIndex);

  // Reset to page 1 when orders change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [orders]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Collapse all expanded orders when changing pages
    setExpandedOrders(new Set());
  };

  if (!safeOrders || safeOrders.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="mb-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-600 mb-6">
          Your order history will appear here once you make your first purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-900">Order ID</div>
        <div className="text-sm font-medium text-gray-900">Customer</div>
        <div className="text-sm font-medium text-gray-900">Items</div>
        <div className="text-sm font-medium text-gray-900">Status</div>
        <div className="text-sm font-medium text-gray-900 text-right">
          Total
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {paginatedOrders.map((order) => {
          const isExpanded = expandedOrders.has(order.id);
          const orderTotal = calculateOrderTotal(order.order_details || []);
          const itemCount = order.order_details?.length || 0;

          return (
            <React.Fragment key={order.id}>
              {/* Main Order Row */}
              <div className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                {/* Order ID */}
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 mr-2 hover:bg-gray-200"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <span className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </span>
                </div>

                {/* Customer */}
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">
                    {order.customer_name || "N/A"}
                  </span>
                </div>

                {/* Items Count */}
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Total */}
                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>

              {/* Expanded Order Details */}
              {isExpanded && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Order Details
                    </h4>
                    <div className="space-y-3">
                      {order.order_details?.map((detail, index) => (
                        <div
                          key={detail.id || index}
                          className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200"
                        >
                          {/* Product Image */}
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {detail.product_image ? (
                              <img
                                src={detail.product_image}
                                alt={detail.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {detail.product_name}
                            </h5>
                            {detail.product_attr && (
                              <div className="flex items-center gap-2 mt-1">
                                {detail.product_attr.size_name && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {detail.product_attr.size_name}
                                  </Badge>
                                )}
                                {detail.product_attr.color_name && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {detail.product_attr.color_name}
                                  </Badge>
                                )}
                                {detail.product_attr.sku && (
                                  <span className="text-xs text-gray-500">
                                    SKU: {detail.product_attr.sku}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price and Quantity */}
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(detail.price)} × {detail.qty}
                            </div>
                            <div className="text-sm text-gray-600">
                              = {formatPrice(detail.price * detail.qty)}
                            </div>
                            {detail.product_attr?.mrp &&
                              parseFloat(detail.product_attr.mrp) >
                                parseFloat(detail.price) && (
                                <div className="text-xs text-gray-500 line-through">
                                  MRP: {formatPrice(detail.product_attr.mrp)}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, safeOrders.length)} of {safeOrders.length}{" "}
              orders
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
