import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

const Signup = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create user data
      const userData = {
        firstName: formData.name.split(" ")[0] || formData.name,
        lastName: formData.name.split(" ")[1] || "",
        displayName: formData.name,
        email: formData.email,
        username: formData.username,
        avatar: null, // No avatar on signup
      };

      // Note: In a real app, you would get the token from the signup response
      // For now, we'll just redirect to signin
      console.log("Signup successful, redirecting to signin");

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <Input
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full ${
                  errors.name ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <Input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full ${
                  errors.username ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email address"
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

            {/* Password Field */}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pr-10 ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree with{" "}
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
                    Terms of Use
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
              className="w-full bg-black text-white hover:bg-gray-800 py-3"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
