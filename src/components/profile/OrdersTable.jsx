import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrdersTable = ({ orders }) => {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-600 mb-6">
          Your order history will appear here once you make your first purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-900">Number ID</div>
        <div className="text-sm font-medium text-gray-900">Dates</div>
        <div className="text-sm font-medium text-gray-900">Status</div>
        <div className="text-sm font-medium text-gray-900 text-right">
          Price
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
          >
            {/* Number ID */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {order.displayId || order.id}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <span className="text-sm text-gray-600">{order.date}</span>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Price */}
            <div className="flex items-center justify-end">
              <span className="text-sm font-semibold text-gray-900">
                {formatPrice(order.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;
