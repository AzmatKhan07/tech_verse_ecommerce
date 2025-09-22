import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const AddProduct = () => {
  const { addProduct } = useAdmin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    status: "Active",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = ["Furniture", "Lighting", "Decor", "Textiles", "Storage"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreviews((prev) => [...prev, imageUrl]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    e.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Determine status based on stock
      let status = "Active";
      const stockNum = parseInt(formData.stock);
      if (stockNum === 0) {
        status = "Out of Stock";
      } else if (stockNum <= 5) {
        status = "Low Stock";
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: stockNum,
        status,
        image: formData.images[0], // Use first image as main image for compatibility
      };

      addProduct(productData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Add Product
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new product for your inventory
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Product Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Category and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Price ($) *
                      </label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Stock Quantity *
                    </label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stock}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Image and Actions */}
            <div className="space-y-6">
              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload product images
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG or GIF (max 5MB each). You can select multiple
                        images.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose Images</span>
                        </Button>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Uploaded Images ({imagePreviews.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {imagePreviews.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              {index === 0 && (
                                <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white">
                                  Main
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.images && (
                      <p className="text-sm text-red-600">{errors.images}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Adding Product..." : "Add Product"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
