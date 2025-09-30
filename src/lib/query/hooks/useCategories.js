import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryService from "../../api/services/category";

// Query keys for consistent caching
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

// Hook to fetch categories with filters and pagination
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getCategories(params),
    keepPreviousData: true, // Keep previous data while fetching new data
    select: (data) => {
      // Transform the data if needed
      return {
        categories: data.results || data,
        pagination: {
          count: data.count || data.length,
          totalPages:
            data.total_pages ||
            Math.ceil((data.count || data.length) / (params.page_size || 20)),
          currentPage: params.page || 1,
          hasNext: !!data.next,
          hasPrevious: !!data.previous,
        },
      };
    },
  });
};

// Hook to fetch a single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to search categories
export const useSearchCategories = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: categoryKeys.list({ search: searchTerm, ...filters }),
    queryFn: () => categoryService.searchCategories(searchTerm, filters),
    enabled: !!searchTerm, // Only run query if searchTerm exists
    keepPreviousData: true,
  });
};

// Hook to fetch active categories only
export const useActiveCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list({ is_active: true }),
    queryFn: () => categoryService.getActiveCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  });
};

// Mutation hooks for CRUD operations

// Hook to create a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => categoryService.createCategory(categoryData),
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

      // Add the new category to the cache
      queryClient.setQueryData(
        categoryKeys.detail(newCategory.id),
        newCategory
      );
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });
};

// Hook to update a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => categoryService.updateCategory(slug, data),
    onSuccess: (updatedCategory, variables) => {
      // Since we can't use slug as cache key, invalidate all detail queries
      queryClient.removeQueries({ queryKey: categoryKeys.details() });

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Invalidate KPIs to refetch updated statistics
      queryClient.invalidateQueries({
        queryKey: [...categoryKeys.all, "kpis"],
      });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

// Hook to partially update a category
export const usePatchCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }) => categoryService.patchCategory(slug, data),
    onSuccess: (updatedCategory, variables) => {
      // Since we can't use slug as cache key, invalidate all detail queries
      queryClient.removeQueries({ queryKey: categoryKeys.details() });

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Invalidate KPIs to refetch updated statistics
      queryClient.invalidateQueries({
        queryKey: [...categoryKeys.all, "kpis"],
      });
    },
    onError: (error) => {
      console.error("Error patching category:", error);
    },
  });
};

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug) => categoryService.deleteCategory(slug),
    onSuccess: (_, deletedSlug) => {
      // Remove the category from cache (we can't use slug as key, so invalidate all)
      queryClient.removeQueries({ queryKey: categoryKeys.details() });

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Invalidate KPIs to refetch updated statistics
      queryClient.invalidateQueries({
        queryKey: [...categoryKeys.all, "kpis"],
      });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};

// Hook to fetch category KPIs/statistics
export const useCategoryKPIs = () => {
  return useQuery({
    queryKey: [...categoryKeys.all, "kpis"],
    queryFn: () => categoryService.getCategoryKPIs(),
    staleTime: 5 * 60 * 1000, // 5 minutes - KPIs don't change frequently
    refetchOnWindowFocus: false, // Don't refetch on window focus for KPIs
  });
};
