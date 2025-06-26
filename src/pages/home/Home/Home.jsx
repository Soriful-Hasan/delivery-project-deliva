import React from "react";
import Slider from "../slider/Slider";
import Services from "../services/ServiceSection";
import SalesTeamsMarque from "../CompanyLogo/SalesTeamsMarque";
import TrustedService from "../TrustedService/TrustedService";
import MarchantCard from "../Become a Merchant/MerchantCard";
import CustomerSay from "../Customer-say/CustomerSay";
import AskedQuestion from "../FAQ/AskedQuestion";

const Home = () => {
  return (
    <div>
      <Slider />
      <Services />
      <SalesTeamsMarque />
      <TrustedService />
      <MarchantCard />
      <CustomerSay />
      <AskedQuestion />
    </div>
  );
};

export default Home;
