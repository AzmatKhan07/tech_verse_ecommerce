import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";

const AccountDetails = () => {
  const { user, updateProfile, updatePassword } = useUser();

  // Account details state
  const [accountForm, setAccountForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.displayName || "",
    email: user.email || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  // Form states
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Handle account form changes
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save account changes
  const handleAccountSave = async (e) => {
    e.preventDefault();
    setIsAccountLoading(true);
    setAccountMessage("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateProfile(accountForm);
      setAccountMessage("Account details updated successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setAccountMessage(""), 3000);
    } catch (error) {
      setAccountMessage("Failed to update account details. Please try again.");
    } finally {
      setIsAccountLoading(false);
    }
  };

  // Save password changes
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordMessage("");

    // Validate password fields
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.repeatPassword
    ) {
      setPasswordMessage("All password fields are required.");
      setIsPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setPasswordMessage("New passwords do not match.");
      setIsPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters long.");
      setIsPasswordLoading(false);
      return;
    }

    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordMessage("Password updated successfully!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
      });

      // Clear message after 3 seconds
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      setPasswordMessage(
        "Failed to update password. Please check your current password."
      );
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Account Details Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Account Details
        </h2>

        <form onSubmit={handleAccountSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                FIRST NAME *
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={accountForm.firstName}
                onChange={handleAccountChange}
                placeholder="First name"
                required
                className="w-full"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                LAST NAME *
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={accountForm.lastName}
                onChange={handleAccountChange}
                placeholder="Last name"
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              DISPLAY NAME *
            </label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              value={accountForm.displayName}
              onChange={handleAccountChange}
              placeholder="Display name"
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be how your name will be displayed in the account
              section and in reviews
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              EMAIL *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={accountForm.email}
              onChange={handleAccountChange}
              placeholder="Email"
              required
              className="w-full"
            />
          </div>

          {/* Account Message */}
          {accountMessage && (
            <div
              className={`p-3 rounded-md text-sm ${
                accountMessage.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {accountMessage}
            </div>
          )}

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isAccountLoading}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2"
          >
            {isAccountLoading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Password</h2>

        <form onSubmit={handlePasswordSave} className="space-y-6">
          {/* Old Password */}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              OLD PASSWORD
            </label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old password"
              className="w-full"
            />
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              NEW PASSWORD
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New password"
              className="w-full"
            />
          </div>

          {/* Repeat New Password */}
          <div>
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              REPEAT NEW PASSWORD
            </label>
            <Input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              value={passwordForm.repeatPassword}
              onChange={handlePasswordChange}
              placeholder="Repeat new password"
              className="w-full"
            />
          </div>

          {/* Password Message */}
          {passwordMessage && (
            <div
              className={`p-3 rounded-md text-sm ${
                passwordMessage.includes("successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {passwordMessage}
            </div>
          )}

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isPasswordLoading}
            className="bg-black text-white hover:bg-gray-800 px-8 py-2"
          >
            {isPasswordLoading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccountDetails;
