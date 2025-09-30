import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { useCategories } from "@/lib/query/hooks/useCategories";

export const CategoryForm = ({ category, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
    is_active: true,
    is_home: false,
    parent_category: 0,
  });
  const [errors, setErrors] = useState({});
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  // Load all categories for parent selection
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories({ page_size: 100 }); // Load more categories for dropdown

  const categories = categoriesData?.categories || [];

  // Populate form when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.category_name || category.name || "",
        slug: category.category_slug || category.slug || "",
        description: category.description || "",
        image: null, // Don't pre-populate image field for editing
        is_active:
          category.status !== undefined
            ? category.status
            : category.is_active !== undefined
            ? category.is_active
            : true,
        is_home: category.is_home !== undefined ? category.is_home : false,
        parent_category: category.parent_category || 0,
      });

      // Set current image URL separately for display
      setCurrentImageUrl(category.category_image || category.image || null);
    }
  }, [category]);

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-generate slug when name changes
      if (field === "name" && !category) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Image validation is handled in handleFileUpload function
    // No additional validation needed here since file validation is done on upload

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter category name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => handleInputChange("slug", e.target.value)}
          placeholder="category-slug"
          className={errors.slug ? "border-red-500" : ""}
        />
        {errors.slug && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errors.slug}
          </div>
        )}
        <p className="text-xs text-gray-500">
          URL-friendly version of the name. Used in category URLs.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter category description (optional)"
          rows={3}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errors.description}
          </div>
        )}
        <p className="text-xs text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Parent Category */}
      <div className="space-y-2">
        <Label htmlFor="parent_category">Parent Category</Label>
        <Select
          value={formData.parent_category.toString()}
          onValueChange={(value) =>
            handleInputChange("parent_category", parseInt(value))
          }
        >
          <SelectTrigger
            className={errors.parent_category ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select parent category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No Parent (Top Level)</SelectItem>
            {categoriesLoading ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading categories...
                </div>
              </SelectItem>
            ) : categoriesError ? (
              <SelectItem value="error" disabled>
                Error loading categories
              </SelectItem>
            ) : (
              categories
                .filter((cat) => !category || cat.id !== category.id) // Don't allow self as parent
                .filter((cat) => cat.id && cat.id.toString().trim() !== "") // Ensure valid ID
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.category_name || cat.name}
                  </SelectItem>
                ))
            )}
          </SelectContent>
        </Select>
        {errors.parent_category && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errors.parent_category}
          </div>
        )}
        <p className="text-xs text-gray-500">
          Select a parent category to create a subcategory, or leave as "No
          Parent" for top-level categories
        </p>
      </div>

      {/* Category Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Category Image</Label>
        <div className="flex items-center gap-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className={errors.image ? "border-red-500" : ""}
          />
          {(formData.image || currentImageUrl) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {formData.image
                  ? formData.image.name
                  : currentImageUrl
                  ? "Current image"
                  : ""}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, image: null }));
                  setCurrentImageUrl(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
        {errors.image && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {errors.image}
          </div>
        )}
        <p className="text-xs text-gray-500">
          Optional image for the category (JPEG, PNG, GIF, WebP - max 5MB)
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="is_active">Active Status</Label>
          <p className="text-sm text-gray-500">
            Active categories are visible to customers
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange("is_active", checked)}
        />
      </div>

      {/* Home Category */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="is_home">Home Category</Label>
          <p className="text-sm text-gray-500">
            Show this category on the home page
          </p>
        </div>
        <Switch
          id="is_home"
          checked={formData.is_home}
          onCheckedChange={(checked) => handleInputChange("is_home", checked)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {category ? "Updating..." : "Creating..."}
            </>
          ) : category ? (
            "Update Category"
          ) : (
            "Create Category"
          )}
        </Button>
      </div>
    </form>
  );
};
