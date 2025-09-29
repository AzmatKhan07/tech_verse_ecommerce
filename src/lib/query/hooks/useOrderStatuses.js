import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderStatusService from "../../api/services/orderStatus";

// Query keys for consistent caching
export const orderStatusKeys = {
  all: ["orderStatuses"],
  lists: () => [...orderStatusKeys.all, "list"],
  list: (filters) => [...orderStatusKeys.lists(), { filters }],
  details: () => [...orderStatusKeys.all, "detail"],
  detail: (id) => [...orderStatusKeys.details(), id],
};

// Hook to fetch order statuses with filters and pagination
export const useOrderStatuses = (params = {}) => {
  return useQuery({
    queryKey: orderStatusKeys.list(params),
    queryFn: () => orderStatusService.getOrderStatuses(params),
    keepPreviousData: true, // Keep previous data while fetching new data
    select: (data) => {
      // The OrderStatusService already transforms the data, so we can return it as-is
      return data;
    },
  });
};

// Hook to fetch a single order status
export const useOrderStatus = (id) => {
  return useQuery({
    queryKey: orderStatusKeys.detail(id),
    queryFn: () => orderStatusService.getOrderStatus(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to search order statuses
export const useSearchOrderStatuses = (searchTerm, filters = {}) => {
  return useQuery({
    queryKey: orderStatusKeys.list({ search: searchTerm, ...filters }),
    queryFn: () => orderStatusService.searchOrderStatuses(searchTerm, filters),
    enabled: !!searchTerm, // Only run query if searchTerm exists
    keepPreviousData: true,
  });
};

// Mutation hooks for CRUD operations

// Hook to create an order status
export const useCreateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderStatusData) =>
      orderStatusService.createOrderStatus(orderStatusData),
    onSuccess: (newOrderStatus) => {
      // Invalidate and refetch order statuses list
      queryClient.invalidateQueries({ queryKey: orderStatusKeys.lists() });

      // Add the new order status to the cache
      queryClient.setQueryData(
        orderStatusKeys.detail(newOrderStatus.id),
        newOrderStatus
      );
    },
    onError: (error) => {
      console.error("Error creating order status:", error);
    },
  });
};

// Hook to update an order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      orderStatusService.updateOrderStatus(id, data),
    onSuccess: (updatedOrderStatus, variables) => {
      // Update the specific order status in cache
      queryClient.setQueryData(
        orderStatusKeys.detail(variables.id),
        updatedOrderStatus
      );

      // Invalidate order statuses list to refetch
      queryClient.invalidateQueries({ queryKey: orderStatusKeys.lists() });
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
    },
  });
};

// Hook to partially update an order status
export const usePatchOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => orderStatusService.patchOrderStatus(id, data),
    onSuccess: (updatedOrderStatus, variables) => {
      // Update the specific order status in cache
      queryClient.setQueryData(
        orderStatusKeys.detail(variables.id),
        updatedOrderStatus
      );

      // Invalidate order statuses list to refetch
      queryClient.invalidateQueries({ queryKey: orderStatusKeys.lists() });
    },
    onError: (error) => {
      console.error("Error patching order status:", error);
    },
  });
};

// Hook to delete an order status
export const useDeleteOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => orderStatusService.deleteOrderStatus(id),
    onSuccess: (_, deletedId) => {
      // Remove the order status from cache
      queryClient.removeQueries({
        queryKey: orderStatusKeys.detail(deletedId),
      });

      // Invalidate order statuses list to refetch
      queryClient.invalidateQueries({ queryKey: orderStatusKeys.lists() });
    },
    onError: (error) => {
      console.error("Error deleting order status:", error);
    },
  });
};
