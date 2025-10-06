import { couponService } from "../coupon";

// Mock the apiClient
jest.mock("../api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from "../api";

describe("CouponService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCoupons", () => {
    it("should fetch coupons with params", async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 1,
              title: "Test Coupon",
              code: "TEST10",
              value: 10,
              type: "Per",
              min_order_amt: 100,
              status: true,
            },
          ],
          count: 1,
        },
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await couponService.getCoupons({ search: "test" });

      expect(apiClient.get).toHaveBeenCalledWith("/v1/core/coupons/", {
        params: { search: "test" },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors properly", async () => {
      const mockError = {
        response: {
          status: 404,
          data: { detail: "Not found" },
        },
      };

      apiClient.get.mockRejectedValue(mockError);

      await expect(couponService.getCoupons()).rejects.toThrow(
        "API Error: 404 - Not found"
      );
    });
  });

  describe("createCoupon", () => {
    it("should create a new coupon", async () => {
      const couponData = {
        title: "New Coupon",
        code: "NEW10",
        value: 10,
        type: "Per",
        min_order_amt: 50,
        status: true,
      };

      const mockResponse = {
        data: { id: 1, ...couponData },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await couponService.createCoupon(couponData);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/v1/core/coupons/",
        couponData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("validateCoupon", () => {
    it("should validate a coupon", async () => {
      const mockResponse = {
        data: {
          valid: true,
          discount: 10,
          message: "Coupon is valid",
        },
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await couponService.validateCoupon("TEST10", 100);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/v1/core/coupons/validate_coupon/",
        {
          code: "TEST10",
          order_amount: 100,
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
