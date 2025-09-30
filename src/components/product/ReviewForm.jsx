import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReview } from "@/lib/query/hooks/useReviews";
import { useToast } from "@/lib/hooks/use-toast";
import { Star, Send } from "lucide-react";

const ReviewForm = ({ productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: "",
    review: "",
    status: true,
    product: productId,
  });

  const { toast } = useToast();
  const createReviewMutation = useCreateReview();

  const ratingOptions = [
    { value: "Excellent", label: "Excellent", stars: 5 },
    { value: "Good", label: "Good", stars: 4 },
    { value: "Average", label: "Average", stars: 3 },
    { value: "Poor", label: "Poor", stars: 2 },
    { value: "Very Poor", label: "Very Poor", stars: 1 },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.rating) {
      toast({
        title: "Rating Required",
        description: "Please select a rating for your review.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.review.trim()) {
      toast({
        title: "Review Required",
        description: "Please write your review.",
        variant: "destructive",
      });
      return;
    }

    if (formData.review.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters for your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReviewMutation.mutateAsync(formData);

      toast({
        title: "Review Submitted",
        description:
          "Thank you for your review! It will be published after moderation.",
        variant: "default",
      });

      // Reset form
      setFormData({
        rating: "",
        review: "",
        status: true,
        product: productId,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedRating = ratingOptions.find(
    (option) => option.value === formData.rating
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <Select
            value={formData.rating}
            onValueChange={(value) => handleInputChange("rating", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a rating" />
            </SelectTrigger>
            <SelectContent>
              {ratingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < option.stars
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <Textarea
            value={formData.review}
            onChange={(e) => handleInputChange("review", e.target.value)}
            placeholder="Share your experience with this product..."
            className="min-h-[120px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.review.length}/500 characters
          </div>
        </div>

        {/* Selected Rating Display */}
        {selectedRating && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Selected Rating:
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < selectedRating.stars
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({selectedRating.label})
            </span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="flex items-center gap-2"
          >
            {createReviewMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
