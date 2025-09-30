import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ThumbsUp, Star, User } from "lucide-react";
import { useProductReviews } from "@/lib/query/hooks/useReviews";
import ReviewForm from "./ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProductTabs Component
 * Displays tabbed content for Additional Info, Questions, and Reviews
 */
const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch reviews for the product
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useProductReviews(product?.id, {
    page_size: 10,
    status: true, // Only show approved reviews
  });

  const reviews = reviewsData?.results || reviewsData || [];

  // Helper function to convert rating text to number of stars
  const getRatingStars = (rating) => {
    const ratingMap = {
      Excellent: 5,
      Good: 4,
      Average: 3,
      Poor: 2,
      "Very Poor": 1,
    };
    return ratingMap[rating] || 0;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tabs = [
    {
      id: "additional-info",
      label: "Additional Info",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Product Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span>Wood, Metal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span>15 lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assembly:</span>
                  <span>Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span>1 Year</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Care Instructions</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Clean with a soft, dry cloth</p>
                <p>• Avoid harsh chemicals</p>
                <p>• Keep away from direct sunlight</p>
                <p>• Store in a dry place</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Shipping Information</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Free shipping on orders over $500</p>
              <p>• Standard delivery: 3-5 business days</p>
              <p>• Express delivery available</p>
              <p>• Assembly service available for additional fee</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "questions",
      label: "Questions",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-lg mb-4">
              Frequently Asked Questions
            </h4>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium mb-2">
                  What materials is this table made from?
                </h5>
                <p className="text-sm text-gray-700">
                  The Tray Table is crafted from high-quality wood with metal
                  legs, ensuring durability and style.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium mb-2">
                  Does this require assembly?
                </h5>
                <p className="text-sm text-gray-700">
                  Yes, some assembly is required. We provide detailed
                  instructions and all necessary hardware.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium mb-2">Can I return this item?</h5>
                <p className="text-sm text-gray-700">
                  Yes, we offer a 30-day return policy for unused items in
                  original packaging.
                </p>
              </div>
              <div>
                <h5 className="font-medium mb-2">
                  Do you offer assembly service?
                </h5>
                <p className="text-sm text-gray-700">
                  Yes, we provide professional assembly service for an
                  additional fee. Contact us for more details.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Still have questions?</h5>
            <p className="text-sm text-gray-700 mb-3">
              Contact our customer service team for personalized assistance.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      label: "Reviews",
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">Customer Reviews</h4>
              <span className="text-sm text-gray-600">
                ({reviewsData?.count || reviews?.length || 0} reviews)
              </span>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Form */}
          <ReviewForm
            productId={product?.id}
            onSuccess={() => refetchReviews()}
          />

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-4 h-4" />
                          ))}
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : reviewsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  Error loading reviews: {reviewsError.message}
                </p>
                <Button onClick={() => refetchReviews()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h5 className="font-medium text-gray-900 mb-2">
                  No reviews yet
                </h5>
                <p className="text-sm text-gray-600">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col mb-2">
                        <h5 className="font-medium">
                          {review.customer_name || "Anonymous"}
                        </h5>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < getRatingStars(review.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {review.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            • {formatDate(review.added_on)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.review}
                      </p>
                      <div className="flex gap-4 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Like
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full hover:bg-yellow-500 hover:text-white transition-all duration-300"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {reviewsData?.next && (
            <Button variant="outline" className="w-full">
              Load More Reviews
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default ProductTabs;
