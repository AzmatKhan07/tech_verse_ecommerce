import { loadStripe } from "@stripe/stripe-js";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SE2f9Go7gD4lMmG4mPXvQZmveugEKIDFW2V1BWEoYS0cDJJofBx3WGjMk2hRbyrPzHEh5ETDGvZf44Q9jNflQ4100VQ9TA0uC"
);

export default stripePromise;
