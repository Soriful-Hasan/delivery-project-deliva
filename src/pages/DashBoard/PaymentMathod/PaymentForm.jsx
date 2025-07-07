import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Await, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuthContext from "../../../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { AwardIcon } from "lucide-react";
import Swal from "sweetalert2";
import useTrackingLog from "../../../hooks/useTrakingLog";

const PaymentForm = () => {
  const AxiosSecure = useAxiosSecure();
  const { user } = useAuthContext();
  const displayName = user?.displayName;
  const email = user?.email;
  const { parcelId } = useParams();
  const { mutate: addTrackingLog } = useTrackingLog();
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
  const tracking_Id = parcelData.tracking_Id;

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

    // check card payment method
    if (error) {
      // console.log(error);f
    } else {
      setError("");
      console.log("[PaymentMethod]", paymentMethod);

      // post amount and id on payment intent api
      const res = await AxiosSecure.post("/create-payment-intent", {
        amount,
        parcelId,
      });

      // get client secret on tha res
      const clientSecret = res.data.clientSecret;

      // conform payment when i have a client secret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: displayName,
            email: email,
          },
        },
      });

      // check payment status
      if (result.error) {
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log(result);
          const paymentHistory = {
            parcelId,
            tracking_Id: tracking_Id,
            payment_method: result.paymentIntent.payment_method_types,
            transaction_id: result.paymentIntent.id,
            amount: result.paymentIntent.amount,
            email: email,
          };

          const paymentRes = await AxiosSecure.post("/save", paymentHistory);
          console.log(paymentRes);
          if (paymentRes.data.paymentResult.insertedId) {
            Swal.fire({
              title: "Payment Successful!",
              text: `Transaction ID: ${result.paymentIntent.id}`,
              icon: "success",
              confirmButtonText: "OK",
            });
            addTrackingLog({
              tracking_Id: parcelData.tracking_Id, // string
              status: "payment_done",
              details: `Pay by ${user?.displayName}`, // example status
              updatedBy: user?.email || "system", // from AuthContext
            });
          }
        }
      }
    }

    // create payment intent
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
