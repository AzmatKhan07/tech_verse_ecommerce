import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          {/* Left Side - Brand Information */}
          <div className="flex items-center gap-4 mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold">3legant.</h2>
            <div className="w-px h-8 bg-gray-600"></div>
            <p className="text-base text-gray-300">Gift & Decoration Store</p>
          </div>

          {/* Right Side - Navigation Links */}
          <nav className="flex flex-wrap gap-8 lg:gap-12">
            <Link
              to="/"
              className="text-base hover:text-gray-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-base hover:text-gray-300 transition-colors duration-200"
            >
              Shop
            </Link>
            <Link
              to="/product"
              className="text-base hover:text-gray-300 transition-colors duration-200"
            >
              Product
            </Link>
            <Link
              to="/blog"
              className="text-base hover:text-gray-300 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-base hover:text-gray-300 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          {/* Left Side - Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-6 lg:mb-0">
            <p className="text-sm text-gray-400">
              Copyright © {currentYear} 3legant. All rights reserved
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                Terms of Use
              </Link>
            </div>
          </div>

          {/* Right Side - Social Media Icons */}
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
