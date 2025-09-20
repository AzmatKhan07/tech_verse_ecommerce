import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },

  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">3legant.</h1>
          </div>

          {/* Middle Section - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 list-none">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.href}
                  className="text-gray-600 hover:text-black transition-colors duration-200"
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </nav>

          {/* Right Section - Icons */}
          <div className="hidden sm:flex items-center space-x-6">
            {/* Search Icon */}
            <button className="text-black hover:text-gray-600 transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User Icon */}
            <button className="text-black hover:text-gray-600 transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Shopping Bag Icon with Badge */}
            <div className="relative">
              <button
                className="text-black hover:text-gray-600 transition-colors duration-200"
                onClick={() => navigate("/cart")}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
              {/* Badge */}
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                2
              </span>
            </div>
          </div>

          {/* Mobile menu with Sheet */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Icons - Shopping Bag */}
            <div className="relative">
              <button className="text-black hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
              {/* Badge */}
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                2
              </span>
            </div>

            {/* Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-black hover:text-gray-600 transition-colors duration-200">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="flex-row items-center justify-between p-6 border-b border-gray-200">
                    <SheetTitle className="text-2xl font-bold text-black">
                      3legant.
                    </SheetTitle>
                  </SheetHeader>

                  {/* Search Bar */}
                  <div className="p-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-6">
                    <div className="space-y-0">
                      <SheetClose asChild>
                        <NavLink
                          to="/"
                          className="block py-4 text-black hover:text-gray-600 transition-colors duration-200 border-b border-gray-200"
                        >
                          Home
                        </NavLink>
                      </SheetClose>

                      <div className="flex items-center justify-between py-4 border-b border-gray-200">
                        <SheetClose asChild>
                          <NavLink
                            to="/shop"
                            className="text-black hover:text-gray-600 transition-colors duration-200"
                          >
                            Shop
                          </NavLink>
                        </SheetClose>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-200">
                        <SheetClose asChild>
                          <NavLink
                            to="/product"
                            className="text-black hover:text-gray-600 transition-colors duration-200"
                          >
                            Product
                          </NavLink>
                        </SheetClose>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      <SheetClose asChild>
                        <NavLink
                          to="/contact"
                          className="block py-4 text-black hover:text-gray-600 transition-colors duration-200 border-b border-gray-200"
                        >
                          Contact Us
                        </NavLink>
                      </SheetClose>
                    </div>
                  </nav>

                  {/* Cart and Wishlist */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="space-y-0">
                      <div className="flex items-center justify-between py-4 border-b border-gray-200">
                        <span className="text-black">Cart</span>
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                          <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            2
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-black">Wishlist</span>
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-5 h-5 text-black"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <div className="px-6 py-4">
                    <SheetClose asChild>
                      <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
                        Sign In
                      </button>
                    </SheetClose>
                  </div>

                  {/* Social Media Icons */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-6">
                      {/* Instagram */}
                      <a
                        href="#"
                        className="text-black hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>

                      {/* Facebook */}
                      <a
                        href="#"
                        className="text-black hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>

                      {/* YouTube */}
                      <a
                        href="#"
                        className="text-black hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
