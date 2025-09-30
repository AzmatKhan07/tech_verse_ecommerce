import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ProductImageGallery Component
 * Displays product images with thumbnails, badges, navigation arrows, and zoom functionality
 */
const ProductImageGallery = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { images = [], badges = [], name = "Tray Table" } = product;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle mouse movement for zoom effect
  const handleMouseMove = (e) => {
    if (!isZooming) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Product Image */}
      <div
        className="relative bg-gray-100 aspect-square rounded-lg overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "default"}
                className={`${
                  badge.variant === "destructive"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-white text-black hover:bg-gray-100"
                } text-xs font-medium`}
              >
                {badge.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Main Image with Zoom Effect */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[currentImageIndex]?.url}
            alt={images[currentImageIndex]?.alt || name}
            className={`w-full h-full object-contain object-center transition-transform duration-200 ${
              isZooming ? "scale-150" : "scale-100"
            }`}
            style={{
              transformOrigin: isZooming
                ? `${zoomPosition.x}% ${zoomPosition.y}%`
                : "center",
            }}
            loading="lazy"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentImageIndex === index
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
