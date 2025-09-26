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
  Package,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useProducts, useDeleteProduct } from "@/lib/query/hooks/useProducts";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterFeatured, setFilterFeatured] = useState("All");
  const [filterPromo, setFilterPromo] = useState("All");
  const [filterDiscounted, setFilterDiscounted] = useState("All");
  const [filterTrending, setFilterTrending] = useState("All");
  const [filterArrival, setFilterArrival] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // TanStack Query hooks
  const deleteProductMutation = useDeleteProduct();

  // Build query parameters
  const queryParams = {
    page: currentPage,
    page_size: 20,
    ...(searchTerm && { search: searchTerm }),
    ...(filterCategory !== "All" && { category: filterCategory }),
    ...(filterBrand !== "All" && { brand: filterBrand }),
    ...(filterFeatured !== "All" && { is_featured: filterFeatured === "Yes" }),
    ...(filterPromo !== "All" && { is_promo: filterPromo === "Yes" }),
    ...(filterDiscounted !== "All" && {
      is_discounted: filterDiscounted === "Yes",
    }),
    ...(filterTrending !== "All" && { is_tranding: filterTrending === "Yes" }),
    ...(filterArrival !== "All" && { is_arrival: filterArrival === "Yes" }),
  };

  const {
    data: productsData,
    isLoading: loading,
    error,
    refetch,
  } = useProducts(queryParams);

  // Extract data from the query result
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {
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
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "low stock":
        return "bg-orange-100 text-orange-800";
      case "out of stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (attributes) => {
    if (!attributes || attributes.length === 0) {
      return "No pricing";
    }

    const prices = attributes
      .map((attr) => parseFloat(attr.price))
      .filter((price) => !isNaN(price));
    if (prices.length === 0) {
      return "No pricing";
    }

    console.log(prices);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(minPrice);
    }

    return `${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(minPrice)} - ${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(maxPrice)}`;
  };

  const getTotalStock = (attributes) => {
    if (!attributes || attributes.length === 0) {
      return 0;
    }

    return attributes.reduce((total, attr) => {
      const qty = parseInt(attr.qty) || 0;
      return total + qty;
    }, 0);
  };

  // Get unique categories and brands from products
  const categories = [
    "All",
    ...new Set(
      products.map((product) => product.category_name).filter(Boolean)
    ),
  ];

  const brands = [
    "All",
    ...new Set(products.map((product) => product.brand_name).filter(Boolean)),
  ];

  // Handle product deletion
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Confirm product deletion
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.slug);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      // Error is already handled by the mutation
    }
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
              Products
            </h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={() => navigate("/admin/add-product")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-xl font-bold">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      totalCount
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
                  <p className="text-sm text-gray-600">Featured</p>
                  <p className="text-xl font-bold">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      products.filter((p) => p.is_featured).length
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">Promo</p>
                  <p className="text-xl font-bold">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      products.filter((p) => p.is_promo).length
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
                  <p className="text-sm text-gray-600">Discounted</p>
                  <p className="text-xl font-bold">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      products.filter((p) => p.is_discounted).length
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Brand Filter */}
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {/* Featured Filter */}
              <Select value={filterFeatured} onValueChange={setFilterFeatured}>
                <SelectTrigger>
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Featured</SelectItem>
                  <SelectItem value="Yes">Featured</SelectItem>
                  <SelectItem value="No">Not Featured</SelectItem>
                </SelectContent>
              </Select>

              {/* Promo Filter */}
              <Select value={filterPromo} onValueChange={setFilterPromo}>
                <SelectTrigger>
                  <SelectValue placeholder="Promo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Promo</SelectItem>
                  <SelectItem value="Yes">Promo</SelectItem>
                  <SelectItem value="No">Not Promo</SelectItem>
                </SelectContent>
              </Select>

              {/* Discounted Filter */}
              <Select
                value={filterDiscounted}
                onValueChange={setFilterDiscounted}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Discounted" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Discounted</SelectItem>
                  <SelectItem value="Yes">Discounted</SelectItem>
                  <SelectItem value="No">Not Discounted</SelectItem>
                </SelectContent>
              </Select>

              {/* Trending Filter */}
              <Select value={filterTrending} onValueChange={setFilterTrending}>
                <SelectTrigger>
                  <SelectValue placeholder="Trending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Trending</SelectItem>
                  <SelectItem value="Yes">Trending</SelectItem>
                  <SelectItem value="No">Not Trending</SelectItem>
                </SelectContent>
              </Select>

              {/* New Arrival Filter */}
              <Select value={filterArrival} onValueChange={setFilterArrival}>
                <SelectTrigger>
                  <SelectValue placeholder="New Arrival" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All New Arrival</SelectItem>
                  <SelectItem value="Yes">New Arrival</SelectItem>
                  <SelectItem value="No">Not New Arrival</SelectItem>
                </SelectContent>
              </Select>
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
                    "Failed to fetch products. Please try again."}
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

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products List ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading products...</span>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Brand
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Category
                      </th>

                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Price Range
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Flags
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder-product.jpg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "/placeholder-product.jpg";
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {product.short_desc}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {product.brand_name || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {product.category_name || "N/A"}
                        </td>

                        <td className="py-4 px-4 font-medium">
                          {formatPrice(product.attributes)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {getTotalStock(product.attributes)}
                            </span>
                            <span className="text-xs text-gray-500">units</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              product.status
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {product.status ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {product.is_featured && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Featured
                              </Badge>
                            )}
                            {product.is_promo && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                Promo
                              </Badge>
                            )}
                            {product.is_discounted && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Discounted
                              </Badge>
                            )}
                            {product.is_tranding && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                Trending
                              </Badge>
                            )}
                            {product.is_arrival && (
                              <Badge className="bg-pink-100 text-pink-800 text-xs">
                                New Arrival
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                navigate(`/admin/edit-product/${product.slug}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={deleteProductMutation.isPending}
                            >
                              {deleteProductMutation.isPending ? (
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

                {products.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    No products found matching your criteria.
                  </div>
                )}

                {/* Pagination */}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {/* Show page numbers */}
                      {totalPages > 0 &&
                        Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => {
                            // For single page, just show the page number
                            if (totalPages === 1) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={page === currentPage}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }

                            // For multiple pages, show first page, last page, current page, and pages around current page
                            const shouldShow =
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1);

                            if (!shouldShow) {
                              // Show ellipsis for gaps
                              if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                              ) {
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                );
                              }
                              return null;
                            }

                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={page === currentPage}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {productToDelete?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {productToDelete?.brand_name} •{" "}
                    {productToDelete?.category_name}
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Are you sure you want to delete this product? This action cannot
                be undone.
                {productToDelete?.attributes?.length > 0 && (
                  <span className="block mt-2 text-red-600 font-medium">
                    ⚠️ This product has {productToDelete.attributes.length}{" "}
                    variant(s) and {getTotalStock(productToDelete.attributes)}{" "}
                    units in stock.
                  </span>
                )}
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                  }}
                  className="flex-1"
                  disabled={deleteProductMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDeleteProduct}
                  className="flex-1"
                  disabled={deleteProductMutation.isPending}
                >
                  {deleteProductMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Product"
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

export default AdminProducts;
