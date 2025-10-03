import React from "react";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { useNavigate, useLocation } from "react-router-dom";
import { User, MapPin, Package, Heart, LogOut, Edit } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileSidebar = ({ activeSection, onSectionChange }) => {
  const user = useAuthUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get initials from display name
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  const menuItems = [
    { id: "account", label: "Account", icon: User },
    // { id: "address", label: "Address", icon: MapPin },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "logout", label: "Log Out", icon: LogOut },
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === "logout") {
      signOut();
      navigate("/");
    } else {
      onSectionChange(itemId);
    }
  };

  return (
    <div className="w-full lg:w-80 bg-gray-50 p-6">
      {/* User Profile Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage
              src={user.avatar}
              alt={user.displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl font-semibold">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-4 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <Edit className="w-3 h-3 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          {user.displayName}
        </h3>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                activeSection === item.id
                  ? "bg-white text-black font-medium shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
