import React from "react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import WishlistItem from "./WishlistItem";
import { useNavigate } from "react-router-dom";

const WishlistSection = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

  const navigate = useNavigate();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Your Wishlist</h2>
        {wishlistCount > 0 && (
          <span className="text-sm text-gray-600">
            {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {wishlistCount === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Save items you love for later. They'll appear here.
          </p>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => navigate("/shop")}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
              <div className="col-span-1"></div>
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-4">Action</div>
            </div>
            {wishlistItems.map((product) => (
              <WishlistItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
