import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import React, { useEffect } from "react";
import ProductSection from "@/components/home/ProductSection";
import SaleNewsSection from "@/components/home/SaleNewsSection";
import FeatureProduct from "@/components/home/FeatureProduct";
import OfferSection from "@/components/home/OfferSection";
import { useLocation } from "react-router-dom";
import { useToast } from "@/lib/hooks/use-toast";

const Home = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a success message from signup redirect
    if (location.state?.message) {
      toast({
        title: "Welcome!",
        description: location.state.message,
        variant: "success",
      });

      // Clear the message from location state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  return (
    <main>
      <Hero />
      <CategorySection />
      <ProductSection />
      <SaleNewsSection />
      <FeatureProduct />
      <OfferSection />
    </main>
  );
};

export default Home;
