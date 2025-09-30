import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taxService } from "../../api/services/tax";

// Query Keys
export const taxKeys = {
  all: ["taxes"],
  lists: () => [...taxKeys.all, "list"],
  list: (filters) => [...taxKeys.lists(), { filters }],
  details: () => [...taxKeys.all, "detail"],
  detail: (id) => [...taxKeys.details(), id],
  search: (searchTerm) => [...taxKeys.all, "search", searchTerm],
  active: () => [...taxKeys.all, "active"],
};

// Get all taxes with pagination, search, and ordering
export const useTaxes = (params = {}) => {
  return useQuery({
    queryKey: taxKeys.list(params),
    queryFn: () => taxService.getTaxes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single tax by ID
export const useTax = (id) => {
  return useQuery({
    queryKey: taxKeys.detail(id),
    queryFn: () => taxService.getTax(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search taxes
export const useSearchTaxes = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: taxKeys.search(searchTerm),
    queryFn: () => taxService.searchTaxes(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active taxes only
export const useActiveTaxes = (params = {}) => {
  return useQuery({
    queryKey: taxKeys.active(params),
    queryFn: () => taxService.getActiveTaxes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create tax mutation
export const useCreateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taxData) => taxService.createTax(taxData),
    onSuccess: (newTax) => {
      console.log("✅ Tax created successfully:", newTax);

      // Invalidate and refetch tax lists
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxKeys.active() });

      // Add the new tax to the cache
      queryClient.setQueryData(taxKeys.detail(newTax.id), newTax);
    },
    onError: (error) => {
      console.error("❌ Error creating tax:", error);
    },
  });
};

// Update tax mutation (PUT - full update)
export const useUpdateTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taxData }) => taxService.updateTax(id, taxData),
    onSuccess: (updatedTax, variables) => {
      console.log("✅ Tax updated successfully:", updatedTax);

      // Invalidate and refetch tax lists
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxKeys.active() });

      // Update the specific tax in cache
      queryClient.setQueryData(taxKeys.detail(variables.id), updatedTax);
    },
    onError: (error) => {
      console.error("❌ Error updating tax:", error);
    },
  });
};

// Patch tax mutation (PATCH - partial update)
export const usePatchTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taxData }) => taxService.patchTax(id, taxData),
    onSuccess: (updatedTax, variables) => {
      console.log("✅ Tax patched successfully:", updatedTax);

      // Invalidate and refetch tax lists
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxKeys.active() });

      // Update the specific tax in cache
      queryClient.setQueryData(taxKeys.detail(variables.id), updatedTax);
    },
    onError: (error) => {
      console.error("❌ Error patching tax:", error);
    },
  });
};

// Delete tax mutation
export const useDeleteTax = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => taxService.deleteTax(id),
    onSuccess: (deletedTax, id) => {
      console.log("✅ Tax deleted successfully:", id);

      // Invalidate and refetch tax lists
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taxKeys.active() });

      // Remove the tax from cache
      queryClient.removeQueries({ queryKey: taxKeys.detail(id) });
    },
    onError: (error) => {
      console.error("❌ Error deleting tax:", error);
    },
  });
};
