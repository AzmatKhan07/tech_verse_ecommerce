import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { useToast } from "@/lib/hooks/use-toast";
import authService from "@/lib/api/services/auth";

const Signup = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user data
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      // Call register API
      const response = await authService.register(userData);

      if (response) {
        // Show success toast
        toast({
          title: "Signup Successful!",
          description: "Your account has been created successfully.",
          variant: "success",
        });

        // Automatically login the user after successful signup
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password,
          });

          // Prepare user data for react-auth-kit
          const userAuthData = {
            id: loginResponse.user?.id || loginResponse.id,
            firstName: loginResponse.user?.first_name,
            lastName: loginResponse.user?.last_name,
            displayName:
              loginResponse.user?.first_name +
              " " +
              loginResponse.user?.last_name,
            email: loginResponse.user?.email,
            role: loginResponse.user?.user_type || "customer",
            mobile: loginResponse.user?.mobile,
          };

          // Sign in with react-auth-kit
          const signInResult = signIn({
            token: loginResponse.tokens?.access || loginResponse.access_token,
            expiresIn: loginResponse.expires_in || 24 * 60 * 60, // 24 hours in seconds
            tokenType: "Bearer",
            authState: userAuthData,
          });

          if (signInResult) {
            // Show login success toast
            toast({
              title: "Welcome!",
              description: "You have been automatically logged in.",
              variant: "success",
            });

            // Redirect to home page with success message
            navigate("/", {
              state: {
                message: "Signup successful! Welcome to our platform.",
              },
            });
          } else {
            throw new Error("Failed to authenticate after signup");
          }
        } catch (loginError) {
          console.error("Auto-login error:", loginError);
          // Even if auto-login fails, signup was successful
          toast({
            title: "Signup Successful!",
            description: "Account created. Please sign in manually.",
            variant: "success",
          });
          navigate("/signin");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Show error toast
      let errorMessage = "Signup failed. Please try again.";

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage =
            data?.detail || data?.message || "Invalid data provided";
        } else if (status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (status === 422) {
          errorMessage = "Please check your information and try again.";
        } else {
          errorMessage = `Signup failed: ${status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center">
        <div className="w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=600&fit=crop&auto=format"
            alt="Comfortable chair with throw blanket"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">
              Join us today and start shopping! Already have an account?{" "}
              <Link
                to="/signin"
                className="text-black hover:text-gray-800 font-medium underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full ${
                    errors.lastName ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full ${
                  errors.phone ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-9 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase,
                lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-9 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree with the{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-black font-medium hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/terms-of-use"
                    className="text-black font-medium hover:underline"
                  >
                    Terms of Service
                  </Link>
                </label>
              </div>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800 py-3 text-base font-medium transition-colors duration-200"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
