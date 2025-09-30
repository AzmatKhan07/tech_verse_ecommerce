import React from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import OfferSection from "@/components/home/OfferSection";
import SaleNewsSection from "@/components/home/SaleNewsSection";

const Contact = () => {
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
              <span className="text-black font-medium">Contact Us</span>
            </nav>
          </div>
        </div>

        <ContactHero />
        <SaleNewsSection />
        <ContactInfo />
        <ContactForm />
        <OfferSection />
      </main>
    </div>
  );
};

export default Contact;
