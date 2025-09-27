import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import cartService from "../../api/services/cart";

// Query keys for cart operations
export const cartKeys = {
  all: ["cart"],
  items: (userId) => [...cartKeys.all, "items", userId],
};

// Hook to fetch cart items
export const useCartItems = (userId, options = {}) => {
  return useQuery({
    queryKey: cartKeys.items(userId),
    queryFn: () => cartService.getCartItems(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!userId, // Only fetch when userId is provided
    ...options,
  });
};

// Hook to add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartData) => cartService.addToCart(cartData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch cart items for the specific user
      const userId = variables.user_id;
      queryClient.invalidateQueries({ queryKey: cartKeys.items(userId) });
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
};

// Hook to update cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, cartData }) =>
      cartService.updateCartItem(cartItemId, cartData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch cart items for the specific user
      const userId = variables.cartData.user_id;
      queryClient.invalidateQueries({ queryKey: cartKeys.items(userId) });
    },
    onError: (error) => {
      console.error("Failed to update cart item:", error);
    },
  });
};

// Hook to delete cart item
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId) => cartService.deleteCartItem(cartItemId),
    onSuccess: () => {
      // Invalidate all cart queries since we don't have user context here
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error) => {
      console.error("Failed to delete cart item:", error);
    },
  });
};

// Hook to clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      // Invalidate all cart queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
    onError: (error) => {
      console.error("Failed to clear cart:", error);
    },
  });
};
