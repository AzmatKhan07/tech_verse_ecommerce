import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

/**
 * NewsletterSection Component
 * Displays newsletter signup section with furniture images
 */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    // TODO: Implement newsletter signup functionality
    setEmail("");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format"
                alt="White Chest of Drawers"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Sign up for deals, new products and promotions.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-8 py-3 whitespace-nowrap"
              >
                Signup
              </Button>
            </form>
          </div>

          {/* Right Image */}
          <div className="order-3">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop&auto=format"
                alt="Gray Armchair with Blanket"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
