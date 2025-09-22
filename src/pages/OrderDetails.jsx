import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const OrderDetails = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Find the order by ID
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

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

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/orders")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Orders Details
              </h1>
              <nav className="text-sm text-gray-500">
                <span>Home</span> &gt; <span>Order List</span> &gt;{" "}
                <span>Order Details</span>
              </nav>
            </div>
          </div>

          {/* Order ID and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Orders ID: {order.displayId || order.id}
                </h2>
                <Badge className={`${getStatusColor(order.status)} mt-1`}>
                  {order.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📅</span>
                <span>{order.date}</span>
              </div>

              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
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

              <Button variant="outline" size="icon">
                <span>🖨️</span>
              </Button>

              <Button className="bg-black text-white hover:bg-gray-800">
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Customer</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Full Name: {order.customerName}</p>
                <p className="text-sm text-gray-600">
                  Email: {order.customerEmail}
                </p>
                <p className="text-sm text-gray-600">Phone: +91 904 231 1212</p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-black text-white hover:bg-gray-800"
              >
                View profile
              </Button>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">●</span>
                  </div>
                  <span className="text-sm">Master Card **** **** 6557</span>
                </div>
                <p className="text-sm text-gray-600">
                  Business name: {order.customerName}
                </p>
                <p className="text-sm text-gray-600">Phone: +91 904 231 1212</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Note</h3>
              <textarea
                placeholder="Type some notes"
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                defaultValue=""
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
