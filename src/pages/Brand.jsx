import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BrandForm from "@/components/admin/BrandForm";
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
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  usePatchBrand,
  useDeleteBrand,
} from "@/lib/query/hooks/useBrands";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

const Brand = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    brand: null,
  });
  const { toast } = useToast();

  // API hooks
  const {
    data: brandsData,
    isLoading,
    error,
    refetch,
  } = useBrands({
    search: searchTerm || undefined,
    ordering: "name",
    page_size: 50,
  });

  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const patchBrandMutation = usePatchBrand();
  const deleteBrandMutation = useDeleteBrand();

  // Filter brands based on status
  const filteredBrands =
    brandsData?.results?.filter((brand) => {
      if (filterActive === "All") return true;
      if (filterActive === "Active") return brand.status;
      if (filterActive === "Inactive") return !brand.status;
      return true;
    }) || [];

  // Statistics
  const totalBrands = brandsData?.count || 0;
  const activeBrands =
    brandsData?.results?.filter((brand) => brand.status).length || 0;
  const inactiveBrands = totalBrands - activeBrands;

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDeleteBrand = (brand) => {
    setDeleteDialog({ open: true, brand });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.brand) return;

    try {
      await deleteBrandMutation.mutateAsync(deleteDialog.brand.id);
      toast({
        title: "Brand Deleted",
        description: `${deleteDialog.brand.name} has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, brand: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete brand",
        variant: "destructive",
      });
    }
  };

  const handleToggleBrand = async (brand) => {
    try {
      await patchBrandMutation.mutateAsync({
        id: brand.id,
        brandData: { status: !brand.status },
      });
      toast({
        title: "Brand Status Updated",
        description: `${brand.name} has been ${
          !brand.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update brand status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingBrand) {
        await updateBrandMutation.mutateAsync({
          id: editingBrand.id,
          brandData: formData,
        });
        toast({
          title: "Brand Updated",
          description: `${formData.name} has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createBrandMutation.mutateAsync(formData);
        toast({
          title: "Brand Created",
          description: `${formData.name} has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingBrand(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save brand",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Brands
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
              Brand Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your product brands</p>
          </div>
          <Button
            onClick={handleCreateBrand}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBrands}
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
                    Active Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeBrands}
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
                    Inactive Brands
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveBrands}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBrands > 0
                      ? Math.round((activeBrands / totalBrands) * 100)
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
                  placeholder="Search brands..."
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

        {/* Brands List */}
        <Card>
          <CardHeader>
            <CardTitle>Brands ({filteredBrands.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading brands...</p>
              </div>
            ) : filteredBrands.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No brands found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterActive !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first brand"}
                </p>
                {!searchTerm && filterActive === "All" && (
                  <Button onClick={handleCreateBrand}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Brand
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBrands.map((brand) => (
                  <Card key={brand.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {brand.image ? (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {brand.name}
                            </h3>
                            <Badge
                              variant={brand.status ? "default" : "secondary"}
                            >
                              {brand.status ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBrand(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBrand(brand)}
                          >
                            {brand.status ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBrand(brand)}
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

        {/* Brand Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBrand ? "Edit Brand" : "Create New Brand"}
                </DialogTitle>
                <DialogDescription>
                  {editingBrand
                    ? "Update the brand information below."
                    : "Fill in the details to create a new brand."}
                </DialogDescription>
              </DialogHeader>
              <BrandForm
                brand={editingBrand}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createBrandMutation.isPending || updateBrandMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, brand: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Brand</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.brand?.name}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, brand: null })}
                disabled={deleteBrandMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteBrandMutation.isPending}
              >
                {deleteBrandMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Brand;
