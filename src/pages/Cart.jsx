import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CartSteps from "@/components/cart/CartSteps";
import CartItems from "@/components/cart/CartItems";
import CheckoutForm from "@/components/cart/CheckoutForm";
import OrderComplete from "@/components/cart/OrderComplete";

const Cart = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleContinueShopping = () => {
    // Navigate to shop or home page
    window.location.href = "/shop";
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CartItems onNext={handleNextStep} />;
      case 2:
        return (
          <CheckoutForm onNext={handleNextStep} onBack={handlePreviousStep} />
        );
      case 3:
        return <OrderComplete onContinueShopping={handleContinueShopping} />;
      default:
        return <CartItems onNext={handleNextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-black mb-8">
            Cart
          </h1>

          {/* Step Indicator */}
          <CartSteps currentStep={currentStep} />

          {/* Step Content */}
          {renderCurrentStep()}
        </div>
      </main>
    </div>
  );
};

export default Cart;
