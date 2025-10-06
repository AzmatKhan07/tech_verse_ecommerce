import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CouponForm from "@/components/admin/CouponForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  usePatchCoupon,
  useDeleteCoupon,
} from "@/lib/query/hooks/useCoupons";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  TrendingUp,
  DollarSign,
  Activity,
  Percent,
} from "lucide-react";

const Coupons = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    coupon: null,
  });
  const { toast } = useToast();

  // API hooks
  const {
    data: couponsData,
    isLoading,
    error,
    refetch,
  } = useCoupons({
    search: searchTerm || undefined,
    ordering: "title",
  });

  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const patchCouponMutation = usePatchCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  // Filter coupons based on status
  const filteredCoupons =
    couponsData?.filter((coupon) => {
      if (filterActive === "All") return true;
      if (filterActive === "Active") return coupon.status;
      if (filterActive === "Inactive") return !coupon.status;
      return true;
    }) || [];

  // Statistics
  const totalCoupons = couponsData?.count || 0;
  const activeCoupons =
    couponsData?.filter((coupon) => coupon.status).length || 0;
  const inactiveCoupons = totalCoupons - activeCoupons;
  const percentageCoupons =
    couponsData?.filter((coupon) => coupon.type === "Per").length || 0;
  const fixedValueCoupons = totalCoupons - percentageCoupons;

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleDeleteCoupon = (coupon) => {
    setDeleteDialog({ open: true, coupon });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.coupon) return;

    try {
      await deleteCouponMutation.mutateAsync(deleteDialog.coupon.id);
      toast({
        title: "Coupon Deleted",
        description: `${deleteDialog.coupon.title} has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, coupon: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const handleToggleCoupon = async (coupon) => {
    try {
      await patchCouponMutation.mutateAsync({
        id: coupon.id,
        couponData: { status: !coupon.status },
      });
      toast({
        title: "Coupon Status Updated",
        description: `${coupon.title} has been ${
          !coupon.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCoupon) {
        await updateCouponMutation.mutateAsync({
          id: editingCoupon.id,
          couponData: formData,
        });
        toast({
          title: "Coupon Updated",
          description: `${formData.title} has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createCouponMutation.mutateAsync(formData);
        toast({
          title: "Coupon Created",
          description: `${formData.title} has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingCoupon(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const formatCouponValue = (coupon) => {
    if (coupon.type === "Per") {
      return `${coupon.value}%`;
    }
    return `${coupon.value} PKR`;
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Coupons
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
              Coupon Management
            </h1>
            <p className="text-gray-600 mt-1">Manage discount coupons</p>
          </div>
          <Button
            onClick={handleCreateCoupon}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Coupon
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Coupons
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCoupons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Coupons
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeCoupons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Percentage
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {percentageCoupons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Fixed Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {fixedValueCoupons}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-[180px]">
                <Select value={filterActive} onValueChange={setFilterActive}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupons List */}
        <Card>
          <CardHeader>
            <CardTitle>Coupons ({filteredCoupons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading coupons...</p>
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No coupons found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterActive !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first coupon"}
                </p>
                {!searchTerm && filterActive === "All" && (
                  <Button onClick={handleCreateCoupon}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Coupon
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => (
                  <Card key={coupon.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <Badge
                              variant={coupon.status ? "default" : "secondary"}
                            >
                              {coupon.status ? "Active" : "Inactive"}
                            </Badge>
                            {coupon.is_one_time && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                              >
                                One-time use
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {coupon.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Code:{" "}
                            <span className="font-mono font-medium">
                              {coupon.code}
                            </span>
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium text-green-600">
                              {formatCouponValue(coupon)} off
                            </span>
                            {coupon.min_order_amt > 0 && (
                              <span>Min: {coupon.min_order_amt} PKR</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleCoupon(coupon)}
                          >
                            {coupon.status ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coupon Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </DialogTitle>
                <DialogDescription>
                  {editingCoupon
                    ? "Update the coupon information below."
                    : "Fill in the details to create a new coupon."}
                </DialogDescription>
              </DialogHeader>
              <CouponForm
                coupon={editingCoupon}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createCouponMutation.isPending ||
                  updateCouponMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, coupon: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Coupon</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.coupon?.title}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, coupon: null })}
                disabled={deleteCouponMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteCouponMutation.isPending}
              >
                {deleteCouponMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Coupons;
