import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../cart/CheckoutForm";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  // "pk_test_51SE2f9Go7gD4lMmG4mPXvQZmveugEKIDFW2V1BWEoYS0cDJJofBx3WGjMk2hRbyrPzHEh5ETDGvZf44Q9jNflQ4100VQ9TA0uC"
);

const StripeElements = ({ onNext, onBack }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onNext={onNext} onBack={onBack} />
    </Elements>
  );
};

export default StripeElements;
