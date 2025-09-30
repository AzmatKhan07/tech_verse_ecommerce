import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sizeService } from "../../api/services/size";

// Query Keys
export const sizeKeys = {
  all: ["sizes"],
  lists: () => [...sizeKeys.all, "list"],
  list: (filters) => [...sizeKeys.lists(), { filters }],
  details: () => [...sizeKeys.all, "detail"],
  detail: (id) => [...sizeKeys.details(), id],
  search: (searchTerm) => [...sizeKeys.all, "search", searchTerm],
  active: () => [...sizeKeys.all, "active"],
};

// Get all sizes with pagination, search, and ordering
export const useSizes = (params = {}) => {
  return useQuery({
    queryKey: sizeKeys.list(params),
    queryFn: () => sizeService.getSizes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single size by ID
export const useSize = (id) => {
  return useQuery({
    queryKey: sizeKeys.detail(id),
    queryFn: () => sizeService.getSize(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search sizes
export const useSearchSizes = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: sizeKeys.search(searchTerm),
    queryFn: () => sizeService.searchSizes(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active sizes only
export const useActiveSizes = (params = {}) => {
  return useQuery({
    queryKey: sizeKeys.active(params),
    queryFn: () => sizeService.getActiveSizes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create size mutation
export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sizeData) => sizeService.createSize(sizeData),
    onSuccess: (newSize) => {
      console.log("✅ Size created successfully:", newSize);

      // Invalidate and refetch size lists
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sizeKeys.active() });

      // Add the new size to the cache
      queryClient.setQueryData(sizeKeys.detail(newSize.id), newSize);
    },
    onError: (error) => {
      console.error("❌ Error creating size:", error);
    },
  });
};

// Update size mutation (PUT - full update)
export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sizeData }) => sizeService.updateSize(id, sizeData),
    onSuccess: (updatedSize, variables) => {
      console.log("✅ Size updated successfully:", updatedSize);

      // Invalidate and refetch size lists
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sizeKeys.active() });

      // Update the specific size in cache
      queryClient.setQueryData(sizeKeys.detail(variables.id), updatedSize);
    },
    onError: (error) => {
      console.error("❌ Error updating size:", error);
    },
  });
};

// Patch size mutation (PATCH - partial update)
export const usePatchSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sizeData }) => sizeService.patchSize(id, sizeData),
    onSuccess: (updatedSize, variables) => {
      console.log("✅ Size patched successfully:", updatedSize);

      // Invalidate and refetch size lists
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sizeKeys.active() });

      // Update the specific size in cache
      queryClient.setQueryData(sizeKeys.detail(variables.id), updatedSize);
    },
    onError: (error) => {
      console.error("❌ Error patching size:", error);
    },
  });
};

// Delete size mutation
export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => sizeService.deleteSize(id),
    onSuccess: (deletedSize, id) => {
      console.log("✅ Size deleted successfully:", id);

      // Invalidate and refetch size lists
      queryClient.invalidateQueries({ queryKey: sizeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sizeKeys.active() });

      // Remove the size from cache
      queryClient.removeQueries({ queryKey: sizeKeys.detail(id) });
    },
    onError: (error) => {
      console.error("❌ Error deleting size:", error);
    },
  });
};
