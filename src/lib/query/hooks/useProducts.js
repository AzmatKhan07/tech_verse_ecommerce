import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "../../api/services/product";

// Query keys for consistent caching
export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
};

// Hook to fetch products with filters and pagination
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    keepPreviousData: true, // Keep previous data while fetching new data
    select: (data) => {
      // The ProductService already transforms the data, so we can return it as-is
      return data;
    },
  });
};

// Hook to fetch a single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to search products
export const useSearchProducts = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: productKeys.list({ search: searchTerm, ...filters }),
    queryFn: () => productService.searchProducts(searchTerm, filters),
    enabled: !!searchTerm, // Only run query if searchTerm exists
    keepPreviousData: true,
  });
};

// Hook to fetch featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: productKeys.list({ is_featured: true }),
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes - featured products don't change often
  });
};

// Hook to fetch discounted products
export const useDiscountedProducts = () => {
  return useQuery({
    queryKey: productKeys.list({ is_discounted: true }),
    queryFn: () => productService.getDiscountedProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch trending products
export const useTrendingProducts = () => {
  return useQuery({
    queryKey: productKeys.list({ is_tranding: true }),
    queryFn: () => productService.getTrendingProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch products by category
export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: productKeys.list({ category: categoryId }),
    queryFn: () => productService.getProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

// Hook to fetch products by brand
export const useProductsByBrand = (brandId) => {
  return useQuery({
    queryKey: productKeys.list({ brand: brandId }),
    queryFn: () => productService.getProductsByBrand(brandId),
    enabled: !!brandId,
  });
};

// Mutation hooks for CRUD operations

// Hook to create a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      // Add the new product to the cache
      queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
};

// Hook to update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => productService.updateProduct(slug, data),
    onSuccess: (updatedProduct, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(variables.slug),
        updatedProduct
      );

      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
};

// Hook to partially update a product
export const usePatchProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => productService.patchProduct(slug, data),
    onSuccess: (updatedProduct, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(variables.slug),
        updatedProduct
      );

      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      console.error("Error patching product:", error);
    },
  });
};

// Hook to delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });

      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });
};
