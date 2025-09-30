import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const AddressCard = ({ title, address, onEdit, className = "" }) => {
  if (!address) {
    return (
      <div
        className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-800 border-gray-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            No {title.toLowerCase()} address
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-gray-600 hover:text-gray-800 border-gray-300"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Address Details */}
      <div className="space-y-2">
        <div>
          <p className="font-medium text-gray-900">{address.name}</p>
        </div>
        <div>
          <p className="text-gray-600">{address.phone}</p>
        </div>
        <div>
          <p className="text-gray-600">{address.address}</p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
