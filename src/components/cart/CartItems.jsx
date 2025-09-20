import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, X, Tag } from "lucide-react";

/**
 * CartItems Component
 * Displays the shopping cart with items, quantities, and cart summary
 */
const CartItems = ({ onNext }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Tray Table",
      color: "Black",
      price: 19.0,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "2",
      name: "Tray Table",
      color: "Red",
      price: 19.0,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "3",
      name: "Table lamp",
      color: "Gold",
      price: 39.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("free");

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    console.log("Applying coupon:", couponCode);
    // Coupon logic here
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "express" ? 15 : 21;
  const total = subtotal + shippingCost;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        {/* Cart Table Header */}
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 mb-6">
          <div className="text-sm font-medium text-gray-900">Product</div>
          <div className="text-sm font-medium text-gray-900 text-center">
            Quantity
          </div>
          <div className="text-sm font-medium text-gray-900 text-center">
            Price
          </div>
          <div className="text-sm font-medium text-gray-900 text-center">
            Subtotal
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-6 ">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 gap-4 items-center py-4  border-b border-gray-200"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 mt-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-center font-medium">
                {formatPrice(item.price)}
              </div>

              {/* Subtotal */}
              <div className="text-center font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mt-4 pt-8 ">
          <h3 className="text-lg font-medium mb-2">Have a coupon?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Add your code for an instant cart discount
          </p>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={applyCoupon} variant="outline">
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Cart summary</h3>

            {/* Shipping Options */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={shippingMethod === "free"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Free shipping</span>
                </div>
                <span className="text-sm font-medium">$0.00</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Express shipping</span>
                </div>
                <span className="text-sm font-medium">+$15.00</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={shippingMethod === "pickup"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">Pick Up</span>
                </div>
                <span className="text-sm font-medium">%21.00</span>
              </label>
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              onClick={onNext}
              className="w-full mt-6 bg-black text-white hover:bg-gray-800"
            >
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartItems;
