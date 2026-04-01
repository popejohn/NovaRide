import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import passanger from "../assets/alight.png";

const InstallmentSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row items-center w-full gap-4 md:gap-8 lg:gap-26 my-20 md:my-40">
      <div className="w-full md:w-1/2">
        <img src={passanger} alt="Passenger with maruwa" className="w-full h-auto rounded-e-2xl" />
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Own Your Own Maruwa with 60k In Simple Steps</h2>
        <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold">
          Be a proud owner of your own Maruwa in good condition with as low as #60,000 downpayment. We offer the best price and easy repayment plans
        </p>
        <h3 className="bg-yellow-400 ps-4 md:ps-8 pe-4 md:pe-18 text-stone-800 py-5 font-bold rounded-tl-2xl rounded-br-2xl mt-5 text-xl md:text-2xl w-fit">
          We have you in mind!
        </h3>
        <Link to={'/register'}>
          <Button text={'Own a Ride'} classes={'font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white bg-black mt-8 hover:scale-105'} />
        </Link>
      </div>
    </section>
  );
};

export default InstallmentSection;