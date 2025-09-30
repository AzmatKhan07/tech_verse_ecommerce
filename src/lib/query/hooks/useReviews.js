import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewService from "@/lib/api/services/review";

// Query keys for reviews
export const reviewKeys = {
  all: ["reviews"],
  lists: () => [...reviewKeys.all, "list"],
  list: (productId, params) => [...reviewKeys.lists(), productId, params],
  details: () => [...reviewKeys.all, "detail"],
  detail: (id) => [...reviewKeys.details(), id],
};

// Get reviews for a specific product
export const useProductReviews = (productId, params = {}, options = {}) => {
  return useQuery({
    queryKey: reviewKeys.list(productId, params),
    queryFn: () => reviewService.getProductReviews(productId, params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!productId, // Only fetch when productId is provided
    ...options,
  });
};

// Create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => reviewService.createReview(reviewData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the specific product
      const productId = variables.product;
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });

      // Also invalidate all review lists to ensure consistency
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to create review:", error);
    },
  });
};

// Update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      reviewService.updateReview(reviewId, reviewData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the specific product
      const productId = data.product;
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productId),
      });

      // Also invalidate the specific review detail
      queryClient.invalidateQueries({
        queryKey: reviewKeys.detail(variables.reviewId),
      });

      // Invalidate all review lists
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to update review:", error);
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the specific product
      // Note: We need to get the product ID from the deleted review data
      if (data && data.product) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.list(data.product),
        });
      }

      // Remove the specific review from cache
      queryClient.removeQueries({
        queryKey: reviewKeys.detail(variables),
      });

      // Invalidate all review lists
      queryClient.invalidateQueries({
        queryKey: reviewKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
    },
  });
};
