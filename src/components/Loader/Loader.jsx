import React from "react";
import { Rings } from "react-loader-spinner";
const Loader = () => {
  return (
    <Rings
      visible={true}
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="rings-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;
