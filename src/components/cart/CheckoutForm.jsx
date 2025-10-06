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
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import paymentService from "@/lib/api/services/payment";
import { useToast } from "@/lib/hooks/use-toast";
import CouponValidator from "./CouponValidator";

/**
 * CheckoutForm Component
 * Displays the checkout form with contact info, shipping address, and payment method
 */
const CheckoutForm = ({ onNext, onBack }) => {
  const user = useCurrentUser();
  const { cartItems, cartTotal, mrpTotal, discount } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phone,
    emailAddress: user?.email,
  });

  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: "",
    country: "",
    townCity: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("free");

  const formatPrice = (amount) => {
    return `${amount?.toLocaleString()} PKR`;
  };

  // Calculate discount from applied coupon
  const totalDiscount = appliedCoupon ? appliedCoupon.discount : null;

  // Calculate shipping cost
  const shippingCost =
    shippingMethod === "free" ? 0 : shippingMethod === "express" ? 500 : 300;

  // Calculate totals using cart context

  const subtotal = cartTotal;
  const total = subtotal - totalDiscount + shippingCost;

  // Handle coupon application from CouponValidator
  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Error",
        description: "Payment system is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        user_id: user?.id,
        contact_info: contactInfo,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        cart_items: cartItems.map((item) => ({
          product_id: item.product_id,
          product_attr_id: item.product_attr_id?.id,
          quantity: item.quantity,
          price: item.product_attr_id?.price || item.price,
        })),
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount: discount,
        total: total,
        coupon_code: appliedCoupon?.code || null,
      };

      if (paymentMethod === "credit-card") {
        // Create payment intent
        const { client_secret, order_id } =
          await paymentService.createPaymentIntent({
            amount: Math.round(total * 100), // Convert to cents
            currency: "pkr",
            order_data: orderData,
          });

        // Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${contactInfo.firstName} ${contactInfo.lastName}`,
                email: contactInfo.emailAddress,
                phone: contactInfo.phoneNumber,
                address: {
                  line1: shippingAddress.streetAddress,
                  city: shippingAddress.townCity,
                  state: shippingAddress.state,
                  postal_code: shippingAddress.zipCode,
                  country: shippingAddress.country,
                },
              },
            },
          }
        );

        if (error) {
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (paymentIntent.status === "succeeded") {
          // // Create order in backend
          // await paymentService.createOrder({
          //   ...orderData,
          //   payment_intent_id: paymentIntent.id,
          //   payment_status: "completed",
          // });

          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully!",
            variant: "success",
          });

          // Prepare order data for OrderComplete component
          const completeOrderData = {
            orderNumber: `#${order_id}`,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            total: total,
            paymentMethod:
              paymentMethod === "credit-card" ? "Credit Card" : "PayPal",
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              image: item.product_attr_id?.attr_image,
              product_attr_id: item.product_attr_id,
              product_name: item.name,
            })),
          };

          onNext(completeOrderData);
        }
      } else if (paymentMethod === "paypal") {
        // Handle PayPal payment
        toast({
          title: "PayPal Integration",
          description: "PayPal integration coming soon!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description:
          error.message ||
          "An error occurred during payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                      CARD DETAILS
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place Order"}
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
                    src={item?.product_attr_id?.attr_image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      Color: {item?.product_attr_id?.color_name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs border border-gray-300 px-2 py-1 rounded">
                        {item.quantity}
                      </span>
                      <span className="font-medium text-sm">
                        {formatPrice(
                          item?.product_attr_id?.price * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Coupon Validator */}
            <div className="pt-4 border-t border-gray-200">
              <CouponValidator
                orderAmount={subtotal}
                onCouponApplied={handleCouponApplied}
                appliedCoupon={appliedCoupon}
              />
            </div>

            {/* Shipping and Total */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
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

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {totalDiscount && (
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="font-medium">
                    {formatPrice(totalDiscount)}
                  </span>
                </div>
              )}

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
