import { couponService } from "../coupon";

// Mock the apiClient
jest.mock("../api", () => ({
  post: jest.fn(),
}));

import apiClient from "../api";

describe("Coupon Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateCoupon", () => {
    it("should validate a valid coupon successfully", async () => {
      const mockResponse = {
        data: {
          valid: true,
          discount: 100,
          coupon: {
            id: 1,
            code: "SAVE100",
            title: "Save 100 PKR",
            type: "Value",
            value: 100,
            min_order_amt: 500,
            is_one_time: false,
            status: true,
          },
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await couponService.validateCoupon("SAVE100", 1000);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/v1/core/coupons/validate_coupon/",
        {
          code: "SAVE100",
          order_amount: 1000,
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error for invalid coupon", async () => {
      const mockResponse = {
        data: {
          valid: false,
          message: "Invalid coupon code",
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      await expect(
        couponService.validateCoupon("INVALID", 1000)
      ).rejects.toThrow("Invalid coupon code");
    });

    it("should throw error for one-time coupon already used", async () => {
      const mockResponse = {
        data: {
          valid: false,
          message:
            "This coupon has already been used and can only be used once.",
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      await expect(
        couponService.validateCoupon("ONETIME", 1000)
      ).rejects.toThrow(
        "This coupon has already been used and can only be used once."
      );
    });

    it("should throw error for minimum order amount not met", async () => {
      const mockResponse = {
        data: {
          valid: false,
          message: "Minimum order amount is 500 PKR",
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      await expect(
        couponService.validateCoupon("SAVE100", 300)
      ).rejects.toThrow("Minimum order amount is 500 PKR");
    });

    it("should handle network errors", async () => {
      const mockError = {
        request: {},
      };

      apiClient.post.mockRejectedValue(mockError);

      await expect(
        couponService.validateCoupon("SAVE100", 1000)
      ).rejects.toThrow("Network Error: Unable to connect to the server");
    });
  });
});
