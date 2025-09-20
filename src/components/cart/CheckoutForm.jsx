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

/**
 * CheckoutForm Component
 * Displays the checkout form with contact info, shipping address, and payment method
 */
const CheckoutForm = ({ onNext, onBack }) => {
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

  // Sample cart items for order summary
  const cartItems = [
    {
      id: "1",
      name: "Tray Table",
      color: "Black",
      price: 38.0,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop&auto=format",
    },
    {
      id: "2",
      name: "Tray Table",
      color: "Red",
      price: 38.0,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop&auto=format",
    },
    {
      id: "3",
      name: "Table lamp",
      color: "Gold",
      price: 39.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    },
  ];

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
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

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
            {cartItems.map((item) => (
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
            ))}

            {/* Input field */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input placeholder="Input" className="flex-1" />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            {/* Shipping and Total */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>JenkateMW</span>
                <span className="text-green-600">-$25.00 [Remove]</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
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
