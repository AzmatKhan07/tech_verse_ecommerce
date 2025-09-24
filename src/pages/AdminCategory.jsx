import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  useCategories,
  useDeleteCategory,
  useCreateCategory,
  useUpdateCategory,
  usePatchCategory,
  useCategoryKPIs,
} from "@/lib/query/hooks/useCategories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/lib/hooks/use-toast";

const AdminCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // TanStack Query hooks
  const deleteCategoryMutation = useDeleteCategory();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const patchCategoryMutation = usePatchCategory();

  // Toast hook
  const { toast } = useToast();

  // Build query parameters
  const queryParams = {
    page: currentPage,
    page_size: 20,
    ...(searchTerm && { search: searchTerm }),
    ...(filterActive !== "All" && { is_active: filterActive === "Active" }),
  };

  const {
    data: categoriesData,
    isLoading: loading,
    error,
    refetch,
  } = useCategories(queryParams);

  // Fetch category KPIs
  const {
    data: kpisData,
    isLoading: kpisLoading,
    error: kpisError,
  } = useCategoryKPIs();

  // Extract data from the query result
  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination || {
    count: 0,
    totalPages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
  };
  const totalCount = pagination.count;
  const totalPages = pagination.totalPages;

  // Debounced search effect - reset to page 1 when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterActive]);

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Handle category deletion
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Confirm category deletion
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const slug = categoryToDelete.category_slug || categoryToDelete.slug;
      await deleteCategoryMutation.mutateAsync(slug);
      toast({
        title: "Category Deleted",
        description: `"${
          categoryToDelete.category_name || categoryToDelete.name
        }" has been deleted successfully.`,
        variant: "success",
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle category toggle (active/inactive)
  const handleToggleCategory = async (category) => {
    try {
      const currentStatus =
        category.status !== undefined ? category.status : category.is_active;
      const slug = category.category_slug || category.slug;
      await patchCategoryMutation.mutateAsync({
        slug: slug,
        data: { is_active: !currentStatus },
      });
      toast({
        title: "Category Status Updated",
        description: `"${category.category_name || category.name}" has been ${
          !currentStatus ? "activated" : "deactivated"
        }.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Error toggling category:", err);
      toast({
        title: "Error",
        description: "Failed to update category status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        const slug = editingCategory.category_slug || editingCategory.slug;
        await updateCategoryMutation.mutateAsync({
          slug: slug,
          data: formData,
        });
        toast({
          title: "Category Updated",
          description: `"${formData.name}" has been updated successfully.`,
          variant: "success",
        });
      } else {
        await createCategoryMutation.mutateAsync(formData);
        toast({
          title: "Category Created",
          description: `"${formData.name}" has been created successfully.`,
          variant: "success",
        });
      }
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Error saving category:", err);
      toast({
        title: "Error",
        description: editingCategory
          ? "Failed to update category. Please try again."
          : "Failed to create category. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // Handle add new category
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Categories
            </h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={handleAddCategory}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <p className="text-xl font-bold">
                    {kpisLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : kpisError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      kpisData?.total_categories || totalCount
                    )}
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
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold">
                    {kpisLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : kpisError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      kpisData?.active_categories ||
                      categories.filter((c) =>
                        c.status !== undefined ? c.status : c.is_active
                      ).length
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Inactive</p>
                  <p className="text-xl font-bold">
                    {kpisLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : kpisError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      kpisData?.inactive_categories ||
                      categories.filter(
                        (c) =>
                          !(c.status !== undefined ? c.status : c.is_active)
                      ).length
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">With Products</p>
                  <p className="text-xl font-bold">
                    {kpisLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : kpisError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      kpisData?.categories_with_products ||
                      categories.filter((c) => c.product_count > 0).length
                    )}
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
                  placeholder="Search categories..."
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

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>
                  {error.message ||
                    "Failed to fetch categories. Please try again."}
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

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Categories List ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">
                  Loading categories...
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Products
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Folder className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {category.category_name || category.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {category.category_slug || category.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs">
                          <p className="truncate">
                            {category.description || "No description"}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.product_count || 0}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={getStatusColor(
                              category.status !== undefined
                                ? category.status
                                : category.is_active
                            )}
                          >
                            {(
                              category.status !== undefined
                                ? category.status
                                : category.is_active
                            )
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {category.created_at
                            ? new Date(category.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleToggleCategory(category)}
                              disabled={patchCategoryMutation.isPending}
                            >
                              {(
                                category.status !== undefined
                                  ? category.status
                                  : category.is_active
                              ) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={deleteCategoryMutation.isPending}
                            >
                              {deleteCategoryMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {categories.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No categories found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 20 + 1} to{" "}
                  {Math.min(currentPage * 20, totalCount)} of {totalCount}{" "}
                  categories
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCategory(null);
              }}
              isLoading={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {categoryToDelete?.category_name || categoryToDelete?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {categoryToDelete?.category_slug || categoryToDelete?.slug}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Are you sure you want to delete this category? This action
                cannot be undone.
                {categoryToDelete?.product_count > 0 && (
                  <span className="block mt-2 text-red-600 font-medium">
                    ⚠️ This category has {categoryToDelete.product_count}{" "}
                    product(s). Deleting it may affect those products.
                  </span>
                )}
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1"
                  disabled={deleteCategoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDeleteCategory}
                  className="flex-1"
                  disabled={deleteCategoryMutation.isPending}
                >
                  {deleteCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Category"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCategory;
