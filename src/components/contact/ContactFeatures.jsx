import React from "react";
import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

/**
 * ContactFeatures Component
 * Displays the bottom features section with service highlights
 */
const ContactFeatures = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Order above $200",
    },
    {
      icon: RotateCcw,
      title: "Money-back",
      description: "30 days guarantee",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Secured by Stripe",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Phone and Email support",
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactFeatures;
