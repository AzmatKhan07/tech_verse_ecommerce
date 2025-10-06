import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Percent, DollarSign, Tag } from "lucide-react";

const CouponForm = ({
  coupon = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    value: "",
    type: "Per",
    min_order_amt: "",
    is_one_time: false,
    status: true,
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when editing
  useEffect(() => {
    if (coupon) {
      setFormData({
        title: coupon.title || "",
        code: coupon.code || "",
        value: coupon.value || "",
        type: coupon.type || "Per",
        min_order_amt: coupon.min_order_amt || "",
        is_one_time:
          coupon.is_one_time !== undefined ? coupon.is_one_time : false,
        status: coupon.status !== undefined ? coupon.status : true,
      });
    } else {
      // Reset form for new coupon
      setFormData({
        title: "",
        code: "",
        value: "",
        type: "Per",
        min_order_amt: "",
        is_one_time: false,
        status: true,
      });
    }
    setErrors({});
  }, [coupon]);

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

    if (!formData.title.trim()) {
      newErrors.title = "Coupon title is required";
    }

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (formData.code.length > 50) {
      newErrors.code = "Code must be less than 50 characters";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    if (formData.type === "Per" && formData.value > 100) {
      newErrors.value = "Percentage value cannot exceed 100%";
    }

    if (!formData.min_order_amt || formData.min_order_amt < 0) {
      newErrors.min_order_amt = "Minimum order amount must be 0 or greater";
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
      title: formData.title.trim(),
      code: formData.code.trim().toUpperCase(),
      value: parseFloat(formData.value),
      type: formData.type,
      min_order_amt: parseFloat(formData.min_order_amt),
      is_one_time: formData.is_one_time,
      status: formData.status,
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon ? "Edit Coupon" : "Create New Coupon"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Coupon Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter coupon title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code *</Label>
            <Input
              id="code"
              type="text"
              value={formData.code}
              onChange={(e) =>
                handleInputChange("code", e.target.value.toUpperCase())
              }
              placeholder="Enter coupon code (e.g., SAVE10)"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          {/* Coupon Type and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Coupon Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Per">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Percentage
                    </div>
                  </SelectItem>
                  <SelectItem value="Value">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Fixed Value
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                {formData.type === "Per"
                  ? "Percentage (%)"
                  : "Fixed Amount (PKR)"}{" "}
                *
              </Label>
              <Input
                id="value"
                type="number"
                step={formData.type === "Per" ? "0.01" : "0.01"}
                min="0"
                max={formData.type === "Per" ? "100" : undefined}
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                placeholder={formData.type === "Per" ? "10" : "500"}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && (
                <p className="text-sm text-red-500">{errors.value}</p>
              )}
            </div>
          </div>

          {/* Minimum Order Amount */}
          <div className="space-y-2">
            <Label htmlFor="min_order_amt">Minimum Order Amount (PKR) *</Label>
            <Input
              id="min_order_amt"
              type="number"
              step="0.01"
              min="0"
              value={formData.min_order_amt}
              onChange={(e) =>
                handleInputChange("min_order_amt", e.target.value)
              }
              placeholder="0"
              className={errors.min_order_amt ? "border-red-500" : ""}
            />
            {errors.min_order_amt && (
              <p className="text-sm text-red-500">{errors.min_order_amt}</p>
            )}
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_one_time"
                checked={formData.is_one_time}
                onCheckedChange={(checked) =>
                  handleInputChange("is_one_time", checked)
                }
              />
              <div>
                <Label htmlFor="is_one_time">One-time use only</Label>
                <p className="text-xs text-gray-500 mt-1">
                  If enabled, this coupon can only be used once per user
                </p>
              </div>
            </div>

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
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="h-4 w-4" />
              <span>
                {formData.code || "COUPON_CODE"}: {formData.value || "0"}
                {formData.type === "Per" ? "%" : " PKR"} off
                {formData.min_order_amt && formData.min_order_amt > 0 && (
                  <span> (min. {formData.min_order_amt} PKR)</span>
                )}
              </span>
            </div>
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
                : coupon
                ? "Update Coupon"
                : "Create Coupon"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CouponForm;
