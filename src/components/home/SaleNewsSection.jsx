import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets/assets";

/**
 * SaleNewsSection Component
 * Displays a promotional banner with sale information and living room image
 */
const SaleNewsSection = () => {
  const handleShopNow = () => {
    // TODO: Implement navigation to sale products
    console.log("Navigate to sale products");
  };

  return (
    <section className=" bg-gray-100 my-16 p-5 lg:p-0">
      <div className="">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Living Room Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden">
              <img
                src={assets.saleNewsImage}
                alt="Stylish Living Room with Modern Furniture"
                className="w-full h-auto lg:h-[600px] object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Section - Promotional Content */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Sale Badge */}
            <div className="inline-block">
              <span className="font-semibold text-blue-500">
                SALE UP TO 35% OFF
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-7xl lg:leading-16">
              HUNDREDS of <br className="hidden lg:block" /> New lower prices!
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed">
              It's more affordable than ever to give every room in your home a
              stylish makeover
            </p>

            {/* Call to Action Button */}
            <div className="pt-4">
              <Button
                onClick={handleShopNow}
                variant="ghost"
                className="text-black hover:text-gray-700 p-0 h-auto font-medium text-lg group underline underline-offset-4"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleNewsSection;
