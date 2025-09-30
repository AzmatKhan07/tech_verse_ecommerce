import React from "react";
import { Check } from "lucide-react";

/**
 * CartSteps Component
 * Displays the step indicator for the cart process
 */
const CartSteps = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, title: "Shopping cart", description: "" },
    { id: 2, title: "Checkout details", description: "" },
    { id: 3, title: "Order complete", description: "" },
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const getStepClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-black text-white";
      case "active":
        return "bg-black text-white";
      case "pending":
        return "bg-gray-200 text-gray-400";
      default:
        return "bg-gray-200 text-gray-400";
    }
  };

  const getConnectorClasses = (stepId) => {
    if (stepId < currentStep) return "bg-black";
    return "bg-gray-200";
  };

  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${getStepClasses(
                  getStepStatus(step.id)
                )}`}
              >
                {getStepStatus(step.id) === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`ml-3 text-sm font-medium ${
                  getStepStatus(step.id) === "pending"
                    ? "text-gray-400"
                    : "text-black"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 ${getConnectorClasses(step.id + 1)}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CartSteps;
