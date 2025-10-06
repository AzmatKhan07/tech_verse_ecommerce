import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutForm from "../CheckoutForm";
import { CartProvider } from "@/context/CartContext";

// Mock the Stripe components
jest.mock("@stripe/react-stripe-js", () => ({
  useStripe: () => ({
    createPaymentMethod: jest.fn(),
    confirmPayment: jest.fn(),
  }),
  useElements: () => ({
    getElement: jest.fn(),
  }),
  CardElement: ({ children }) => <div data-testid="card-element">{children}</div>,
}));

// Mock the payment service
jest.mock("@/lib/api/services/payment", () => ({
  createPaymentIntent: jest.fn(),
}));

// Mock the current user hook
jest.mock("@/lib/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</QueryClientProvider>
    </QueryClientProvider>
  );
};

describe("CheckoutForm", () => {
  it("renders the checkout form with coupon validator", () => {
    render(<CheckoutForm />, { wrapper: createWrapper() });

    expect(screen.getByText("Apply Coupon")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter coupon code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  });

  it("displays order amount in PKR format", () => {
    render(<CheckoutForm />, { wrapper: createWrapper() });

    // Check if PKR is displayed in the order amount
    const orderAmountText = screen.getByText(/Order amount:/);
    expect(orderAmountText).toHaveTextContent("PKR");
  });

  it("shows shipping costs in PKR", () => {
    render(<CheckoutForm />, { wrapper: createWrapper() });

    // Check if shipping section shows PKR
    const shippingText = screen.getByText("Shipping");
    expect(shippingText).toBeInTheDocument();
  });
});
