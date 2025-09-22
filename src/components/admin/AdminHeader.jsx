import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Package } from "lucide-react";

const AdminHeader = ({ onMenuToggle }) => {
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
          <Package className="size-4" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-black">3legant.</h1>
        </div>
      </div>

      {/* Menu Toggle Button */}
      <Button variant="ghost" size="icon" onClick={onMenuToggle}>
        <Menu className="w-5 h-5" />
      </Button>
    </header>
  );
};

export default AdminHeader;
