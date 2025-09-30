import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";

const ColorForm = ({ color = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    color: "#000000",
    status: true,
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when editing
  useEffect(() => {
    if (color) {
      setFormData({
        color: color.color || "#000000",
        status: color.status !== undefined ? color.status : true,
      });
    } else {
      // Reset form for new color
      setFormData({
        color: "#000000",
        status: true,
      });
    }
    setErrors({});
  }, [color]);

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

    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
    }

    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (formData.color && !hexColorRegex.test(formData.color)) {
      newErrors.color = "Please enter a valid hex color (e.g., #FF0000)";
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
      color: formData.color.trim(),
      status: formData.status,
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{color ? "Edit Color" : "Create New Color"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="color">Color *</Label>
            <div className="flex items-center space-x-3">
              {/* Color Preview */}
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center"
                style={{ backgroundColor: formData.color }}
              >
                <Circle className="h-6 w-6 text-white drop-shadow-sm" />
              </div>

              {/* Color Picker Input */}
              <div className="flex-1">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className={`h-12 w-full cursor-pointer ${
                    errors.color ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Hex Input */}
              <div className="w-24">
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="#000000"
                  className={`text-center ${
                    errors.color ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status}
              onCheckedChange={(checked) =>
                handleInputChange("status", checked)
              }
            />
            <Label htmlFor="status">Active</Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : color
                ? "Update Color"
                : "Create Color"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ColorForm;
