import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  List,
  Tag,
  Grid,
  Palette,
  Ruler,
  Percent,
  Image,
} from "lucide-react";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useAuthUser();
  const signOut = useSignOut();

  const logout = async () => {
    signOut();
  };

  const getInitials = (name) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },

    {
      id: "categories",
      label: "Categories",
      icon: Grid,
      path: "/admin/categories",
    },

    {
      id: "brand",
      label: "Brands",
      icon: Tag,
      path: "/admin/brands",
    },

    {
      id: "colors",
      label: "Colors",
      icon: Palette,
      path: "/admin/colors",
    },

    {
      id: "sizes",
      label: "Sizes",
      icon: Ruler,
      path: "/admin/sizes",
    },

    {
      id: "taxes",
      label: "Taxes",
      icon: Percent,
      path: "/admin/taxes",
    },
    {
      id: "home-banner",
      label: "Home Banner",
      icon: Image,
      path: "/admin/home-banner",
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
              <Package className="size-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">3legant.</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer with User Profile and Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.displayName || "Admin"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-semibold">
                  {getInitials(user?.displayName || "Admin")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 text-sm truncate">
                  {user?.displayName || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
