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
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (err) {
        console.error("Error deleting product:", err);
        // Error is already handled by the mutation
      }
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-pink-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-600">New Arrival</p>
                  <p className="text-xl font-bold">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      products.filter((p) => p.is_arrival).length
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
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {/* Featured Filter */}
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All Featured</option>
                <option value="Yes">Featured</option>
                <option value="No">Not Featured</option>
              </select>

              {/* Promo Filter */}
              <select
                value={filterPromo}
                onChange={(e) => setFilterPromo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All Promo</option>
                <option value="Yes">Promo</option>
                <option value="No">Not Promo</option>
              </select>

              {/* Discounted Filter */}
              <select
                value={filterDiscounted}
                onChange={(e) => setFilterDiscounted(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All Discounted</option>
                <option value="Yes">Discounted</option>
                <option value="No">Not Discounted</option>
              </select>

              {/* Trending Filter */}
              <select
                value={filterTrending}
                onChange={(e) => setFilterTrending(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All Trending</option>
                <option value="Yes">Trending</option>
                <option value="No">Not Trending</option>
              </select>

              {/* New Arrival Filter */}
              <select
                value={filterArrival}
                onChange={(e) => setFilterArrival(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="All">All New Arrival</option>
                <option value="Yes">New Arrival</option>
                <option value="No">Not New Arrival</option>
              </select>
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
                        Model
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
                        <td className="py-4 px-4 text-gray-600">
                          {product.model || "N/A"}
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
                              onClick={() => handleDeleteProduct(product.id)}
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
                  products
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
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
