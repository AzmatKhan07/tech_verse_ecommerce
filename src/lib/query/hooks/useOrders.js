import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ordersService from "@/lib/api/services/orders";

// Hook to fetch user's orders
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getMyOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch all orders (admin) with filtering and pagination
export const useAdminOrders = (params = {}) => {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => ordersService.getAllOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch specific order details
export const useOrderDetails = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, statusData }) =>
      ordersService.updateOrderStatus(orderId, statusData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });
};
