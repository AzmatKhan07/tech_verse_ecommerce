import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import AccountDetails from "@/components/profile/AccountDetails";
import AddressSection from "@/components/profile/AddressSection";
import OrdersSection from "@/components/profile/OrdersSection";
import WishlistSection from "@/components/profile/WishlistSection";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountDetails />;
      case "address":
        return <AddressSection />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      default:
        return <AccountDetails />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-black mb-12">
            My Account
          </h1>

          {/* Profile Content */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Sidebar */}
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            {/* Main Content */}
            <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
