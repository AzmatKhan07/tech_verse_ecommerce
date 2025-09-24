import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const BrandForm = ({ brand = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: true,
    is_home: true,
  });

  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data when editing
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        image: null, // Keep as null for new uploads
        status: brand.status !== undefined ? brand.status : true,
        is_home: brand.is_home !== undefined ? brand.is_home : true,
      });
      setCurrentImageUrl(brand.image || null);
    } else {
      // Reset form for new brand
      setFormData({
        name: "",
        image: null,
        status: true,
        is_home: true,
      });
      setCurrentImageUrl(null);
    }
    setErrors({});
  }, [brand]);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Clear error
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCurrentImageUrl(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setCurrentImageUrl(null);

    // Clear error
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required";
    }

    if (formData.name.length > 100) {
      newErrors.name = "Brand name must be less than 100 characters";
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
      name: formData.name.trim(),
      image: formData.image, // This will be either a File object or null
      status: formData.status,
      is_home: formData.is_home,
    };

    // If editing and no new image uploaded, set image to null
    // The API will keep the existing image when image field is not provided
    if (brand && !formData.image && currentImageUrl) {
      submitData.image = null; // Don't send existing URL, let API keep current image
    }

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{brand ? "Edit Brand" : "Create New Brand"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter brand name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Brand Logo Upload */}
          <div className="space-y-2">
            <Label>Brand Logo</Label>

            {/* Current Image Display */}
            {currentImageUrl && (
              <div className="relative inline-block">
                <img
                  src={currentImageUrl}
                  alt="Brand logo preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* File Upload */}
            {!currentImageUrl && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload brand logo
                    </span>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Upload Button for existing images */}
            {currentImageUrl && (
              <div>
                <Label htmlFor="image" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            )}

            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
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
            <Label htmlFor="status">Status</Label>
          </div>

          {/* Home Category */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_home"
              checked={formData.is_home}
              onCheckedChange={(checked) =>
                handleInputChange("is_home", checked)
              }
            />
            <Label htmlFor="is_home">Home Category</Label>
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
                : brand
                ? "Update Brand"
                : "Create Brand"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BrandForm;
