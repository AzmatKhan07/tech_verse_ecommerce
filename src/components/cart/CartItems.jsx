import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/lib/hooks/use-toast";
import CouponValidator from "./CouponValidator";

/**
 * CartItems Component
 * Displays the shopping cart with items, quantities, and cart summary
 */
const CartItems = ({ onNext }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    cartItems,
    cartTotal,
    cartLoading,
    cartError,
    updateQuantity,
    removeFromCart,
    discount: totalDiscount,
  } = useCart();

  const [shippingMethod, setShippingMethod] = useState("free");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      const product_attr_id = item?.product_attr_id?.id;
      await updateQuantity(product_attr_id, newQuantity);
      toast({
        title: "Cart Updated",
        description: "Item quantity updated successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const productId = item.product_id || item.id;
      await removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: "Item removed from cart successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (amount) => {
    return `${amount?.toLocaleString()} PKR`;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const mrp = item?.product_attr_id?.mrp;
    return total + mrp * item.quantity;
  }, 0);
  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "express" ? 15 : 21;

  const total = subtotal - totalDiscount + shippingCost;

  // Handle coupon application from CouponValidator
  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  // Handle loading state
  if (cartLoading) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Loading cart...
          </h3>
          <p className="text-gray-600">
            Please wait while we load your cart items.
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (cartError) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Error Loading Cart
          </h3>
          <p className="text-gray-600 mb-6">
            {cartError.message ||
              "Failed to load cart items. Please try again."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-black text-white hover:bg-gray-800"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-5 gap-4 pb-4 border-b border-gray-200 mb-6">
          <div className="text-sm font-medium text-gray-900">Product</div>
          <div className="text-sm font-medium text-gray-900 text-center">
            Quantity
          </div>
          <div className="text-sm font-medium text-gray-900 text-center">
            Unit Price
          </div>

          <div className="text-sm font-medium text-gray-900 text-center">
            Unit Discount
          </div>

          <div className="text-sm font-medium text-gray-900 text-center">
            Subtotal
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-6 ">
          {cartItems.map((item) => (
            <div
              key={item?.product_attr_id?.id}
              className="grid grid-cols-5 gap-4 items-center py-4  border-b border-gray-200"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item?.product_attr_id?.attr_image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item?.product_attr_id?.color_name && (
                    <p className="text-sm text-gray-500">
                      Color: {item?.product_attr_id?.color_name}
                    </p>
                  )}
                  <button
                    onClick={() => handleRemoveItem(item)}
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
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity - 1)
                    }
                    className="p-2 hover:bg-gray-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">
                    {item.quantity}
                  </span>
                  <button
                    disabled={item?.product_attr_id?.qty <= item?.quantity}
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity + 1)
                    }
                    className="p-2 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-center">
                <div className="font-medium">
                  {formatPrice(item?.product_attr_id?.mrp)}
                </div>
                {/* Show discount info if MRP exists and is higher than price */}
                {(() => {
                  const price = item?.product_attr_id?.price;
                  const mrp = item?.product_attr_id?.mrp;
                  const hasDiscount = mrp && mrp > price;

                  console.log(`Price check for ${item.name}:`, {
                    price,
                    mrp,
                    hasDiscount,
                  });

                  return hasDiscount ? (
                    <div className="text-sm text-gray-500">
                      <div>MRP: {formatPrice(mrp)}</div>
                      <div className="text-red-500 font-medium">
                        Save: {formatPrice(mrp - price)}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Discount */}
              <div className="text-center">
                <div className="font-medium">
                  {formatPrice(
                    item?.product_attr_id?.mrp - item?.product_attr_id?.price
                  )}
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-center">
                <div className="font-medium">
                  {formatPrice(item?.product_attr_id?.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
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
                <span className="text-sm font-medium">0 PKR</span>
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
                <span className="text-sm font-medium">+500 PKR</span>
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
                <span className="text-sm font-medium">+300 PKR</span>
              </label>
            </div>

            {/* Coupon Validator
            <div className="mb-6">
              <CouponValidator
                orderAmount={subtotal}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
              />
            </div> */}

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {/* Applied Coupon */}
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span>{appliedCoupon.code}</span>
                  <span className="text-green-600">
                    -{formatPrice(appliedCoupon.discount)}
                  </span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Discount</span>
                <span className="font-medium">
                  {formatPrice(totalDiscount)}
                </span>
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
