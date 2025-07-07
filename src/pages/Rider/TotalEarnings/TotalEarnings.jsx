import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import useAuthContext from "../../../hooks/useAuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TotalEarnings = () => {
  const { user } = useAuthContext();
  const riderEmail = user?.email;
  const axiosSecure = useAxiosSecure();
  const [earnings, setEarnings] = useState({
    today: 0,
    month: 0,
    year: 0,
    pending: 0,
    cashout: 0,
  });

  const { data: parcels = [] } = useQuery({
    queryKey: ["riderEarnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/rider-completed-parcels?email=${riderEmail}`
      );
      return res.data;
    },
  });
  console.log(parcels);

  useEffect(() => {
    if (!parcels.length) return;

    let today = 0;
    let month = 0;
    let year = 0;
    let pending = 0;
    let cashout = 0;

    const now = dayjs();

    for (const parcel of parcels) {
      const amount = Number(parcel.amount) || 0;
      const rate =
        parcel.senderRegion?.trim().toLowerCase() ===
        parcel.receiverRegion?.trim().toLowerCase()
          ? 0.8
          : 0.3;
      const earning = amount * rate;

      const date =
        parcel.cashout_status === "cashed_out"
          ? dayjs(parcel.cashout_date)
          : dayjs(parcel.creation_date);

      if (parcel.cashout_status === "cashed_out") {
        cashout += earning;

        if (date.isSame(now, "day")) today += earning;
        if (date.isSame(now, "month")) month += earning;
        if (date.isSame(now, "year")) year += earning;
      } else {
        pending += earning;

        if (date.isSame(now, "day")) today += earning;
        if (date.isSame(now, "month")) month += earning;
        if (date.isSame(now, "year")) year += earning;
      }
    }

    setEarnings({
      today: today.toFixed(2),
      month: month.toFixed(2),
      year: year.toFixed(2),
      pending: pending.toFixed(2),
      cashout: cashout.toFixed(2),
    });
  }, [parcels]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Rider Earnings Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Today’s Income" amount={earnings.today} />
        <StatCard title="Monthly Income" amount={earnings.month} />
        <StatCard title="Yearly Income" amount={earnings.year} />
        <StatCard title="Pending Cashout" amount={earnings.pending} />
        <StatCard title="Total Cashed Out" amount={earnings.cashout} />
      </div>
    </div>
  );
};

const StatCard = ({ title, amount }) => (
  <div className="bg-white rounded-xl p-4 shadow-md border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-lg font-bold text-green-600">৳ {amount}</p>
  </div>
);

export default TotalEarnings;
