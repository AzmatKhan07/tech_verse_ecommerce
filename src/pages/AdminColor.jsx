import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ColorForm from "@/components/admin/ColorForm";
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
  useColors,
  useCreateColor,
  useUpdateColor,
  usePatchColor,
  useDeleteColor,
} from "@/lib/query/hooks/useColors";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  TrendingUp,
  Activity,
  Circle,
} from "lucide-react";

const AdminColor = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    color: null,
  });
  const { toast } = useToast();

  // API hooks
  const {
    data: colorsData,
    isLoading,
    error,
    refetch,
  } = useColors({
    search: searchTerm || undefined,
    ordering: "color",
    page_size: 50,
  });

  const createColorMutation = useCreateColor();
  const updateColorMutation = useUpdateColor();
  const patchColorMutation = usePatchColor();
  const deleteColorMutation = useDeleteColor();

  // Filter colors based on status
  const filteredColors =
    colorsData?.results?.filter((color) => {
      if (filterActive === "All") return true;
      if (filterActive === "Active") return color.status;
      if (filterActive === "Inactive") return !color.status;
      return true;
    }) || [];

  // Statistics
  const totalColors = colorsData?.count || 0;
  const activeColors =
    colorsData?.results?.filter((color) => color.status).length || 0;
  const inactiveColors = totalColors - activeColors;

  const handleCreateColor = () => {
    setEditingColor(null);
    setShowForm(true);
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setShowForm(true);
  };

  const handleDeleteColor = (color) => {
    setDeleteDialog({ open: true, color });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.color) return;

    try {
      await deleteColorMutation.mutateAsync(deleteDialog.color.id);
      toast({
        title: "Color Deleted",
        description: `${deleteDialog.color.color} has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, color: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete color",
        variant: "destructive",
      });
    }
  };

  const handleToggleColor = async (color) => {
    try {
      await patchColorMutation.mutateAsync({
        id: color.id,
        colorData: { status: !color.status },
      });
      toast({
        title: "Color Status Updated",
        description: `${color.color} has been ${
          !color.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update color status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingColor) {
        await updateColorMutation.mutateAsync({
          id: editingColor.id,
          colorData: formData,
        });
        toast({
          title: "Color Updated",
          description: `${formData.color} has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createColorMutation.mutateAsync(formData);
        toast({
          title: "Color Created",
          description: `${formData.color} has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingColor(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save color",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingColor(null);
  };

  // Helper function to get color preview
  const getColorPreview = (colorName) => {
    // Try to extract hex color from the name
    const hexMatch = colorName.match(/#[0-9A-Fa-f]{6}/);
    if (hexMatch) {
      return hexMatch[0];
    }

    // Map common color names to hex values
    const colorMap = {
      red: "#FF0000",
      blue: "#0000FF",
      green: "#008000",
      yellow: "#FFFF00",
      orange: "#FFA500",
      purple: "#800080",
      pink: "#FFC0CB",
      black: "#000000",
      white: "#FFFFFF",
      gray: "#808080",
      grey: "#808080",
    };

    return colorMap[colorName.toLowerCase()] || "#808080";
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Colors
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
              Color Management
            </h1>
            <p className="text-gray-600 mt-1">Manage your product colors</p>
          </div>
          <Button
            onClick={handleCreateColor}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Color
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Palette className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Colors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalColors}
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
                    Active Colors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeColors}
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
                    Inactive Colors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveColors}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Circle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalColors > 0
                      ? Math.round((activeColors / totalColors) * 100)
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
                  placeholder="Search colors..."
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

        {/* Colors List */}
        <Card>
          <CardHeader>
            <CardTitle>Colors ({filteredColors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading colors...</p>
              </div>
            ) : filteredColors.length === 0 ? (
              <div className="text-center py-12">
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No colors found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterActive !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first color"}
                </p>
                {!searchTerm && filterActive === "All" && (
                  <Button onClick={handleCreateColor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Color
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredColors.map((color) => (
                  <Card key={color.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                            style={{
                              backgroundColor: getColorPreview(color.color),
                            }}
                          >
                            <Circle className="h-6 w-6 text-white drop-shadow-sm" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {color.color}
                            </h3>
                            <Badge
                              variant={color.status ? "default" : "secondary"}
                            >
                              {color.status ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditColor(color)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleColor(color)}
                          >
                            {color.status ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteColor(color)}
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

        {/* Color Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingColor ? "Edit Color" : "Create New Color"}
                </DialogTitle>
                <DialogDescription>
                  {editingColor
                    ? "Update the color information below."
                    : "Fill in the details to create a new color."}
                </DialogDescription>
              </DialogHeader>
              <ColorForm
                color={editingColor}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createColorMutation.isPending || updateColorMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, color: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Color</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.color?.color}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, color: null })}
                disabled={deleteColorMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteColorMutation.isPending}
              >
                {deleteColorMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminColor;
