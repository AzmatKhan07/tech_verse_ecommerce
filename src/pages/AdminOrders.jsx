import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2, ShoppingCart, Filter, Edit } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder, resetData } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status) => {
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

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(orderId);
    }
  };

  const orderStats = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

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
            onClick={resetData}
            className="text-xs"
            title="Reset data if URLs still show old format"
          >
            Reset Data
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Order Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{orderStats.Pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="text-xl font-bold">
                    {orderStats.Processing || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-xl font-bold">
                    {orderStats.Delivered || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders List ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[900px]">
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
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-blue-600">
                          {order.displayId || order.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.customerName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{order.date}</td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-400">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td
                        className="py-4 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-black ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Modal would go here */}
        {/* This could be implemented with a dialog component */}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
