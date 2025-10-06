import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import { useValidateCouponMutation } from "@/lib/query/hooks/useCoupons";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Tag, CheckCircle, XCircle, Loader2 } from "lucide-react";

const CouponValidator = ({
  orderAmount = 0,
  onCouponApplied,
  appliedCoupon = null,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();
  const user = useCurrentUser();
  const validateCouponMutation = useValidateCouponMutation();

  const handleValidateCoupon = async (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply coupons",
        variant: "destructive",
      });
      return;
    }

    console.log(
      "🔍 CouponValidator: Starting validation for:",
      couponCode.trim().toUpperCase()
    );
    console.log("🔍 Order amount:", orderAmount);
    console.log("🔍 User:", user?.email);

    setIsValidating(true);

    try {
      const result = await validateCouponMutation.mutateAsync({
        code: couponCode.trim().toUpperCase(),
        orderAmount,
      });

      console.log("✅ CouponValidator: Validation successful:", result);

      toast({
        title: "Coupon Applied!",
        description: `You saved ${result.discount} PKR with coupon ${couponCode}`,
        variant: "default",
      });

      // Call the parent callback with the validated coupon data
      if (onCouponApplied) {
        onCouponApplied({
          code: couponCode.trim().toUpperCase(),
          discount: result.discount,
          coupon: result.coupon,
        });
      }

      setCouponCode("");
    } catch (error) {
      console.log("❌ CouponValidator: Validation failed:", error);
      toast({
        title: "Invalid Coupon",
        description: error.message || "This coupon cannot be applied",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    if (onCouponApplied) {
      onCouponApplied(null);
    }
  };

  const formatDiscount = (coupon) => {
    if (coupon.type === "Per") {
      return `${coupon.value}%`;
    }
    return `${coupon.value} PKR`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Apply Coupon
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appliedCoupon ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Coupon Applied: {appliedCoupon.code}
                  </p>
                  <p className="text-sm text-green-700">
                    You saved {appliedCoupon.discount} PKR
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleValidateCoupon} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isValidating || !couponCode.trim()}
                  className="px-6"
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </div>

            {orderAmount > 0 && (
              <div className="text-sm text-gray-600">
                Order amount: {orderAmount} PKR
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponValidator;
