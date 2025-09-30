import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "../../api/services/brand";

// Query Keys
export const brandKeys = {
  all: ["brands"],
  lists: () => [...brandKeys.all, "list"],
  list: (filters) => [...brandKeys.lists(), { filters }],
  details: () => [...brandKeys.all, "detail"],
  detail: (id) => [...brandKeys.details(), id],
  search: (searchTerm) => [...brandKeys.all, "search", searchTerm],
  active: () => [...brandKeys.all, "active"],
};

// Get all brands with pagination, search, and ordering
export const useBrands = (params = {}) => {
  return useQuery({
    queryKey: brandKeys.list(params),
    queryFn: () => brandService.getBrands(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single brand by ID
export const useBrand = (id) => {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrand(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search brands
export const useSearchBrands = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: brandKeys.search(searchTerm),
    queryFn: () => brandService.searchBrands(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active brands only
export const useActiveBrands = (params = {}) => {
  return useQuery({
    queryKey: brandKeys.active(params),
    queryFn: () => brandService.getActiveBrands(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create brand mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandData) => brandService.createBrand(brandData),
    onSuccess: (newBrand) => {
      console.log("✅ Brand created successfully:", newBrand);

      // Invalidate and refetch brand lists
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });

      // Add the new brand to the cache
      queryClient.setQueryData(brandKeys.detail(newBrand.id), newBrand);
    },
    onError: (error) => {
      console.error("❌ Error creating brand:", error);
    },
  });
};

// Update brand mutation (PUT - full update)
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, brandData }) => brandService.updateBrand(id, brandData),
    onSuccess: (updatedBrand, variables) => {
      console.log("✅ Brand updated successfully:", updatedBrand);

      // Invalidate and refetch brand lists
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });

      // Update the specific brand in cache
      queryClient.setQueryData(brandKeys.detail(variables.id), updatedBrand);
    },
    onError: (error) => {
      console.error("❌ Error updating brand:", error);
    },
  });
};

// Patch brand mutation (PATCH - partial update)
export const usePatchBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, brandData }) => brandService.patchBrand(id, brandData),
    onSuccess: (updatedBrand, variables) => {
      console.log("✅ Brand patched successfully:", updatedBrand);

      // Invalidate and refetch brand lists
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });

      // Update the specific brand in cache
      queryClient.setQueryData(brandKeys.detail(variables.id), updatedBrand);
    },
    onError: (error) => {
      console.error("❌ Error patching brand:", error);
    },
  });
};

// Delete brand mutation
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => brandService.deleteBrand(id),
    onSuccess: (deletedBrand, id) => {
      console.log("✅ Brand deleted successfully:", id);

      // Invalidate and refetch brand lists
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });

      // Remove the brand from cache
      queryClient.removeQueries({ queryKey: brandKeys.detail(id) });
    },
    onError: (error) => {
      console.error("❌ Error deleting brand:", error);
    },
  });
};
