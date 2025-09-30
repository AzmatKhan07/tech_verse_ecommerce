import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bannerService from "../../api/services/banner";

// Query keys for consistent caching
export const bannerKeys = {
  all: ["banners"],
  lists: () => [...bannerKeys.all, "list"],
  list: (filters) => [...bannerKeys.lists(), { filters }],
  details: () => [...bannerKeys.all, "detail"],
  detail: (id) => [...bannerKeys.details(), id],
};

// Hook to fetch banners with filters and pagination
export const useBanners = (params = {}) => {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => bannerService.getBanners(params),
    keepPreviousData: true, // Keep previous data while fetching new data
    select: (data) => {
      // The BannerService already transforms the data, so we can return it as-is
      return data;
    },
  });
};

// Hook to fetch a single banner
export const useBanner = (id) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerService.getBanner(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to search banners
export const useSearchBanners = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: bannerKeys.list({ search: searchTerm, ...filters }),
    queryFn: () => bannerService.searchBanners(searchTerm, filters),
    enabled: !!searchTerm, // Only run query if searchTerm exists
    keepPreviousData: true,
  });
};

// Hook to fetch active banners
export const useActiveBanners = () => {
  return useQuery({
    queryKey: bannerKeys.list({ status: true }),
    queryFn: () => bannerService.getActiveBanners(),
    staleTime: 10 * 60 * 1000, // 10 minutes - banners don't change often
  });
};

// Mutation hooks for CRUD operations

// Hook to create a banner
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bannerData) => bannerService.createBanner(bannerData),
    onSuccess: (newBanner) => {
      // Invalidate and refetch banners list
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });

      // Add the new banner to the cache
      queryClient.setQueryData(bannerKeys.detail(newBanner.id), newBanner);
    },
    onError: (error) => {
      console.error("Error creating banner:", error);
    },
  });
};

// Hook to update a banner
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => bannerService.updateBanner(id, data),
    onSuccess: (updatedBanner, variables) => {
      // Update the specific banner in cache
      queryClient.setQueryData(bannerKeys.detail(variables.id), updatedBanner);

      // Invalidate banners list to refetch
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating banner:", error);
    },
  });
};

// Hook to partially update a banner
export const usePatchBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => bannerService.patchBanner(id, data),
    onSuccess: (updatedBanner, variables) => {
      // Update the specific banner in cache
      queryClient.setQueryData(bannerKeys.detail(variables.id), updatedBanner);

      // Invalidate banners list to refetch
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
    onError: (error) => {
      console.error("Error patching banner:", error);
    },
  });
};

// Hook to delete a banner
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => bannerService.deleteBanner(id),
    onSuccess: (_, deletedId) => {
      // Remove the banner from cache
      queryClient.removeQueries({ queryKey: bannerKeys.detail(deletedId) });

      // Invalidate banners list to refetch
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting banner:", error);
    },
  });
};
