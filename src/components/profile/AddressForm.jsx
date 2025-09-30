import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AddressForm = ({
  isOpen,
  onClose,
  onSave,
  addressType,
  existingAddress = null,
}) => {
  const [formData, setFormData] = useState({
    name: existingAddress?.name || "",
    phone: existingAddress?.phone || "",
    address: existingAddress?.address || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update form data when existingAddress changes
  useEffect(() => {
    setFormData({
      name: existingAddress?.name || "",
      phone: existingAddress?.phone || "",
      address: existingAddress?.address || "",
    });
  }, [existingAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingAddress ? "Edit" : "Add"} {addressType} Address
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              FULL NAME *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              PHONE NUMBER *
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(+1) 234 567 890"
              required
              className="w-full"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              ADDRESS *
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              required
              className="w-full"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
