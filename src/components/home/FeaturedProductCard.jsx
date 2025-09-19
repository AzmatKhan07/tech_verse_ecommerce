import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Utility function to generate URL slug
const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Reusable Featured Product Card Component
const FeaturedProductCard = ({ category, isLarge = false, className = "" }) => {
  const baseClasses = "bg-gray-100 rounded-lg p-10";
  const sizeClasses = isLarge
    ? "flex-1 flex flex-col gap-5 h-[600px]"
    : "flex-1 rounded-lg flex justify-between items-center";

  return (
    <div
      className={`${baseClasses} ${sizeClasses} ${className} group cursor-pointer`}
    >
      <div className={isLarge ? "" : ""}>
        <h2 className="text-3xl font-bold text-black mb-2">{category.name}</h2>
        <Link
          to={`/shop/${generateSlug(category.name)}`}
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div
        className={
          isLarge
            ? "w-full flex justify-center items-center flex-1 overflow-hidden"
            : "overflow-hidden"
        }
      >
        <img
          src={category.image}
          alt={category.alt}
          className={`${
            isLarge ? "w-[500px] object-contain" : "h-52 object-contain"
          } group-hover:scale-110 transition-transform duration-300 ease-in-out`}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default FeaturedProductCard;
