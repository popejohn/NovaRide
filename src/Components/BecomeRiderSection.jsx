import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import driver from "../assets/paid driver.png";

const BecomeRiderSection = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-8 lg:gap-26 mt-20 md:mt-40">
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Help people Get To Their Destinations And Earn Big!</h2>
        <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold">
          Make money with ease and at your own convenience by using your ride on your own terms while you also help others or goods get to their destinations
        </p>
        <Link to={'/register'}>
          <Button text={'Get Started'} classes={'font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white bg-black mt-8 hover:scale-105'} />
        </Link>
      </div>
      <div className="w-full md:w-1/2">
        <img src={driver} alt="Driver earning money" className="w-full h-auto rounded-s-2xl" />
      </div>
    </section>
  );
};

export default BecomeRiderSection;