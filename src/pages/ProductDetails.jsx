import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import NewsletterSection from "@/components/product/NewsletterSection";
import { useProduct } from "@/lib/query/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  // State to track if user has manually selected a variant
  const [userSelectedVariant, setUserSelectedVariant] = useState(false);

  // Fetch product data from API
  const { data: product, isLoading, error, refetch } = useProduct(slug);

  // Set default variant (first attribute) but show main image initially
  useEffect(() => {
    if (product && product.attributes && product.attributes.length > 0) {
      setSelectedVariant(product.attributes[0]);
      setUserSelectedVariant(false); // Reset user selection flag
    }
  }, [product]);

  // Custom variant selection handler
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setUserSelectedVariant(true); // Mark that user has manually selected a variant
  };

  // Transform API data to match component expectations
  const transformedProduct = product
    ? {
        id: product.id,
        name: product.name,
        slug: product.slug,
        rating: parseFloat(product.avg_rating) || 0,
        reviewCount: parseInt(product.review_count) || 0,
        description: product.desc || product.short_desc || "",
        price: selectedVariant
          ? parseFloat(selectedVariant.price) || 0
          : getMinPrice(product.attributes),
        originalPrice: selectedVariant
          ? parseFloat(selectedVariant.mrp) || null
          : getMaxMrp(product.attributes),
        offerTimer: { days: 2, hours: 12, minutes: 45, seconds: 5 }, // Static for now
        measurements: product.technical_specification || "",
        sku: selectedVariant?.sku || product.attributes?.[0]?.sku || "",
        category: product.category_name || "",
        badges: getProductBadges(product),
        images: getProductImages(product, selectedVariant, userSelectedVariant),
        colors: getProductColors(product.attributes),
        sizes: getProductSizes(product.attributes),
        attributes: product.attributes || [],
        selectedVariant: selectedVariant,
        brand: product.brand_name || "",
        model: product.model || "",
        keywords: product.keywords || "",
        uses: product.uses || "",
        warranty: product.warranty || "",
        lead_time: product.lead_time || "",
        is_arrival: product.is_arrival || false,
        is_featured: product.is_featured || false,
        is_discounted: product.is_discounted || false,
        is_promo: product.is_promo || false,
        is_trending: product.is_tranding || false,
      }
    : null;

  // Helper functions to transform API data
  function getMinPrice(attributes) {
    if (!attributes || attributes.length === 0) return 0;
    const prices = attributes
      .map((attr) => parseFloat(attr.price))
      .filter((price) => !isNaN(price) && price > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  function getMaxMrp(attributes) {
    if (!attributes || attributes.length === 0) return null;
    const mrpPrices = attributes
      .map((attr) => parseFloat(attr.mrp))
      .filter((price) => !isNaN(price) && price > 0);
    const maxMrp = mrpPrices.length > 0 ? Math.max(...mrpPrices) : null;
    const currentPrice = getMinPrice(attributes);
    return maxMrp && maxMrp > currentPrice ? maxMrp : null;
  }

  function getProductBadges(product) {
    const badges = [];
    if (product.is_arrival) badges.push({ text: "NEW", variant: "default" });

    // Calculate discount percentage
    if (product.is_discounted || product.is_promo) {
      const currentPrice = selectedVariant
        ? parseFloat(selectedVariant.price) || 0
        : getMinPrice(product.attributes);
      const originalPrice = selectedVariant
        ? parseFloat(selectedVariant.mrp) || null
        : getMaxMrp(product.attributes);

      if (originalPrice && originalPrice > currentPrice) {
        const discountPercentage = Math.round(
          ((originalPrice - currentPrice) / originalPrice) * 100
        );
        badges.push({
          text: `-${discountPercentage}%`,
          variant: "destructive",
        });
      }
    }

    return badges;
  }

  function getProductImages(product, selectedVariant, userSelectedVariant) {
    const images = [];

    // Add main product image first (this will be the default selected image)
    if (product.image) {
      images.push({
        url: product.image,
        alt: `${product.name} - Main View`,
        isMain: true, // Mark as main image
      });
    }

    // If a variant is selected and has an image, and user has manually selected it, add it after main image
    if (selectedVariant && selectedVariant.attr_image && userSelectedVariant) {
      images.push({
        url: selectedVariant.attr_image,
        alt: `${product.name} - ${
          selectedVariant.color_name || "Selected Variant"
        }`,
        isVariant: true,
        variantId: selectedVariant.id,
      });
    }

    // Add additional images
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, index) => {
        if (img.image) {
          images.push({
            url: img.image,
            alt: `${product.name} - View ${index + 2}`,
          });
        }
      });
    }

    // Add other variant images (excluding the selected one)
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach((attr, index) => {
        if (attr.attr_image && attr.id !== selectedVariant?.id) {
          images.push({
            url: attr.attr_image,
            alt: `${product.name} - ${
              attr.color_name || `Variant ${index + 1}`
            }`,
            isVariant: true,
            variantId: attr.id,
            variantData: attr,
          });
        }
      });
    }

    return images.length > 0
      ? images
      : [
          {
            url: "/placeholder-product.jpg",
            alt: `${product.name} - Product Image`,
          },
        ];
  }

  function getProductColors(attributes) {
    if (!attributes || attributes.length === 0) return [];

    const colorMap = new Map();
    attributes.forEach((attr) => {
      if (attr.color && attr.color_name) {
        colorMap.set(attr.color, {
          name: attr.color_name,
          value: attr.color,
          image: attr.attr_image || "/placeholder-product.jpg",
        });
      }
    });

    return Array.from(colorMap.values());
  }

  function getProductSizes(attributes) {
    if (!attributes || attributes.length === 0) return [];

    const sizeMap = new Map();
    attributes.forEach((attr) => {
      if (attr.size && attr.size_name) {
        sizeMap.set(attr.size, {
          name: attr.size_name,
          value: attr.size,
        });
      }
    });

    return Array.from(sizeMap.values());
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main>
          {/* Breadcrumbs Skeleton */}
          <div className="bg-gray-50 py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Skeleton className="h-4 w-16" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Skeleton className="h-4 w-20" />
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Product Images Skeleton */}
                <div>
                  <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>

                {/* Product Information Skeleton */}
                <div className="space-y-6">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <main>
          {/* Breadcrumbs */}
          <div className="bg-gray-50 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-gray-600">
                <Link to="/" className="hover:text-black transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/shop" className="hover:text-black transition-colors">
                  Shop
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-black">Product Not Found</span>
              </nav>
            </div>
          </div>

          {/* Error Message */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                  {error.message ||
                    "The product you're looking for doesn't exist or has been removed."}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => refetch()} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={() => navigate("/shop")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shop
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Product not found
  if (!transformedProduct) {
    return (
      <div className="min-h-screen bg-white">
        <main>
          {/* Breadcrumbs */}
          <div className="bg-gray-50 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm text-gray-600">
                <Link to="/" className="hover:text-black transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/shop" className="hover:text-black transition-colors">
                  Shop
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-black">Product Not Found</span>
              </nav>
            </div>
          </div>

          {/* Not Found Message */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Product Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                  The product you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button onClick={() => navigate("/shop")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/shop" className="hover:text-black transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-4 h-4" />
              {transformedProduct.category && (
                <>
                  <Link
                    to={`/shop?category=${transformedProduct.category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="hover:text-black transition-colors"
                  >
                    {transformedProduct.category}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-black">{transformedProduct.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <ProductImageGallery
                  product={transformedProduct}
                  onVariantSelect={handleVariantSelect}
                />
              </div>

              {/* Product Information */}
              <div>
                <ProductInfo
                  product={transformedProduct}
                  selectedVariant={selectedVariant}
                  onVariantSelect={handleVariantSelect}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <ProductTabs product={transformedProduct} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
