import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Find roommates who match your vibe",
    description:
      "Find verified roommate listings near you— built for students, workers & everyone in between",
    buttonText: "More About Us",
    image: "/image2.jpg",
  },
  {
    title: "Make New Friends Instantly",
    description: "Explore people nearby looking for shared living space.",
    buttonText: "Explore Now",
    image: "/image3.jpg",
  },
  {
    title: "Safe & Verified Listings",
    description:
      "We make sure every listing is 100% safe and verified for your peace of mind.",
    buttonText: "See Listings",
    image: "/image4.jpg",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto slide every 5 sec
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 2, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full flex items-center justify-between px-10"
        >
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-black max-w-xl"
          >
            <h1 className="text-4xl font-bold mb-4">{slides[current].title}</h1>
            <p className="mb-6">{slides[current].description}</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
              {slides[current].buttonText}
            </button>
          </motion.div>

          {/* Right Image Section */}
          <motion.img
            src={slides[current].image}
            alt={slides[current].title}
            initial={{ opacity: 0, scale: 0.8  }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md rounded-lg shadow-lg"
          />
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-6 rounded-full transition ${
              index === current ? "bg-blue-400" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
