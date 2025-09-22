import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * CheckoutForm Component
 * Displays the checkout form with contact info, shipping address, and payment method
 */
const CheckoutForm = ({ onNext, onBack }) => {
  const { cartItems, cartTotal } = useCart();
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: "",
    country: "",
    townCity: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvvCode: "",
  });

  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("free");

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate discount from applied coupon
  const discount = appliedCoupon ? appliedCoupon.amount : 0;

  // Calculate shipping cost
  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "express" ? 15 : 21;

  // Calculate totals using cart context
  const subtotal = cartTotal;
  const total = subtotal - discount + shippingCost;

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "jenkateMW".toLowerCase()) {
      setAppliedCoupon({
        code: "JenkateMW",
        amount: 25.0,
      });
    } else {
      setAppliedCoupon(null);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    FIRST NAME
                  </label>
                  <Input
                    placeholder="First name"
                    value={contactInfo.firstName}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LAST NAME
                  </label>
                  <Input
                    placeholder="Last name"
                    value={contactInfo.lastName}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PHONE NUMBER
                </label>
                <Input
                  placeholder="Phone number"
                  value={contactInfo.phoneNumber}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EMAIL ADDRESS
                </label>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactInfo.emailAddress}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      emailAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  STREET ADDRESS *
                </label>
                <Input
                  placeholder="Street Address"
                  value={shippingAddress.streetAddress}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      streetAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  COUNTRY *
                </label>
                <Select
                  value={shippingAddress.country}
                  onValueChange={(value) =>
                    setShippingAddress({ ...shippingAddress, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TOWN / CITY *
                  </label>
                  <Input
                    placeholder="Town / City"
                    value={shippingAddress.townCity}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        townCity: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    STATE
                  </label>
                  <Input
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP CODE
                </label>
                <Input
                  placeholder="Zip Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      zipCode: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="different-billing"
                  checked={useDifferentBilling}
                  onChange={(e) => setUseDifferentBilling(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor="different-billing"
                  className="text-sm text-gray-700"
                >
                  Use a different billing address (optional)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === "credit-card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-black"
                  />
                  <CreditCard className="w-5 h-5" />
                  <span>Pay by Card Credit</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-black"
                  />
                  <span>Paypal</span>
                </label>
              </div>

              {/* Card Details */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CARD NUMBER
                    </label>
                    <Input
                      placeholder="1234 1234 1234"
                      value={cardInfo.cardNumber}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        EXPIRATION DATE
                      </label>
                      <Input
                        placeholder="MM/YY"
                        value={cardInfo.expiryMonth}
                        onChange={(e) =>
                          setCardInfo({
                            ...cardInfo,
                            expiryMonth: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="YYYY"
                        value={cardInfo.expiryYear}
                        onChange={(e) =>
                          setCardInfo({
                            ...cardInfo,
                            expiryYear: e.target.value,
                          })
                        }
                        className="mt-6"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <Input
                        placeholder="CVC code"
                        value={cardInfo.cvvCode}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, cvvCode: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Color: {item.color}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs border border-gray-300 px-2 py-1 rounded">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-sm">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Coupon Input */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
            </div>

            {/* Shipping and Total */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {/* Applied Coupon */}
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span>{appliedCoupon.code}</span>
                  <span className="text-green-600">
                    -{formatPrice(appliedCoupon.amount)}
                    <button
                      onClick={handleRemoveCoupon}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      [Remove]
                    </button>
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

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
