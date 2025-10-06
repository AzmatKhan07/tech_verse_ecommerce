import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/lib/hooks/use-toast";
import { useCreateProduct } from "@/lib/query/hooks/useProducts";
import { useBrands } from "@/lib/query/hooks/useBrands";
import { useCategories } from "@/lib/query/hooks/useCategories";
import { useTaxes } from "@/lib/query/hooks/useTaxes";
import { useColors } from "@/lib/query/hooks/useColors";
import { useSizes } from "@/lib/query/hooks/useSizes";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // API hooks
  const createProductMutation = useCreateProduct();
  const { data: brandsData, isLoading: brandsLoading } = useBrands({
    page_size: 100,
    status: true,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page_size: 100,
    is_active: true,
  });
  const { data: taxesData, isLoading: taxesLoading } = useTaxes({
    page_size: 100,
    status: true,
  });
  const { data: colorsData, isLoading: colorsLoading } = useColors({
    page_size: 100,
    status: true,
  });
  const { data: sizesData, isLoading: sizesLoading } = useSizes({
    page_size: 100,
    status: true,
  });

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    brand: "",
    model: "",
    short_desc: "",
    desc: "",
    keywords: "",
    technical_specification: "",
    uses: "",
    warranty: "",
    lead_time: "",
    tax: "",
    is_promo: false,
    is_featured: false,
    is_discounted: false,
    is_tranding: false,
    is_arrival: false,
    status: true,
    image: null,
    images: [{ image: null }],
    attributes: [
      {
        sku: "",
        attr_image: null,
        mrp: "",
        price: "",
        qty: "",
        size: "",
        color: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [attributeImagePreviews, setAttributeImagePreviews] = useState({});
  console.log("🔍 AddProduct - FormData:", formData);
  // Debug formData state changes
  useEffect(() => {
    console.log("🔍 AddProduct - FormData state changed:", formData);
    console.log("🔍 AddProduct - Attributes:", formData.attributes);
    console.log("🔍 AddProduct - Images structure:", formData.images);
    console.log(
      "🔍 AddProduct - Images with files:",
      formData.images.filter((img) => img.image !== null)
    );
    console.log("🔍 AddProduct - Main image:", formData.image);
  }, [formData]);

  // Extract data from API responses
  const brands = brandsData || [];
  const categories = categoriesData?.categories || [];
  const taxes = taxesData || [];
  const colors = colorsData || [];
  const sizes = sizesData || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleMainImageChange = (e) => {
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

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          images: "Please select valid image files",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: "Image size must be less than 5MB",
        }));
        return;
      }

      // Add file to images array with the new structure
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { image: file }],
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Clear error
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }

    // Reset the input
    e.target.value = "";
  };

  const removeMainImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const removeAdditionalImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAttributeImageChange = (attributeIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [`attr_image_${attributeIndex}`]: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [`attr_image_${attributeIndex}`]: "Image size must be less than 5MB",
        }));
        return;
      }

      // Update the attribute with the image file
      updateAttribute(attributeIndex, "attr_image", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttributeImagePreviews((prev) => ({
          ...prev,
          [attributeIndex]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors[`attr_image_${attributeIndex}`]) {
        setErrors((prev) => ({
          ...prev,
          [`attr_image_${attributeIndex}`]: "",
        }));
      }
    }

    // Reset the input
    e.target.value = "";
  };

  const removeAttributeImage = (attributeIndex) => {
    updateAttribute(attributeIndex, "attr_image", null);
    setAttributeImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[attributeIndex];
      return newPreviews;
    });
  };

  const addAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          sku: "",
          attr_image: null,
          mrp: "",
          price: "",
          qty: "",
          size: "",
          color: "",
        },
      ],
    }));
  };

  const removeAttribute = (index) => {
    if (formData.attributes.length > 1) {
      setFormData((prev) => ({
        ...prev,
        attributes: prev.attributes.filter((_, i) => i !== index),
      }));
    }
  };

  const updateAttribute = (index, field, value) => {
    console.log(
      `🔧 Updating attribute ${index}, field: ${field}, value:`,
      value
    );
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
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

    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (!formData.short_desc.trim()) {
      newErrors.short_desc = "Short description is required";
    }

    if (!formData.desc.trim()) {
      newErrors.desc = "Description is required";
    }

    if (!formData.image) {
      newErrors.image = "Main product image is required";
    }

    // Validate attributes
    formData.attributes.forEach((attr, index) => {
      if (!attr.sku.trim()) {
        newErrors[`attr_sku_${index}`] = "SKU is required";
      }
      if (!attr.mrp || parseFloat(attr.mrp) <= 0) {
        newErrors[`attr_mrp_${index}`] = "Valid MRP is required";
      }
      if (!attr.price || parseFloat(attr.price) <= 0) {
        newErrors[`attr_price_${index}`] = "Valid price is required";
      }
      if (!attr.qty || parseInt(attr.qty) < 0) {
        newErrors[`attr_qty_${index}`] = "Valid quantity is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare form data for API
      const submitData = new FormData();

      // Basic product information
      submitData.append("category", formData.category);
      submitData.append("name", formData.name.trim());
      submitData.append("brand", formData.brand);
      submitData.append("model", formData.model.trim());
      submitData.append("short_desc", formData.short_desc.trim());
      submitData.append("desc", formData.desc.trim());
      submitData.append("keywords", formData.keywords.trim());
      submitData.append(
        "technical_specification",
        formData.technical_specification.trim()
      );
      submitData.append("uses", formData.uses.trim());
      submitData.append("warranty", formData.warranty.trim());
      submitData.append("lead_time", formData.lead_time.trim());
      submitData.append("tax", formData.tax);
      submitData.append("is_promo", formData.is_promo);
      submitData.append("is_featured", formData.is_featured);
      submitData.append("is_discounted", formData.is_discounted);
      submitData.append("is_tranding", formData.is_tranding);
      submitData.append("is_arrival", formData.is_arrival);
      submitData.append("status", formData.status);
      // Add main image
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Add additional images as individual file uploads
      const additionalImages = formData.images
        .filter((img) => img.image !== null) // Filter out null images
        .map((img) => img.image);

      // Append each additional image as a separate file upload
      additionalImages.forEach((imageFile) => {
        submitData.append("images", imageFile);
      });
      // Add slug (auto-generated from name)
      const slug = formData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      submitData.append("slug", slug);

      // Add attributes as FormData array fields so attr_image can be sent as a file
      formData.attributes.forEach((attr, index) => {
        submitData.append(`attributes[${index}][sku]`, (attr.sku || "").trim());
        submitData.append(
          `attributes[${index}][mrp]`,
          String(parseFloat(attr.mrp) || 0)
        );
        submitData.append(
          `attributes[${index}][price]`,
          String(parseFloat(attr.price) || 0)
        );
        submitData.append(
          `attributes[${index}][qty]`,
          String(parseInt(attr.qty) || 0)
        );
        submitData.append(
          `attributes[${index}][size]`,
          String(attr.size ? parseInt(attr.size) : 0)
        );
        submitData.append(
          `attributes[${index}][color]`,
          String(attr.color ? parseInt(attr.color) : 0)
        );

        // Attach attr_image as a file if provided
        if (attr.attr_image && attr.attr_image instanceof File) {
          submitData.append(
            `attributes[${index}][attr_image]`,
            attr.attr_image
          );
        }
      });

      // Debug attributes data
      console.log(
        "🔗 AddProduct - Raw attributes from formData:",
        formData.attributes
      );

      // Debug: Log FormData contents
      console.log("🔗 AddProduct - FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      // Debug: Log attributes data specifically
      console.log("🔗 AddProduct - Attributes data:", formData.attributes);
      console.log("🔗 AddProduct - Images count:", formData.images.length);
      console.log(
        "🔗 AddProduct - Additional images (files):",
        additionalImages
      );
      console.log(
        "🔗 AddProduct - Main image:",
        formData.image ? formData.image.name : "No main image"
      );
      console.log(
        "🔗 AddProduct - Attribute images:",
        formData.attributes.map((attr, index) => ({
          index,
          hasImage: !!attr.attr_image,
          imageName:
            attr.attr_image instanceof File ? attr.attr_image.name : "No image",
        }))
      );

      await createProductMutation.mutateAsync(submitData);

      toast({
        title: "Product Created",
        description: `${formData.name} has been created successfully.`,
        variant: "default",
      });

      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>
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
                    <Label htmlFor="name">Product Name *</Label>
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

                  {/* Brand, Category, and Model */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Brand *</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) =>
                          handleSelectChange("brand", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.brand ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandsLoading ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading brands...
                            </SelectItem>
                          ) : (
                            brands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.brand && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.brand}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.category ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading categories...
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.category_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        name="model"
                        type="text"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="Enter model"
                        className={errors.model ? "border-red-500" : ""}
                      />
                      {errors.model && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.model}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="short_desc">Short Description *</Label>
                      <textarea
                        id="short_desc"
                        name="short_desc"
                        rows={3}
                        value={formData.short_desc}
                        onChange={handleChange}
                        placeholder="Brief product description"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                          errors.short_desc
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.short_desc && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.short_desc}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="desc">Full Description *</Label>
                      <textarea
                        id="desc"
                        name="desc"
                        rows={3}
                        value={formData.desc}
                        onChange={handleChange}
                        placeholder="Detailed product description"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                          errors.desc ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.desc && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Keywords and Tax */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        name="keywords"
                        type="text"
                        value={formData.keywords}
                        onChange={handleChange}
                        placeholder="SEO keywords (comma separated)"
                      />
                    </div>

                    <div>
                      <Label>Tax</Label>
                      <Select
                        value={formData.tax}
                        onValueChange={(value) =>
                          handleSelectChange("tax", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Tax" />
                        </SelectTrigger>
                        <SelectContent>
                          {taxesLoading ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading taxes...
                            </SelectItem>
                          ) : (
                            taxes.map((tax) => (
                              <SelectItem
                                key={tax.id}
                                value={tax.id.toString()}
                              >
                                {tax.tax_desc} ({tax.tax_value}%)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="technical_specification">
                        Technical Specification
                      </Label>
                      <textarea
                        id="technical_specification"
                        name="technical_specification"
                        rows={3}
                        value={formData.technical_specification}
                        onChange={handleChange}
                        placeholder="Technical details"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="uses">Uses</Label>
                      <textarea
                        id="uses"
                        name="uses"
                        rows={3}
                        value={formData.uses}
                        onChange={handleChange}
                        placeholder="Product uses"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        name="warranty"
                        type="text"
                        value={formData.warranty}
                        onChange={handleChange}
                        placeholder="e.g., 1 year"
                      />
                    </div>
                  </div>

                  {/* Lead Time */}
                  <div>
                    <Label htmlFor="lead_time">Lead Time</Label>
                    <Input
                      id="lead_time"
                      name="lead_time"
                      type="text"
                      value={formData.lead_time}
                      onChange={handleChange}
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Attributes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Attributes</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAttribute}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Attribute
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Attribute {index + 1}</h4>
                        {formData.attributes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAttribute(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>SKU *</Label>
                          <Input
                            value={attr.sku}
                            onChange={(e) =>
                              updateAttribute(index, "sku", e.target.value)
                            }
                            placeholder="Product SKU"
                            className={
                              errors[`attr_sku_${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors[`attr_sku_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`attr_sku_${index}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>MRP *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={attr.mrp}
                            onChange={(e) =>
                              updateAttribute(index, "mrp", e.target.value)
                            }
                            placeholder="0.00"
                            className={
                              errors[`attr_mrp_${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors[`attr_mrp_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`attr_mrp_${index}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>Selling Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={attr.price}
                            onChange={(e) =>
                              updateAttribute(index, "price", e.target.value)
                            }
                            placeholder="0.00"
                            className={
                              errors[`attr_price_${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors[`attr_price_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`attr_price_${index}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={attr.qty}
                            onChange={(e) =>
                              updateAttribute(index, "qty", e.target.value)
                            }
                            placeholder="0"
                            className={
                              errors[`attr_qty_${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {errors[`attr_qty_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`attr_qty_${index}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>Size</Label>
                          <Select
                            value={attr.size}
                            onValueChange={(value) =>
                              updateAttribute(index, "size", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizesLoading ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Loading sizes...
                                </SelectItem>
                              ) : (
                                sizes.map((size) => (
                                  <SelectItem
                                    key={size.id}
                                    value={size.id.toString()}
                                  >
                                    {size.size}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Color</Label>
                          <Select
                            value={attr.color}
                            onValueChange={(value) =>
                              updateAttribute(index, "color", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Color" />
                            </SelectTrigger>
                            <SelectContent>
                              {colorsLoading ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Loading colors...
                                </SelectItem>
                              ) : (
                                colors.map((color) => (
                                  <SelectItem
                                    key={color.id}
                                    value={color.id.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: color.color }}
                                      />
                                      {color.color}
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Attribute Image Upload */}
                      <div className="mt-4">
                        <Label>Attribute Image (Optional)</Label>
                        <div className="space-y-3">
                          {/* Image Upload */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload attribute image
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              JPG, PNG or GIF (max 5MB)
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleAttributeImageChange(index, e)
                              }
                              className="hidden"
                              id={`attr-image-upload-${index}`}
                            />
                            <label htmlFor={`attr-image-upload-${index}`}>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <span>Choose Image</span>
                              </Button>
                            </label>
                          </div>

                          {/* Attribute Image Preview */}
                          {attributeImagePreviews[index] && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">
                                Attribute Image
                              </h5>
                              <div className="relative group">
                                <img
                                  src={attributeImagePreviews[index]}
                                  alt={`Attribute ${index + 1} preview`}
                                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeAttributeImage(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {errors[`attr_image_${index}`] && (
                            <p className="text-sm text-red-600">
                              {errors[`attr_image_${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Product Images and Settings */}
            <div className="space-y-6">
              {/* Main Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Main Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload main product image
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <label htmlFor="main-image-upload">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose Image</span>
                        </Button>
                      </label>
                    </div>

                    {/* Main Image Preview */}
                    {imagePreview && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Main Image
                        </h4>
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Main product preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeMainImage}
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
                </CardContent>
              </Card>

              {/* Additional Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload additional images
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG or GIF (max 5MB each). You can select multiple
                        images.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                        id="additional-images-upload"
                      />
                      <label htmlFor="additional-images-upload">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose Images</span>
                        </Button>
                      </label>
                    </div>

                    {/* Additional Images Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Additional Images ({imagePreviews.length})
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {imagePreviews.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Additional preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute top-2 right-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeAdditionalImage(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
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

              {/* Product Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Featured */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_featured">Featured Product</Label>
                      <p className="text-sm text-gray-500">
                        Mark this product as featured
                      </p>
                    </div>
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("is_featured", checked)
                      }
                    />
                  </div>

                  {/* Promo */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_promo">Promo Product</Label>
                      <p className="text-sm text-gray-500">
                        Mark this product as promotional
                      </p>
                    </div>
                    <Switch
                      id="is_promo"
                      checked={formData.is_promo}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("is_promo", checked)
                      }
                    />
                  </div>

                  {/* Discounted */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_discounted">Discounted Product</Label>
                      <p className="text-sm text-gray-500">
                        Mark this product as discounted
                      </p>
                    </div>
                    <Switch
                      id="is_discounted"
                      checked={formData.is_discounted}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("is_discounted", checked)
                      }
                    />
                  </div>

                  {/* Trending */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_tranding">Trending Product</Label>
                      <p className="text-sm text-gray-500">
                        Mark this product as trending
                      </p>
                    </div>
                    <Switch
                      id="is_tranding"
                      checked={formData.is_tranding}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("is_tranding", checked)
                      }
                    />
                  </div>

                  {/* New Arrival */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_arrival">New Arrival</Label>
                      <p className="text-sm text-gray-500">
                        Mark this product as new arrival
                      </p>
                    </div>
                    <Switch
                      id="is_arrival"
                      checked={formData.is_arrival}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("is_arrival", checked)
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="status">Active Status</Label>
                      <p className="text-sm text-gray-500">
                        Enable or disable this product
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
                    disabled={createProductMutation.isPending}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Product...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/admin/products")}
                    disabled={createProductMutation.isPending}
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
