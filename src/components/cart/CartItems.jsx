import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, X, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

/**
 * CartItems Component
 * Displays the shopping cart with items, quantities, and cart summary
 */
const CartItems = ({ onNext }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("free");

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

  const subtotal = cartTotal;
  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "express" ? 15 : 21;
  const total = subtotal + shippingCost;

  // Handle empty cart
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button
            onClick={() => navigate("/shop")}
            className="bg-black text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

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
                  alt={item.alt || item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
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
