import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaxForm = ({ tax = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    tax_desc: "",
    tax_value: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [taxType, setTaxType] = useState("percentage"); // "percentage" or "fixed"

  // Common tax percentages for quick selection
  const commonTaxPercentages = [
    "0",
    "5",
    "8",
    "10",
    "12",
    "15",
    "18",
    "20",
    "25",
    "30",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (tax) {
      setFormData({
        tax_desc: tax.tax_desc || "",
        tax_value: tax.tax_value || "",
        status: tax.status !== undefined ? tax.status : true,
      });

      // Determine tax type based on numeric value
      const taxValue = parseFloat(tax.tax_value || "0");
      if (taxValue <= 100 && taxValue >= 0) {
        setTaxType("percentage");
      } else {
        setTaxType("fixed");
      }
    } else {
      // Reset form for new tax
      setFormData({
        tax_desc: "",
        tax_value: "",
        status: true,
      });
      setTaxType("percentage");
    }
    setErrors({});
  }, [tax]);

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

  const handleTaxTypeChange = (type) => {
    setTaxType(type);
    setFormData((prev) => ({
      ...prev,
      tax_value: "",
    }));
    setErrors({});
  };

  const handleTaxValueChange = (value) => {
    let processedValue = value;

    // Remove any non-numeric characters except decimal point and minus sign
    if (taxType === "percentage") {
      processedValue = value.replace(/[^0-9.-]/g, "");
      // Ensure percentage is between 0 and 100
      const numValue = parseFloat(processedValue);
      if (numValue > 100) {
        processedValue = "100";
      }
    } else {
      processedValue = value.replace(/[^0-9.-]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      tax_value: processedValue,
    }));

    // Clear error when user starts typing
    if (errors.tax_value) {
      setErrors((prev) => ({
        ...prev,
        tax_value: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tax_desc.trim()) {
      newErrors.tax_desc = "Tax description is required";
    }

    if (formData.tax_desc.length > 100) {
      newErrors.tax_desc = "Tax description must be less than 100 characters";
    }

    if (!formData.tax_value.trim()) {
      newErrors.tax_value = "Tax value is required";
    }

    const taxValue = parseFloat(formData.tax_value);
    if (isNaN(taxValue)) {
      newErrors.tax_value = "Tax value must be a valid number";
    } else {
      if (taxType === "percentage") {
        if (taxValue < 0 || taxValue > 100) {
          newErrors.tax_value = "Percentage must be between 0 and 100";
        }
      } else {
        if (taxValue < 0) {
          newErrors.tax_value = "Tax value must be positive";
        }
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
    let finalTaxValue = formData.tax_value.trim();

    // For percentage, send only the numeric value (API expects number, not string with %)
    // For fixed amount, send the numeric value as well
    const numericValue = parseFloat(finalTaxValue);

    const submitData = {
      tax_desc: formData.tax_desc.trim(),
      tax_value: numericValue, // Send as number, not string
      status: formData.status,
    };

    onSubmit(submitData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tax ? "Edit Tax" : "Create New Tax"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tax Description */}
          <div className="space-y-2">
            <Label htmlFor="tax_desc">Tax Description *</Label>
            <Textarea
              id="tax_desc"
              value={formData.tax_desc}
              onChange={(e) => handleInputChange("tax_desc", e.target.value)}
              placeholder="Enter tax description (e.g., VAT, Sales Tax, Service Tax)"
              className={errors.tax_desc ? "border-red-500" : ""}
              rows={3}
            />
            {errors.tax_desc && (
              <p className="text-sm text-red-500">{errors.tax_desc}</p>
            )}
          </div>

          {/* Tax Type Selection */}
          <div className="space-y-2">
            <Label>Tax Type *</Label>
            <Select value={taxType} onValueChange={handleTaxTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose tax type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tax Value Input */}
          <div className="space-y-2">
            <Label htmlFor="tax_value">
              Tax Value *{" "}
              {taxType === "percentage" ? "(0-100%)" : "(Fixed Amount)"}
            </Label>
            <div className="space-y-3">
              {/* Manual Input */}
              <Input
                id="tax_value"
                type="text"
                value={formData.tax_value}
                onChange={(e) => handleTaxValueChange(e.target.value)}
                placeholder={
                  taxType === "percentage"
                    ? "Enter percentage (e.g., 18)"
                    : "Enter amount (e.g., 50)"
                }
                className={errors.tax_value ? "border-red-500" : ""}
              />

              {/* Quick Select for Percentage */}
              {taxType === "percentage" && (
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Quick Select:</Label>
                  <Select
                    value={formData.tax_value}
                    onValueChange={(value) => handleTaxValueChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a common percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTaxPercentages.map((percentage) => (
                        <SelectItem key={percentage} value={percentage}>
                          {percentage}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            {errors.tax_value && (
              <p className="text-sm text-red-500">{errors.tax_value}</p>
            )}
          </div>

          {/* Preview */}
          {formData.tax_value && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Preview:</strong> {formData.tax_desc} -{" "}
                {taxType === "percentage"
                  ? `${formData.tax_value}%`
                  : `$${formData.tax_value}`}
              </p>
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
              {isLoading ? "Saving..." : tax ? "Update Tax" : "Create Tax"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaxForm;
