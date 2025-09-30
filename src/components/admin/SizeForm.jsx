import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SizeForm = ({ size = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    size: "",
    width: "",
    height: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [sizeType, setSizeType] = useState("standard"); // "standard" or "custom"

  // Common size options for quick selection
  const commonSizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48",
    "50",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "Small",
    "Medium",
    "Large",
    "Extra Large",
    "One Size",
    "Free Size",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (size) {
      // Check if it's a custom size (contains dimensions)
      const isCustomSize =
        size.size &&
        (size.size.includes("x") ||
          size.size.includes("X") ||
          size.size.includes("×"));

      if (isCustomSize) {
        setSizeType("custom");
        // Try to parse width and height from size string
        const dimensions = size.size.match(/(\d+)\s*[xX×]\s*(\d+)/);
        if (dimensions) {
          setFormData({
            size: size.size || "",
            width: dimensions[1] || "",
            height: dimensions[2] || "",
            status: size.status !== undefined ? size.status : true,
          });
        } else {
          setFormData({
            size: size.size || "",
            width: "",
            height: "",
            status: size.status !== undefined ? size.status : true,
          });
        }
      } else {
        setSizeType("standard");
        setFormData({
          size: size.size || "",
          width: "",
          height: "",
          status: size.status !== undefined ? size.status : true,
        });
      }
    } else {
      // Reset form for new size
      setSizeType("standard");
      setFormData({
        size: "",
        width: "",
        height: "",
        status: true,
      });
    }
    setErrors({});
  }, [size]);

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

  const handleSizeTypeChange = (type) => {
    setSizeType(type);
    if (type === "standard") {
      setFormData((prev) => ({
        ...prev,
        width: "",
        height: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        size: "",
      }));
    }
    setErrors({});
  };

  const handleCustomSizeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate size string for custom dimensions
    if (field === "width" || field === "height") {
      const width = field === "width" ? value : formData.width;
      const height = field === "height" ? value : formData.height;

      if (width && height) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          size: `${width} x ${height}`,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          size: "",
        }));
      }
    }

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

    if (sizeType === "standard") {
      if (!formData.size.trim()) {
        newErrors.size = "Size is required";
      }

      if (formData.size.length > 20) {
        newErrors.size = "Size must be less than 20 characters";
      }
    } else {
      // Custom size validation
      if (!formData.width.trim()) {
        newErrors.width = "Width is required";
      }

      if (!formData.height.trim()) {
        newErrors.height = "Height is required";
      }

      // Validate numeric values
      if (formData.width && isNaN(Number(formData.width))) {
        newErrors.width = "Width must be a number";
      }

      if (formData.height && isNaN(Number(formData.height))) {
        newErrors.height = "Height must be a number";
      }

      // Validate positive numbers
      if (formData.width && Number(formData.width) <= 0) {
        newErrors.width = "Width must be greater than 0";
      }

      if (formData.height && Number(formData.height) <= 0) {
        newErrors.height = "Height must be greater than 0";
      }
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
    let finalSize;
    if (sizeType === "custom") {
      finalSize = `${formData.width.trim()} x ${formData.height.trim()}`;
    } else {
      finalSize = formData.size.trim();
    }

    const submitData = {
      size: finalSize,
      status: formData.status,
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{size ? "Edit Size" : "Create New Size"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Size Type Selection */}
          <div className="space-y-2">
            <Label>Size Type *</Label>
            <Select value={sizeType} onValueChange={handleSizeTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose size type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Size</SelectItem>
                <SelectItem value="custom">Custom Dimensions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Standard Size Input */}
          {sizeType === "standard" && (
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <div className="space-y-3">
                {/* Manual Input */}
                <Input
                  id="size"
                  type="text"
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  placeholder="Enter size (e.g., S, M, L, 32, 10)"
                  className={errors.size ? "border-red-500" : ""}
                />

                {/* Quick Select */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Quick Select:</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => handleInputChange("size", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a common size" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonSizes.map((sizeOption) => (
                        <SelectItem key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.size && (
                <p className="text-sm text-red-500">{errors.size}</p>
              )}
            </div>
          )}

          {/* Custom Size Input */}
          {sizeType === "custom" && (
            <div className="space-y-4">
              <Label>Custom Dimensions *</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Width Input */}
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) =>
                      handleCustomSizeChange("width", e.target.value)
                    }
                    placeholder="e.g., 100"
                    className={errors.width ? "border-red-500" : ""}
                    min="1"
                    step="1"
                  />
                  {errors.width && (
                    <p className="text-sm text-red-500">{errors.width}</p>
                  )}
                </div>

                {/* Height Input */}
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleCustomSizeChange("height", e.target.value)
                    }
                    placeholder="e.g., 200"
                    className={errors.height ? "border-red-500" : ""}
                    min="1"
                    step="1"
                  />
                  {errors.height && (
                    <p className="text-sm text-red-500">{errors.height}</p>
                  )}
                </div>
              </div>

              {/* Preview */}
              {formData.width && formData.height && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Preview:</strong> {formData.width} x{" "}
                    {formData.height}
                  </p>
                </div>
              )}
            </div>
          )}

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
              {isLoading ? "Saving..." : size ? "Update Size" : "Create Size"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SizeForm;
