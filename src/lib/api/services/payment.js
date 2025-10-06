import apiClient from "../api";

/**
 * PaymentService - Handles payment-related API operations
 */
class PaymentService {
  constructor() {
    this.baseURL = "/v1/payments";
  }

  // Create payment intent
  async createPaymentIntent(orderData) {
    try {
      console.log("💳 Creating payment intent:", orderData);
      const response = await apiClient.post(
        `${this.baseURL}/create-payment-intent/`,
        orderData
      );
      console.log("✅ Payment intent created successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error creating payment intent:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      console.log("💳 Confirming payment:", {
        paymentIntentId,
        paymentMethodId,
      });
      const response = await apiClient.post(
        `${this.baseURL}/confirm-payment/`,
        {
          payment_intent_id: paymentIntentId,
          payment_method_id: paymentMethodId,
        }
      );
      console.log("✅ Payment confirmed successfully:", response.status);
      return response.data;
    } catch (error) {
      console.error("❌ Error confirming payment:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data?.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
        throw new Error("Network Error: Unable to connect to the server");
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }
}

// Create and export a singleton instance
const paymentService = new PaymentService();
export default paymentService;
