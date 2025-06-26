import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuthContext from "../../hooks/useAuthContext";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BookingForm = () => {
  const { user } = useAuthContext();
  const axiosInstance = useAxiosSecure();

  const { register, handleSubmit, watch, reset } = useForm();
  const [senderWarehouses, setSenderWarehouses] = useState([]);
  const [receiverWarehouses, setReceiverWarehouses] = useState([]);
  const [warehouseData, setWareHouseData] = useState([]);

  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const parcelType = watch("parcelType");
  const weight = parseFloat(watch("weight")) || 0;
  const deliveryType = watch("deliveryType"); // within / outside

  const onSubmit = (data) => {
    //calculate delivery cost
    console.log("data", data);
    let calculatedPrice = 0;
    if (parcelType === "document") {
      calculatedPrice = deliveryType === "within" ? 60 : 80;
    } else if (parcelType === "non-document") {
      if (weight <= 3) {
        calculatedPrice = deliveryType === "within" ? 110 : 150;
      } else {
        const extraWeight = weight - 3;
        const extraCost = extraWeight * 40;
        calculatedPrice =
          deliveryType === "within" ? 110 + extraCost : 150 + extraCost + 40;
      }
    }

    // price brackdown
    let breakdown = "";
    if (data.parcelType === "document") {
      breakdown =
        data.deliveryType === "within"
          ? "Document delivery within city = ৳60"
          : "Document delivery outside city = ৳80";
    } else {
      if (parseFloat(data.weight) <= 3) {
        breakdown =
          data.deliveryType === "within"
            ? "Non-Document (≤3kg) within city = ৳110"
            : "Non-Document (≤3kg) outside city = ৳150";
      } else {
        const extraKg = Math.ceil(data.weight - 3);
        const base = data.deliveryType === "within" ? 110 : 150;
        const extra = extraKg * 40;
        const extraText =
          data.deliveryType === "within"
            ? `${extraKg}kg × ৳40 = ৳${extra}`
            : `${extraKg}kg × ৳40 + ৳40 extra = ৳${extra + 40}`;
        breakdown = `Non-Document (>3kg) base = ৳${base}<br>${extraText}`;
      }
    }

    const infoHtml = `
      <div style="text-align: left; font-size: 16px;">
        <h3 style="margin-bottom: 12px; font-weight: bold;">Delivery Cost Breakdown</h3>
        <p><strong>Parcel Type:</strong> ${data.parcelType}</p>
        <p><strong>Weight:</strong> ${data.weight} kg</p>
        <p><strong>Delivery Type:</strong> ${
          data.deliveryType === "within"
            ? "Within City"
            : "Outside City/District"
        }</p>
        <hr style="margin: 10px 0;" />
        <p><strong>Price Details:</strong><br>${breakdown}</p>
        <hr style="margin: 10px 0;" />
        <p style="font-size: 18px; font-weight: bold; color: #e63946;">
          Total Delivery Cost: ৳${calculatedPrice}
        </p>
      </div>
    `;
    const trackingId = `TRK-${Date.now().toString().slice(-6)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    Swal.fire({
      title: "Confirm Delivery Charge",
      html: infoHtml,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Edit Form",
      width: 500,
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          created_by: user.email,
          payment_status: "unpaid",
          delivery_status: "not_collection",
          creation_date: new Date().toISOString(),
          tracking_Id: trackingId,
          amount: calculatedPrice,
        };

        // save date to server ========================
        axiosInstance
          .post(`/parcels`, parcelData)
          .then((res) => {
            console.log("Successfully submit", res.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        Swal.fire("Success!", "Your booking has been confirmed!", "success");
        console.log(parcelData);

        reset();
      }
    });
  };

  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => setWareHouseData(data));
  }, []);

  useEffect(() => {
    const filtered = warehouseData.filter((w) => w.region === senderRegion);
    setSenderWarehouses(filtered);
  }, [senderRegion, warehouseData]);

  useEffect(() => {
    const filtered = warehouseData.filter((w) => w.region === receiverRegion);
    setReceiverWarehouses(filtered);
  }, [receiverRegion, warehouseData]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Parcel Booking Form
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 border p-4 border-gray-300"
      >
        {/* Parcel Type, Weight & Delivery Type */}
        <div className="grid md:grid-cols-4 gap-4  ">
          <div>
            <label className="font-semibold block mb-1 ">Parcel Type</label>
            <div className="flex gap-4 ">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  {...register("parcelType", { required: true })}
                  value="document"
                  className="radio checked:bg-blue-500 "
                />
                <span className="label-text ml-2">Document</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  {...register("parcelType", { required: true })}
                  value="non-document"
                  className="radio  checked:bg-blue-500"
                />
                <span className="label-text ml-2">Non-Document</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              {...register("weight", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">
              Delivery Location
            </label>
            <select
              {...register("deliveryType")}
              className="select select-bordered w-full"
            >
              <option value="within">Within City</option>
              <option value="outside">Outside City/District</option>
            </select>
          </div>
        </div>

        {/* Sender and Receiver Columns */}
        <div className="grid md:grid-cols-2 gap-8 ">
          {/* Sender */}
          <div className="border p-4 rounded bg-gray-50 border-gray-300">
            <h3 className="text-xl font-semibold mb-2">Sender Details</h3>
            <div className="space-y-3">
              <input
                {...register("senderName")}
                placeholder="Sender Name"
                className="input input-bordered w-full"
              />

              {/* Region dropdown */}
              <input
                {...register("senderRegion")}
                placeholder="Sender Region"
                className="input input-bordered w-full"
                list="sender-region-list"
              />
              <datalist id="sender-region-list">
                {[...new Set(warehouseData.map((w) => w.region))].map(
                  (region) => (
                    <option key={region} value={region} />
                  )
                )}
              </datalist>

              {/* Warehouse dropdown based on region */}
              <select
                {...register("senderWarehouse")}
                className="select select-bordered w-full"
              >
                <option value="">Select Sender Warehouse</option>
                {senderWarehouses.map((wh, idx) => (
                  <option key={idx} value={wh.city}>
                    {wh.city} ({wh.district})
                  </option>
                ))}
              </select>

              <input
                {...register("senderAddress")}
                placeholder="Sender Address"
                className="input input-bordered w-full"
              />
              <input
                {...register("senderContact")}
                placeholder="Contact Number"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("pickupInstruction")}
                placeholder="Pickup Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Receiver */}
          <div className="border p-4 rounded bg-gray-50 border-gray-300">
            <h3 className="text-xl font-semibold mb-2">Receiver Details</h3>
            <div className="space-y-3">
              <input
                {...register("receiverName")}
                placeholder="Receiver Name"
                className="input input-bordered w-full"
              />

              {/* Region dropdown */}
              <input
                {...register("receiverRegion")}
                placeholder="Receiver Region"
                className="input input-bordered w-full"
                list="receiver-region-list"
              />
              <datalist id="receiver-region-list">
                {[...new Set(warehouseData.map((w) => w.region))].map(
                  (region) => (
                    <option key={region} value={region} />
                  )
                )}
              </datalist>

              {/* Warehouse dropdown based on region */}
              <select
                {...register("receiverWarehouse")}
                className="select select-bordered w-full"
              >
                <option value="">Select Receiver Warehouse</option>
                {receiverWarehouses.map((wh, idx) => (
                  <option key={idx} value={wh.city}>
                    {wh.city} ({wh.district})
                  </option>
                ))}
              </select>

              <input
                {...register("receiverAddress")}
                placeholder="Receiver Address"
                className="input input-bordered w-full"
              />
              <input
                {...register("receiverContact")}
                placeholder="Receiver Contact Number"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("deliveryInstruction")}
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button type="submit" className="btn btn-primary px-10">
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
