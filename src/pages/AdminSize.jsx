import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SizeForm from "@/components/admin/SizeForm";
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
  useSizes,
  useCreateSize,
  useUpdateSize,
  usePatchSize,
  useDeleteSize,
} from "@/lib/query/hooks/useSizes";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Ruler,
  TrendingUp,
  Activity,
  Hash,
} from "lucide-react";

const AdminSize = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, size: null });
  const { toast } = useToast();

  // API hooks
  const {
    data: sizesData,
    isLoading,
    error,
    refetch,
  } = useSizes({
    search: searchTerm || undefined,
    ordering: "size",
    page_size: 50,
  });

  const createSizeMutation = useCreateSize();
  const updateSizeMutation = useUpdateSize();
  const patchSizeMutation = usePatchSize();
  const deleteSizeMutation = useDeleteSize();

  // Filter sizes based on status
  const filteredSizes =
    sizesData?.results?.filter((size) => {
      if (filterActive === "All") return true;
      if (filterActive === "Active") return size.status;
      if (filterActive === "Inactive") return !size.status;
      return true;
    }) || [];

  // Statistics
  const totalSizes = sizesData?.count || 0;
  const activeSizes =
    sizesData?.results?.filter((size) => size.status).length || 0;
  const inactiveSizes = totalSizes - activeSizes;

  const handleCreateSize = () => {
    setEditingSize(null);
    setShowForm(true);
  };

  const handleEditSize = (size) => {
    setEditingSize(size);
    setShowForm(true);
  };

  const handleDeleteSize = (size) => {
    setDeleteDialog({ open: true, size });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.size) return;

    try {
      await deleteSizeMutation.mutateAsync(deleteDialog.size.id);
      toast({
        title: "Size Deleted",
        description: `${deleteDialog.size.size} has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, size: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete size",
        variant: "destructive",
      });
    }
  };

  const handleToggleSize = async (size) => {
    try {
      await patchSizeMutation.mutateAsync({
        id: size.id,
        sizeData: { status: !size.status },
      });
      toast({
        title: "Size Status Updated",
        description: `${size.size} has been ${
          !size.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update size status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSize) {
        await updateSizeMutation.mutateAsync({
          id: editingSize.id,
          sizeData: formData,
        });
        toast({
          title: "Size Updated",
          description: `${formData.size} has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createSizeMutation.mutateAsync(formData);
        toast({
          title: "Size Created",
          description: `${formData.size} has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingSize(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save size",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSize(null);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Sizes
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
              Size Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your product sizes</p>
          </div>
          <Button
            onClick={handleCreateSize}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Size
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ruler className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Sizes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSizes}
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
                    Active Sizes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeSizes}
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
                    Inactive Sizes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveSizes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Hash className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSizes > 0
                      ? Math.round((activeSizes / totalSizes) * 100)
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
                  placeholder="Search sizes..."
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

        {/* Sizes List */}
        <Card>
          <CardHeader>
            <CardTitle>Sizes ({filteredSizes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading sizes...</p>
              </div>
            ) : filteredSizes.length === 0 ? (
              <div className="text-center py-12">
                <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No sizes found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterActive !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first size"}
                </p>
                {!searchTerm && filterActive === "All" && (
                  <Button onClick={handleCreateSize}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Size
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSizes.map((size) => (
                  <Card key={size.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Hash className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {size.size}
                            </h3>
                            <Badge
                              variant={size.status ? "default" : "secondary"}
                            >
                              {size.status ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSize(size)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleSize(size)}
                          >
                            {size.status ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSize(size)}
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

        {/* Size Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSize ? "Edit Size" : "Create New Size"}
                </DialogTitle>
                <DialogDescription>
                  {editingSize
                    ? "Update the size information below."
                    : "Fill in the details to create a new size."}
                </DialogDescription>
              </DialogHeader>
              <SizeForm
                size={editingSize}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createSizeMutation.isPending || updateSizeMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, size: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Size</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.size?.size}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, size: null })}
                disabled={deleteSizeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteSizeMutation.isPending}
              >
                {deleteSizeMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSize;
