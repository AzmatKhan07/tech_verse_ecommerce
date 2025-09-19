import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, ThumbsUp } from "lucide-react";

/**
 * ProductTabs Component
 * Displays tabbed content for Additional Info, Questions, and Reviews
 */
const ProductTabs = ({ product, reviews }) => {
  const [activeTab, setActiveTab] = useState("reviews");

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
                ({reviews?.length || 0} reviews)
              </span>
            </div>
            <Select defaultValue="newest">
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

          {/* Review Input */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium">Rate this product:</span>
              <div className="flex gap-1">
                {["😡", "😞", "😐", "😊", "😍"].map((emoji, index) => (
                  <button
                    key={index}
                    className="text-lg hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 border border-gray-300 rounded-full px-3 py-2 text-sm">
              <input
                type="text"
                placeholder="Write your review..."
                className="flex-1 outline-0 pl-3"
              />
              <Button size="lg" className="rounded-full">
                Write Review
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews?.slice(0, 3).map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col  mb-2">
                      <h5 className="font-medium">{review.name}</h5>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? "text-black" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                    <div className="flex gap-4 mt-3">
                      <Button
                        variant={"outline"}
                        className={
                          "rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer"
                        }
                      >
                        <ThumbsUp />
                        Like
                      </Button>
                      <Button
                        variant={"outline"}
                        className={
                          "rounded-full hover:bg-yellow-500 hover:text-white transition-all duration-300 cursor-pointer"
                        }
                      >
                        <MessageSquare /> Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews?.length > 3 && (
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
