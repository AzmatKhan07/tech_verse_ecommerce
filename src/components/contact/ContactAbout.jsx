import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * ContactAbout Component
 * Displays the about section with image and company info
 */
const ContactAbout = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&auto=format"
              alt="Modern living room interior"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* About Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black">About Us</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                3legant is a gift & decorations store based in HCMC, Vietnam.
                Est since 2019.
              </p>
              <p>
                Our customer service is always prepared to support you 24/7.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3">
              Shop Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactAbout;
