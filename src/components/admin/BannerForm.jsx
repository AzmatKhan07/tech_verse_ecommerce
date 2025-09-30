import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Save, Loader2 } from "lucide-react";

const BannerForm = ({ banner, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    image: null,
    btn_txt: "",
    btn_link: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form data when editing
  useEffect(() => {
    if (banner) {
      setFormData({
        image: null, // Don't pre-fill image for editing
        btn_txt: banner.btn_txt || "",
        btn_link: banner.btn_link || "",
        status: banner.status !== undefined ? banner.status : true,
      });

      // Set image preview if editing
      if (banner.image) {
        setImagePreview(banner.image);
      }
    } else {
      // Reset form for new banner
      setFormData({
        image: null,
        btn_txt: "",
        btn_link: "",
        status: true,
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [banner]);

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

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }

    // Reset the input
    e.target.value = "";
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.btn_txt.trim()) {
      newErrors.btn_txt = "Button text is required";
    }

    if (!formData.btn_link.trim()) {
      newErrors.btn_link = "Button link is required";
    } else {
      // Basic URL validation
      try {
        new URL(formData.btn_link);
      } catch {
        newErrors.btn_link = "Please enter a valid URL";
      }
    }

    // For new banners, image is required
    if (!banner && !formData.image) {
      newErrors.image = "Banner image is required";
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
    const submitData = new FormData();
    submitData.append("btn_txt", formData.btn_txt.trim());
    submitData.append("btn_link", formData.btn_link.trim());
    submitData.append("status", formData.status);

    // Only append image if it's a new file
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner ? "Edit Banner" : "Create New Banner"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Banner Image {!banner && "*"}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload banner image</p>
              <p className="text-sm text-gray-500 mb-4">
                JPG, PNG or GIF (max 5MB)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button type="button" variant="outline" asChild>
                  <span>Choose Image</span>
                </Button>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Selected Image
                </h4>
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {errors.image && (
              <p className="text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <Label htmlFor="btn_txt">Button Text *</Label>
            <Input
              id="btn_txt"
              type="text"
              value={formData.btn_txt}
              onChange={(e) => handleInputChange("btn_txt", e.target.value)}
              placeholder="e.g., Shop Now, Learn More"
              className={errors.btn_txt ? "border-red-500" : ""}
            />
            {errors.btn_txt && (
              <p className="text-sm text-red-600">{errors.btn_txt}</p>
            )}
          </div>

          {/* Button Link */}
          <div className="space-y-2">
            <Label htmlFor="btn_link">Button Link *</Label>
            <Input
              id="btn_link"
              type="url"
              value={formData.btn_link}
              onChange={(e) => handleInputChange("btn_link", e.target.value)}
              placeholder="https://example.com"
              className={errors.btn_link ? "border-red-500" : ""}
            />
            {errors.btn_link && (
              <p className="text-sm text-red-600">{errors.btn_link}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="status">Active Status</Label>
              <p className="text-sm text-gray-500">
                Enable or disable this banner
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status}
              onCheckedChange={(checked) =>
                handleSwitchChange("status", checked)
              }
            />
          </div>

          {/* Preview */}
          {formData.btn_txt && formData.btn_link && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Preview:</strong>
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Button: </span>
                <Button size="sm" variant="outline" disabled>
                  {formData.btn_txt}
                </Button>
                <span className="text-sm text-gray-500">
                  → {formData.btn_link}
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
                  {banner ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {banner ? "Update Banner" : "Create Banner"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BannerForm;
