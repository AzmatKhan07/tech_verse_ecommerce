import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * OrderComplete Component
 * Displays the order completion confirmation with order details
 */
const OrderComplete = ({
  onContinueShopping,
  orderData = null,
  orderId = null,
  paymentMethod = "Credit Card",
}) => {
  // Default fallback data if no order data is provided
  const defaultOrderData = {
    orderNumber: orderId ? `#${orderId}` : "#0000_00000",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    total: 0,
    paymentMethod: paymentMethod,
    items: [],
  };

  // Use provided order data or fallback to default
  const order = orderData || defaultOrderData;

  const formatPrice = (amount) => {
    return `${amount?.toLocaleString()} PKR`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Message */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete!</h2>
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <p className="text-lg text-gray-700 mb-2">Thank you!</p>
        <p className="text-gray-600">Your order has been received</p>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
          {order.items.map((item, index) => (
            <div key={item.id || index} className="relative">
              <img
                src={
                  item.image ||
                  item.product_attr_id?.attr_image ||
                  "/placeholder-product.jpg"
                }
                alt={item.name || item.product_name || "Product"}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
              />
              {item.quantity > 1 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order Details */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-gray-600 mb-1">Order code:</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Date:</p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600 mb-1">Total:</p>
              <p className="font-medium">{formatPrice(order.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Payment method:</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Shopping Button */}
      <Button
        onClick={onContinueShopping}
        className="bg-black text-white hover:bg-gray-800 px-8 py-3"
      >
        Purchase history
      </Button>
    </div>
  );
};

export default OrderComplete;
