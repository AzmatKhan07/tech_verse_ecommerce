import React from "react";
import { Truck, CreditCard, Wrench, Users } from "lucide-react";

const OfferSection = () => {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: "Free Delivery",
      subtitle: "Order above $500",
    },
    {
      id: 2,
      icon: CreditCard,
      title: "Flexible Payment",
      subtitle: "0% Interest financing",
    },
    {
      id: 3,
      icon: Wrench,
      title: "Assembly Service",
      subtitle: "Professional setup included",
    },
    {
      id: 4,
      icon: Users,
      title: "Design Consultation",
      subtitle: "Expert interior advice",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
