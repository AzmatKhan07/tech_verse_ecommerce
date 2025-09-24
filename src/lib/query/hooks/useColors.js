import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colorService } from "../../api/services/color";

// Query Keys
export const colorKeys = {
  all: ["colors"],
  lists: () => [...colorKeys.all, "list"],
  list: (filters) => [...colorKeys.lists(), { filters }],
  details: () => [...colorKeys.all, "detail"],
  detail: (id) => [...colorKeys.details(), id],
  search: (searchTerm) => [...colorKeys.all, "search", searchTerm],
  active: () => [...colorKeys.all, "active"],
};

// Get all colors with pagination, search, and ordering
export const useColors = (params = {}) => {
  return useQuery({
    queryKey: colorKeys.list(params),
    queryFn: () => colorService.getColors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single color by ID
export const useColor = (id) => {
  return useQuery({
    queryKey: colorKeys.detail(id),
    queryFn: () => colorService.getColor(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search colors
export const useSearchColors = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: colorKeys.search(searchTerm),
    queryFn: () => colorService.searchColors(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active colors only
export const useActiveColors = (params = {}) => {
  return useQuery({
    queryKey: colorKeys.active(params),
    queryFn: () => colorService.getActiveColors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create color mutation
export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (colorData) => colorService.createColor(colorData),
    onSuccess: (newColor) => {
      console.log("✅ Color created successfully:", newColor);

      // Invalidate and refetch color lists
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: colorKeys.active() });

      // Add the new color to the cache
      queryClient.setQueryData(colorKeys.detail(newColor.id), newColor);
    },
    onError: (error) => {
      console.error("❌ Error creating color:", error);
    },
  });
};

// Update color mutation (PUT - full update)
export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, colorData }) => colorService.updateColor(id, colorData),
    onSuccess: (updatedColor, variables) => {
      console.log("✅ Color updated successfully:", updatedColor);

      // Invalidate and refetch color lists
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: colorKeys.active() });

      // Update the specific color in cache
      queryClient.setQueryData(colorKeys.detail(variables.id), updatedColor);
    },
    onError: (error) => {
      console.error("❌ Error updating color:", error);
    },
  });
};

// Patch color mutation (PATCH - partial update)
export const usePatchColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, colorData }) => colorService.patchColor(id, colorData),
    onSuccess: (updatedColor, variables) => {
      console.log("✅ Color patched successfully:", updatedColor);

      // Invalidate and refetch color lists
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: colorKeys.active() });

      // Update the specific color in cache
      queryClient.setQueryData(colorKeys.detail(variables.id), updatedColor);
    },
    onError: (error) => {
      console.error("❌ Error patching color:", error);
    },
  });
};

// Delete color mutation
export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => colorService.deleteColor(id),
    onSuccess: (deletedColor, id) => {
      console.log("✅ Color deleted successfully:", id);

      // Invalidate and refetch color lists
      queryClient.invalidateQueries({ queryKey: colorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: colorKeys.active() });

      // Remove the color from cache
      queryClient.removeQueries({ queryKey: colorKeys.detail(id) });
    },
    onError: (error) => {
      console.error("❌ Error deleting color:", error);
    },
  });
};
