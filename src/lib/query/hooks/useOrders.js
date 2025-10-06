import { useQuery } from "@tanstack/react-query";
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
