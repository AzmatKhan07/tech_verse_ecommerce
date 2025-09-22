import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <AdminHeader onMenuToggle={toggleSidebar} />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-6 pt-16 lg:pt-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
