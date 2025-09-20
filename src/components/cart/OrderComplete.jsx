import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * OrderComplete Component
 * Displays the order completion confirmation with order details
 */
const OrderComplete = ({ onContinueShopping }) => {
  // Sample order data
  const orderData = {
    orderNumber: "#0123_45678",
    date: "October 19, 2023",
    total: 1345.0,
    paymentMethod: "Credit Card",
    items: [
      {
        id: "1",
        name: "Tray Table",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop&auto=format",
      },
      {
        id: "2",
        name: "Tray Table",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop&auto=format",
      },
      {
        id: "3",
        name: "Table lamp",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
      },
    ],
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
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
      <div className="flex justify-center items-center gap-4 mb-8">
        {orderData.items.map((item, index) => (
          <div key={item.id} className="relative">
            <img
              src={item.image}
              alt={item.name}
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

      {/* Order Details */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-gray-600 mb-1">Order code:</p>
              <p className="font-medium">{orderData.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Date:</p>
              <p className="font-medium">{orderData.date}</p>
            </div>
            <div className="text-left">
              <p className="text-gray-600 mb-1">Total:</p>
              <p className="font-medium">{formatPrice(orderData.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 mb-1">Payment method:</p>
              <p className="font-medium">{orderData.paymentMethod}</p>
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
