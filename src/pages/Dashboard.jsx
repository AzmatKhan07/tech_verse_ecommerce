import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";

const Dashboard = () => {
  const { getStats, products, orders } = useAdmin();
  const stats = getStats();

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

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((product) => product.stock <= 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-gray-500">
                {lowStockProducts.length} low stock
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-gray-500">
                {stats.ordersByStatus.Pending || 0} pending
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats.totalRevenue)}
              </div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Low Stock Alert
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.lowStockProducts}
              </div>
              <p className="text-xs text-gray-500">Products need restock</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {formatPrice(order.total)}
                      </p>
                      <Badge
                        className={`text-xs ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Low Stock Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    All products are well stocked!
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice(product.price)}
                        </p>
                        <Badge
                          className={`text-xs ${
                            product.stock === 0
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : `${product.stock} left`}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">{status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
