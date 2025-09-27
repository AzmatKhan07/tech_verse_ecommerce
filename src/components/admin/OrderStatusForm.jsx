import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

const OrderStatusForm = ({ orderStatus, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    orders_status: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when editing
  useEffect(() => {
    if (orderStatus) {
      setFormData({
        orders_status: orderStatus.orders_status || "",
      });
    } else {
      // Reset form for new order status
      setFormData({
        orders_status: "",
      });
    }
    setErrors({});
  }, [orderStatus]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orders_status.trim()) {
      newErrors.orders_status = "Order status is required";
    } else if (formData.orders_status.trim().length > 50) {
      newErrors.orders_status = "Order status must be 50 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for submission
    const submitData = {
      orders_status: formData.orders_status.trim(),
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {orderStatus ? "Edit Order Status" : "Create New Order Status"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Status */}
          <div className="space-y-2">
            <Label htmlFor="orders_status">Order Status *</Label>
            <Input
              id="orders_status"
              type="text"
              value={formData.orders_status}
              onChange={(e) =>
                handleInputChange("orders_status", e.target.value)
              }
              placeholder="e.g., Pending, Processing, Shipped, Delivered"
              className={errors.orders_status ? "border-red-500" : ""}
              maxLength={50}
            />
            {errors.orders_status && (
              <p className="text-sm text-red-600">{errors.orders_status}</p>
            )}
            <p className="text-sm text-gray-500">
              Maximum 50 characters ({formData.orders_status.length}/50)
            </p>
          </div>

          {/* Preview */}
          {formData.orders_status && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Preview:</strong>
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Order Status: </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                  {formData.orders_status}
                </span>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {orderStatus ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {orderStatus ? "Update Order Status" : "Create Order Status"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderStatusForm;
