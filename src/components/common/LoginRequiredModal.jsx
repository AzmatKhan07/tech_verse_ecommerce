import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogIn, UserPlus } from "lucide-react";

/**
 * LoginRequiredModal Component
 * Shows a modal when user tries to add to cart without being authenticated
 */
const LoginRequiredModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Login Required
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Please sign in to your account to add items to your cart and
            continue shopping.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-4">
              You need to be logged in to add products to your cart. Don't
              worry, it only takes a moment!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 text-white" onClick={onClose}>
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 py-3"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 text-white hover:text-white"
              onClick={onClose}
            >
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 py-3"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              New to our store? Create an account to get started!
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Continue Shopping (Guest)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredModal;
