import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const AddressSection = () => {
  const { user, updateAddress, addAddress } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressType, setAddressType] = useState(null);

  const handleEditAddress = (type, address = null) => {
    setAddressType(type);
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSaveAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      updateAddress(addressType, addressData);
    } else {
      // Add new address
      addAddress(addressType, addressData);
    }

    // Reset state
    setEditingAddress(null);
    setAddressType(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
    setAddressType(null);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Address</h2>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address Card */}
        <AddressCard
          title="Billing Address"
          address={user.addresses?.billing}
          onEdit={() => handleEditAddress("billing", user.addresses?.billing)}
        />

        {/* Shipping Address Card */}
        <AddressCard
          title="Shipping Address"
          address={user.addresses?.shipping}
          onEdit={() => handleEditAddress("shipping", user.addresses?.shipping)}
        />
      </div>

      {/* Address Form Modal */}
      <AddressForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveAddress}
        addressType={addressType}
        existingAddress={editingAddress}
      />
    </div>
  );
};

export default AddressSection;
