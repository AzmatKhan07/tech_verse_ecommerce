import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import NewsletterSection from "@/components/product/NewsletterSection";

const ProductDetails = () => {
  // Sample product data - Replace with actual data from API/database
  const product = {
    id: "tray-table-1",
    name: "Tray Table",
    rating: 5,
    reviewCount: 11,
    description:
      "Buy one or buy a few and make every space where you sit more convenient. Light and easy to move around with removable tray top, handy for serving snacks.",
    price: 199.0,
    originalPrice: 400.0,
    offerTimer: { days: 2, hours: 12, minutes: 45, seconds: 5 },
    measurements: '17 1/2×20 5/8"',
    sku: "1117",
    category: "Living Room, Bedroom",
    badges: [
      { text: "NEW", variant: "default" },
      { text: "-50%", variant: "destructive" },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&auto=format",
        alt: "Tray Table - Main View",
      },
      {
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop&auto=format",
        alt: "Tray Table - Close-up",
      },
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&auto=format",
        alt: "Tray Table - Living Room Setting",
      },
    ],
    colors: [
      {
        name: "Black",
        value: "black",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "Beige",
        value: "beige",
        image:
          "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "Red",
        value: "red",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&auto=format",
      },
      {
        name: "White",
        value: "white",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&auto=format",
      },
    ],
  };

  // Sample reviews data - Replace with actual data from API/database
  const reviews = [
    {
      id: 1,
      name: "Sofia Harvetz",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format",
      rating: 5,
      text: "I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident.",
    },
    {
      id: 2,
      name: "Nicolas Jensen",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
      rating: 5,
      text: "I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident.",
    },
    {
      id: 3,
      name: "Nicolas Jensen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
      rating: 5,
      text: "I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident.",
    },
    {
      id: 4,
      name: "Nicolas Jensen",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
      rating: 5,
      text: "I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident.",
    },
    {
      id: 5,
      name: "Nicolas Jensen",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
      rating: 5,
      text: "I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident.",
    },
  ];

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
              <Link
                to="/shop/living-room"
                className="hover:text-black transition-colors"
              >
                Living Room
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">Product</span>
            </nav>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <ProductImageGallery product={product} />
              </div>

              {/* Product Information */}
              <div>
                <ProductInfo product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <ProductTabs product={product} reviews={reviews} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
