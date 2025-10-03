import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TaxForm from "@/components/admin/TaxForm";
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
  useTaxes,
  useCreateTax,
  useUpdateTax,
  usePatchTax,
  useDeleteTax,
} from "@/lib/query/hooks/useTaxes";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Receipt,
  TrendingUp,
  Activity,
  Percent,
  DollarSign,
} from "lucide-react";

const AdminTaxes = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("All");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, tax: null });
  const { toast } = useToast();

  // API hooks
  const {
    data: taxesData,
    isLoading,
    error,
    refetch,
  } = useTaxes({
    search: searchTerm || undefined,
    ordering: "tax_desc",
    page_size: 50,
  });

  const createTaxMutation = useCreateTax();
  const updateTaxMutation = useUpdateTax();
  const patchTaxMutation = usePatchTax();
  const deleteTaxMutation = useDeleteTax();

  // Filter taxes based on status
  const filteredTaxes =
    taxesData?.filter((tax) => {
      if (filterActive === "All") return true;
      if (filterActive === "Active") return tax.status;
      if (filterActive === "Inactive") return !tax.status;
      return true;
    }) || [];

  // Statistics
  const totalTaxes = taxesData?.length || 0;
  const activeTaxes = taxesData?.filter((tax) => tax.status).length || 0;
  const inactiveTaxes = totalTaxes - activeTaxes;

  const handleCreateTax = () => {
    setEditingTax(null);
    setShowForm(true);
  };

  const handleEditTax = (tax) => {
    setEditingTax(tax);
    setShowForm(true);
  };

  const handleDeleteTax = (tax) => {
    setDeleteDialog({ open: true, tax });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.tax) return;

    try {
      await deleteTaxMutation.mutateAsync(deleteDialog.tax.id);
      toast({
        title: "Tax Deleted",
        description: `${deleteDialog.tax.tax_desc} has been deleted successfully.`,
        variant: "default",
      });
      setDeleteDialog({ open: false, tax: null });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tax",
        variant: "destructive",
      });
    }
  };

  const handleToggleTax = async (tax) => {
    try {
      await patchTaxMutation.mutateAsync({
        id: tax.id,
        taxData: { status: !tax.status },
      });
      toast({
        title: "Tax Status Updated",
        description: `${tax.tax_desc} has been ${
          !tax.status ? "activated" : "deactivated"
        }.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update tax status",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTax) {
        await updateTaxMutation.mutateAsync({
          id: editingTax.id,
          taxData: formData,
        });
        toast({
          title: "Tax Updated",
          description: `${formData.tax_desc} has been updated successfully.`,
          variant: "default",
        });
      } else {
        await createTaxMutation.mutateAsync(formData);
        toast({
          title: "Tax Created",
          description: `${formData.tax_desc} has been created successfully.`,
          variant: "default",
        });
      }
      setShowForm(false);
      setEditingTax(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save tax",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTax(null);
  };

  // Helper function to get tax type icon
  const getTaxTypeIcon = (taxValue) => {
    // Check if it's a percentage (typically values <= 100 and not negative)
    const numValue = parseFloat(taxValue);
    if (numValue <= 100 && numValue >= 0) {
      return <Percent className="h-4 w-4 text-blue-600" />;
    }
    return <DollarSign className="h-4 w-4 text-green-600" />;
  };

  // Helper function to format tax value for display
  const formatTaxValue = (taxValue) => {
    const numValue = parseFloat(taxValue);
    if (numValue <= 100 && numValue >= 0) {
      return `${numValue}%`;
    }
    return `$${numValue}`;
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Taxes
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
            <h1 className="text-3xl font-bold text-gray-900">Tax Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your tax rates and descriptions
            </p>
          </div>
          <Button onClick={handleCreateTax} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Tax
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Taxes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTaxes}
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
                    Active Taxes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeTaxes}
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
                    Inactive Taxes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inactiveTaxes}
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
                    Active Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTaxes > 0
                      ? Math.round((activeTaxes / totalTaxes) * 100)
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
                  placeholder="Search taxes..."
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

        {/* Taxes List */}
        <Card>
          <CardHeader>
            <CardTitle>Taxes ({filteredTaxes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading taxes...</p>
              </div>
            ) : filteredTaxes.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No taxes found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterActive !== "All"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first tax"}
                </p>
                {!searchTerm && filterActive === "All" && (
                  <Button onClick={handleCreateTax}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tax
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTaxes.map((tax) => (
                  <Card key={tax.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getTaxTypeIcon(tax.tax_value)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {tax.tax_desc}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg font-bold text-blue-600">
                                {formatTaxValue(tax.tax_value)}
                              </span>
                            </div>
                            <Badge
                              variant={tax.status ? "default" : "secondary"}
                            >
                              {tax.status ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTax(tax)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTax(tax)}
                          >
                            {tax.status ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTax(tax)}
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

        {/* Tax Form Dialog */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTax ? "Edit Tax" : "Create New Tax"}
                </DialogTitle>
                <DialogDescription>
                  {editingTax
                    ? "Update the tax information below."
                    : "Fill in the details to create a new tax."}
                </DialogDescription>
              </DialogHeader>
              <TaxForm
                tax={editingTax}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={
                  createTaxMutation.isPending || updateTaxMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, tax: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tax</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{deleteDialog.tax?.tax_desc}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, tax: null })}
                disabled={deleteTaxMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteTaxMutation.isPending}
              >
                {deleteTaxMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTaxes;
