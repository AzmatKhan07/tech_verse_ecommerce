import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import React from "react";
import ProductSection from "@/components/home/ProductSection";
import SaleNewsSection from "@/components/home/SaleNewsSection";
import FeatureProduct from "@/components/home/FeatureProduct";
import OfferSection from "@/components/home/OfferSection";

const Home = () => {
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
