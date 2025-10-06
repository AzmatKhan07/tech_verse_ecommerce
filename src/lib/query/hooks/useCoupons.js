import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../api/services/coupon";

// Query Keys
export const couponKeys = {
  all: ["coupons"],
  lists: () => [...couponKeys.all, "list"],
  list: (filters) => [...couponKeys.lists(), { filters }],
  details: () => [...couponKeys.all, "detail"],
  detail: (id) => [...couponKeys.details(), id],
  search: (searchTerm) => [...couponKeys.all, "search", searchTerm],
  active: () => [...couponKeys.all, "active"],
  validation: (code, orderAmount) => [
    ...couponKeys.all,
    "validation",
    code,
    orderAmount,
  ],
};

// Get all coupons with pagination, search, and ordering
export const useCoupons = (params = {}) => {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponService.getCoupons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single coupon by ID
export const useCoupon = (id) => {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponService.getCoupon(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search coupons
export const useSearchCoupons = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: couponKeys.search(searchTerm),
    queryFn: () => couponService.searchCoupons(searchTerm, params),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get active coupons only
export const useActiveCoupons = (params = {}) => {
  return useQuery({
    queryKey: couponKeys.active(params),
    queryFn: () => couponService.getActiveCoupons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Validate coupon
export const useValidateCoupon = (code, orderAmount = 0) => {
  return useQuery({
    queryKey: couponKeys.validation(code, orderAmount),
    queryFn: () => couponService.validateCoupon(code, orderAmount),
    enabled: !!code && code.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create coupon mutation
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData) => couponService.createCoupon(couponData),
    onSuccess: (newCoupon) => {
      console.log("✅ Coupon created successfully:", newCoupon);

      // Invalidate and refetch coupon lists
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });

      // Add the new coupon to the cache
      queryClient.setQueryData(couponKeys.detail(newCoupon.id), newCoupon);
    },
    onError: (error) => {
      console.error("❌ Error creating coupon:", error);
    },
  });
};

// Update coupon mutation (PUT - full update)
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, couponData }) =>
      couponService.updateCoupon(id, couponData),
    onSuccess: (updatedCoupon, variables) => {
      console.log("✅ Coupon updated successfully:", updatedCoupon);

      // Invalidate and refetch coupon lists
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });

      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(variables.id), updatedCoupon);
    },
    onError: (error) => {
      console.error("❌ Error updating coupon:", error);
    },
  });
};

// Patch coupon mutation (PATCH - partial update)
export const usePatchCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, couponData }) =>
      couponService.patchCoupon(id, couponData),
    onSuccess: (updatedCoupon, variables) => {
      console.log("✅ Coupon patched successfully:", updatedCoupon);

      // Invalidate and refetch coupon lists
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });

      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(variables.id), updatedCoupon);
    },
    onError: (error) => {
      console.error("❌ Error patching coupon:", error);
    },
  });
};

// Delete coupon mutation
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => couponService.deleteCoupon(id),
    onSuccess: (deletedCoupon, id) => {
      console.log("✅ Coupon deleted successfully:", id);

      // Invalidate and refetch coupon lists
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });

      // Remove the coupon from cache
      queryClient.removeQueries({ queryKey: couponKeys.detail(id) });
    },
    onError: (error) => {
      console.error("❌ Error deleting coupon:", error);
    },
  });
};

// Validate coupon mutation (for real-time validation)
export const useValidateCouponMutation = () => {
  return useMutation({
    mutationFn: ({ code, orderAmount = 0 }) =>
      couponService.validateCoupon(code, orderAmount),
    onError: (error) => {
      console.error("❌ Error validating coupon:", error);
    },
  });
};
