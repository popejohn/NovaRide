import React from "react";
import { TbTableOptions } from "react-icons/tb";
import { RiEBikeFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import Gestures from "./ScaledButt";

const HowItWorksSection = () => {
  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white w-full mt-20 md:mt-40">
      <h2 className="text-3xl md:text-5xl font-bold text-start mb-12">How it Works</h2>
      <div className="flex flex-wrap justify-between gap-4 md:gap-8">
        <Gestures
          text={'Select preferred ride out of the available rides at your current location'}
          icon={<TbTableOptions className="mt-5 text-3xl text-purple-800" />}
        />
        <Gestures
          text={'Experience an enjoyable ride to all locations, with well trained and courteous drivers.'}
          icon={<RiEBikeFill className="mt-5 text-5xl text-amber-700" />}
        />
        <Gestures
          text={'Pay for your ride using our secure payment options. You can pay from your Nova wallet, or use your debit/credit card.'}
          icon={<MdPayments className="mt-5 text-5xl text-teal-700" />}
        />
      </div>
    </section>
  );
};

export default HowItWorksSection;



