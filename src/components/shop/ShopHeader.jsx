import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * ShopHeader Component
 * Displays breadcrumbs and shop page title
 */
const ShopHeader = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium">Shop</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-black">Shop Page</h1>
        <p className="text-gray-600 mt-2">
          Let's design the place you always imagined.
        </p>
      </div>
    </div>
  );
};

export default ShopHeader;
