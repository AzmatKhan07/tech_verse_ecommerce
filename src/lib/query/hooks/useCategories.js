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
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory, variables) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(variables.id),
        updatedCategory
      );

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
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
    mutationFn: ({ id, data }) => categoryService.patchCategory(id, data),
    onSuccess: (updatedCategory, variables) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(variables.id),
        updatedCategory
      );

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
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
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });

      // Invalidate categories list to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};
