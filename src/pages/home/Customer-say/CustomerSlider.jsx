import React, { useState } from "react";
import quateImg from "../../../assets/reviewQuote.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CustomerSlider = () => {
  const data = [
    {
      name: "Awlad Hossain",
      position: "Senior Product Designer",
      title: "hello this is slider 1",
      des: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. ",
    },
    {
      name: "Awlad Hossain",
      position: "Senior Product Designer",
      title: "hello this is slider 1",
      des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, totam fuga dicta tempore odit laborum voluptate iste architecto? Dolores, repellendus!",
    },
    {
      name: "Awlad Hossain",
      position: "Senior Product Designer",
      title: "hello this is slider 1",
      des: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, totam fuga dicta tempore odit laborum voluptate iste architecto? Dolores, repellendus!",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <h1></h1>
      <Swiper
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ el: ".custom-pagination", clickable: true }}
        spaceBetween={30}
        centeredSlides={true}
        slidesPerView={1.5}
        breakpoints={{
          768: {
            slidesPerView: 3, // More slides on larger screens
          },
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div
              className={`bg-white space-y-4 p-6 rounded-xl mb-4 shadow-md text-center transition-all duration-300 ${
                index === activeIndex
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
            >
              <img src={quateImg} alt="" />
              <h3 className="text-sm text-gray-600">{item.des}</h3>
              <hr className="my-2 border border-dashed border-gray-300" />
              <div className="flex  gap-6 p-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                  </div>
                </div>
                <div className=" text-start">
                  <h3>{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.position}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom arrows */}
      {/* <div className="flex justify-center items-center gap-4 mt-6">
        <button className="custom-prev bg-white rounded-full w-10 h-10 flex justify-center items-center shadow">
          <span className="text-xl">&#8592;</span>
        </button>
        <div className="custom-pagination flex gap-2"></div>

        <button className="custom-next bg-lime-300 rounded-full w-10 h-10 flex justify-center items-center shadow">
          <span className="text-xl">&#8594;</span>
        </button>
      </div> */}
    </div>
  );
};

export default CustomerSlider;
