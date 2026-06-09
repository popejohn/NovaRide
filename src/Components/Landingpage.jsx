import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import image1 from "../assets/night-5137487_1920.jpg"
import image2 from "../assets/maruwa_passenger.png"
import profilePic from '../assets/placeholderProfile.jpg'
import image3 from "../assets/maruwa_only.png"
import { useSelector } from "react-redux";
import Button from "./Button";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import OrderRideSection from "./OrderRideSection";
import HowItWorksSection from "./HowItWorksSection";
import BecomeRiderSection from "./BecomeRiderSection";
import InstallmentSection from "./InstallmentSection";
import FooterSection from "./FooterSection";
import Nav from "./Nav";

export default function LandingPage() {
  const { user, role, isAuthenticated } = useSelector(state => state.verifiedUser);

  const [bookLater, setBookLater] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const messages = [
    {
      text: "ORDER A RIDE WITH EASE",
      bg: image1,
    },
    {
      text: "MAKE MONEY AS A RIDER",
      bg: image2,
    },
    {
      text: "OWN A RIDE NOW AND PAY LATER",
      bg: image3,
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        userrole={role}
        userverified={isAuthenticated}
        nav={<Nav userrole={role} userverified={isAuthenticated} />}
        profilePic={user?.profilePic || profilePic}
        button={<Link to={'/signup'}><Button text={'Own a Ride'} classes={'font-bold text-white rounded-e-full rounded-s-full bg-black py-3 px-7 hover:scale-105'} /></Link>}
      />

      <HeroSection messages={messages} index={index} />

      <OrderRideSection
        bookLater={bookLater}
        setBookLater={setBookLater}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      <HowItWorksSection />

      <BecomeRiderSection />

      <InstallmentSection />

      <FooterSection />
    </div>
  );
}
