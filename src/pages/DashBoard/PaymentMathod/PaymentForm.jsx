import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Await, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AwardIcon } from "lucide-react";

const PaymentForm = () => {
  const AxiosSecure = useAxiosSecure();
  const { parcelId } = useParams();
  console.log(parcelId);
  const {
    isPending,
    isError,
    data: parcelData = {},
  } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await AxiosSecure.get(`/parcel/${parcelId}`);
      return res.data;
    },
  });
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState("");
  const amount = parcelData.amount;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod);
    }

    // create payment intent
    const res = await AxiosSecure.post("/create-payment-intent", {
      amount,
      parcelId,
    });

    const clientSecret = res.data.clientSecret;
    console.log(clientSecret);
    // conform payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: "Your User Name", // or from user info
          email: "user@example.com",
        },
      },
    });
    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log(result  );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full  lg:w-5/11 mx-auto mt-10 border bg-white p-10 rounded border-gray-100"
    >
      <CardElement></CardElement>
      <button
        className="btn w-full mt-20 btn-primary text-black"
        type="submit"
        disabled={!stripe}
      >
        Pay ${amount}
      </button>
      <p className="mt-4 text-red-500 text-sm font-bold">{error}</p>
    </form>
  );
};

export default PaymentForm;
