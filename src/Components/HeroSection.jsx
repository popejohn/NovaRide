import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "./Button";

const HeroSection = ({ messages, index }) => {
  const current = messages[index];

  return (
    <section
      className={`relative text-white bg-cover bg-center bg-no-repeat mt-16 md:mt-20`}
      style={{
        minHeight: "50vh",
        height: "600px",
        backgroundImage: `url(${current.bg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/45 mix-blend-multiply" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-8" style={{ minHeight: "50vh", height: "600px" }}>
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4"
        >
          {current.text}
        </motion.h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-10 mt-8">
          <Link to={'/signup'}>
            <Button text={'Get Started'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-yellow-500 border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} />
          </Link>
          <Link to={'/FAQ'}>
            <Button text={'Learn More'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-black border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;