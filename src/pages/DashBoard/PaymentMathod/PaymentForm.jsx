import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </CardElement>
    </form>
  );
};

export default PaymentForm;
