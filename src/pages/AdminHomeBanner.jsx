import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BannerForm from "@/components/admin/BannerForm";
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
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  usePatchBanner,
  useDeleteBanner,
} from "@/lib/query/hooks/useBanners";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react";

const AdminHomeBanner = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    banner: null,
  });
  const { toast } = useToast();

  // API hooks
  const {
    data: bannersData,
    isLoading,
    error,
    refetch,
  } = useBanners({
    search: searchTerm || undefined,
    ordering: "-created_at",
    page_size: 50,
  });

  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const patchBannerMutation = usePatchBanner();
  const deleteBannerMutation = useDeleteBanner();

  // Filter banners based on status
  const filteredBanners =
    bannersData?.banners?.filter((banner) => {
      if (filterStatus === "All") return true;
      if (filterStatus === "Active") return banner.status;
      if (filterStatus === "Inactive") return !banner.status;
      return true;
    }) || [];

  // Statistics
  const totalBanners = bannersData?.count || 0;
  const activeBanners =
    bannersData?.banners?.filter((banner) => banner.status).length || 0;
  const inactiveBanners = totalBanners - activeBanners;

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDeleteBanner = (banner) => {
    setDeleteDialog({ open: true, banner });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.banner) return;

    try {
      await deleteBannerMutation.mutateAsync(deleteDialog.banner.id);
      toast({
        title: "Banner Deleted",
        description: `Banner has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, banner: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleBanner = async (banner) => {
    try {
      await patchBannerMutation.mutateAsync({
        id: banner.id,
        data: { status: !banner.status },
      });
      toast({
        title: "Banner Status Updated",
        description: `Banner has been ${
          !banner.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBanner) {
        await updateBannerMutation.mutateAsync({
          id: editingBanner.id,
          data: formData,
        });
        toast({
          title: "Banner Updated",
          description: `Banner has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createBannerMutation.mutateAsync(formData);
        toast({
          title: "Banner Created",
          description: `Banner has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save banner",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Banners
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
              Home Banner Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your home page banners</p>
          </div>
          <Button
            onClick={handleCreateBanner}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Banners
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBanners}
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
                    Active Banners
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeBanners}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Activity className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Inactive Banners
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveBanners}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBanners > 0
                      ? Math.round((activeBanners / totalBanners) * 100)
                      : 0}
                    %
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
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-[180px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
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

        {/* Banners List */}
        <Card>
          <CardHeader>
            <CardTitle>Banners ({filteredBanners.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading banners...</p>
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No banners found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first banner"}
                </p>
                {!searchTerm && filterStatus === "All" && (
                  <Button onClick={handleCreateBanner}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Banner
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBanners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Banner Image */}
                        <div className="relative">
                          <img
                            src={banner.image || "/placeholder-banner.jpg"}
                            alt="Banner"
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "/placeholder-banner.jpg";
                            }}
                          />
                          <Badge
                            className={`absolute top-2 right-2 ${
                              banner.status
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {banner.status ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {/* Banner Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              disabled
                            >
                              {banner.btn_txt}
                            </Button>
                            <ExternalLink className="h-3 w-3 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {banner.btn_link}
                          </p>
                          <p className="text-xs text-gray-400">
                            Created:{" "}
                            {new Date(banner.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleBanner(banner)}
                            >
                              {banner.status ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBanner(banner)}
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

        {/* Banner Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </DialogTitle>
                <DialogDescription>
                  {editingBanner
                    ? "Update the banner information below."
                    : "Fill in the details to create a new banner."}
                </DialogDescription>
              </DialogHeader>
              <BannerForm
                banner={editingBanner}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createBannerMutation.isPending ||
                  updateBannerMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, banner: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Banner</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this banner? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, banner: null })}
                disabled={deleteBannerMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteBannerMutation.isPending}
              >
                {deleteBannerMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminHomeBanner;
