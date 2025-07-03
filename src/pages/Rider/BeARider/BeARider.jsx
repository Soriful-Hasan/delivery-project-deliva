import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuthContext from "../../../hooks/useAuthContext";

const BeARider = () => {
  const axiosInstance = useAxiosSecure();
  const { user } = useAuthContext();
  const warehouseRegions = useLoaderData();
  const { register, handleSubmit, reset } = useForm();
  const [selectedRegion, setSelectedRegion] = useState("");

  const onSubmit = (data) => {
    console.log("Rider Form Data:", data);
    axiosInstance
      .post("/beARider", data)
      .then((res) => {
        if (res.data.insertedId) {
          alert("data save successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectedRegionData = warehouseRegions.find(
    (item) => item.region === selectedRegion
  );

  return (
    <div className="max-w-3xl  mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4">Be a Rider</h2>
      <p className="text-center mb-6 text-gray-500">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Your Name"
            value={user?.displayName}
            className="input input-bordered w-full"
          />
          <input
            {...register("age", { required: true })}
            type="number"
            placeholder="Your Age"
            className="input input-bordered w-full"
          />
        </div>

        {/* Email & Region */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("email", { required: true })}
            type="email"
            value={user?.email}
            placeholder="Your Email"
            className="input input-bordered w-full"
          />
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Select your region</option>
            {[...new Set(warehouseRegions.map((item) => item.region))].map(
              (region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              )
            )}
          </select>
        </div>

        {/* NID & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("nid", { required: true })}
            type="text"
            placeholder="NID No"
            className="input input-bordered w-full"
          />
          <input
            {...register("contact", { required: true })}
            type="text"
            placeholder="Contact"
            className="input input-bordered w-full"
          />
        </div>

        {/* Warehouse Selection */}
        <div>
          <select
            {...register("warehouse", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select wire-house</option>
            {selectedRegionData?.covered_area.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div>
          <button className="btn btn-success w-full" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
