import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/lib/hooks/use-toast";
import {
  useOrderStatuses,
  useCreateOrderStatus,
  useUpdateOrderStatus,
  useDeleteOrderStatus,
} from "@/lib/query/hooks/useOrderStatuses";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ShoppingCart,
  Activity,
  Package,
  Clock,
} from "lucide-react";

const AdminOrderStatus = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrderStatus, setEditingOrderStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    orderStatus: null,
  });
  const { toast } = useToast();

  // API hooks
  const {
    data: orderStatusesData,
    isLoading,
    error,
    refetch,
  } = useOrderStatuses({
    search: searchTerm || undefined,
    ordering: "orders_status",
    page_size: 50,
  });

  const createOrderStatusMutation = useCreateOrderStatus();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderStatusMutation = useDeleteOrderStatus();

  // Filter order statuses based on search
  const filteredOrderStatuses =
    orderStatusesData?.orderStatuses?.filter((orderStatus) => {
      if (!searchTerm) return true;
      return orderStatus.orders_status
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }) || [];

  // Statistics
  const totalOrderStatuses = orderStatusesData?.count || 0;

  const handleCreateOrderStatus = () => {
    setEditingOrderStatus(null);
    setShowForm(true);
  };

  const handleEditOrderStatus = (orderStatus) => {
    setEditingOrderStatus(orderStatus);
    setShowForm(true);
  };

  const handleDeleteOrderStatus = (orderStatus) => {
    setDeleteDialog({ open: true, orderStatus });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.orderStatus) return;

    try {
      await deleteOrderStatusMutation.mutateAsync(deleteDialog.orderStatus.id);
      toast({
        title: "Order Status Deleted",
        description: `Order status "${deleteDialog.orderStatus.orders_status}" has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, orderStatus: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete order status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingOrderStatus) {
        await updateOrderStatusMutation.mutateAsync({
          id: editingOrderStatus.id,
          data: formData,
        });
        toast({
          title: "Order Status Updated",
          description: `Order status has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createOrderStatusMutation.mutateAsync(formData);
        toast({
          title: "Order Status Created",
          description: `Order status has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingOrderStatus(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save order status",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrderStatus(null);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Order Statuses
            </div>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Status Management
            </h1>
            <p className="text-gray-600 mt-1">Manage order status types</p>
          </div>
          <Button
            onClick={handleCreateOrderStatus}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Order Status
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Statuses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrderStatuses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrderStatuses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Use</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrderStatuses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Recently Added
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredOrderStatuses.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search order statuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Statuses List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Order Statuses ({filteredOrderStatuses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading order statuses...</p>
              </div>
            ) : filteredOrderStatuses.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No order statuses found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Get started by creating your first order status"}
                </p>
                {!searchTerm && (
                  <Button onClick={handleCreateOrderStatus}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order Status
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrderStatuses.map((orderStatus) => (
                  <Card key={orderStatus.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Order Status Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-blue-100 text-blue-800">
                              {orderStatus.orders_status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">
                            ID: {orderStatus.id}
                          </p>
                          <p className="text-xs text-gray-400">
                            Created:{" "}
                            {new Date(
                              orderStatus.created_at || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrderStatus(orderStatus)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteOrderStatus(orderStatus)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingOrderStatus
                    ? "Edit Order Status"
                    : "Create New Order Status"}
                </DialogTitle>
                <DialogDescription>
                  {editingOrderStatus
                    ? "Update the order status information below."
                    : "Fill in the details to create a new order status."}
                </DialogDescription>
              </DialogHeader>
              <OrderStatusForm
                orderStatus={editingOrderStatus}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createOrderStatusMutation.isPending ||
                  updateOrderStatusMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, orderStatus: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order Status</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the order status "
                {deleteDialog.orderStatus?.orders_status}"? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteDialog({ open: false, orderStatus: null })
                }
                disabled={deleteOrderStatusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteOrderStatusMutation.isPending}
              >
                {deleteOrderStatusMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderStatus;
