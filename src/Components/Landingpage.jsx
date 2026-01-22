import React, {useState, useEffect} from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import image1 from "../assets/night-5137487_1920.jpg"
import image2 from "../assets/maruwa_passenger.png"
import profilePic from '../assets/placeholderProfile.jpg'
import image3 from "../assets/maruwa_only.png"
import map from "../assets/map.png"
import driver from "../assets/paid driver.png"
import passanger from "../assets/alight.png"
import Gestures from "./ScaledButt";
import { FaLocationArrow } from "react-icons/fa";
import { TbLocationDown, TbTableOptions } from "react-icons/tb";
import { setPickupLocation, setDestination, setRideCost, setRidersNearby, setSelectedRider } from '../Redux/riderslice';
import { setUser } from "../Redux/verifiedUserslice";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { RiEBikeFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import Footer from "./Footer";
import Nav from "./Nav";
import { Link } from "react-router-dom";





export default function LandingPage({verified, setverified}) {

  const dispatch = useDispatch()
      const {
          pickupLocation,
          destination,
          rideCost,
          ridersNearby,
          selectedRider,
        } = useSelector((state) => state.getRide);
        const {user, role, isAuthenticated } = useSelector(state => state.verifiedUser)

const [bookLater, setBookLater] = useState(false);

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
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 15000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const current = messages[index];

  return (

    <div className="min-h-screen flex flex-col">
        <Navbar userrole={''} userverified={isAuthenticated} nav={<Nav />} profilePic={profilePic} button={<Link to={'/signup'}><Button text={'Own a Ride'} classes={'font-bold text-white rounded-e-full rounded-s-full bg-black py-3 px-7 hover:scale-105'} /></Link> } />
      {/* Hero Section */}
      <section
      className={`relative text-white bg-cover bg-center bg-no-repeat mt-16 md:mt-20`}
      style={{
        minHeight: "50vh",
        height: "600px",
        backgroundImage: `url(${current.bg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/45 mix-blend-multiply" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 py-8" style={{minHeight: "50vh", height: "600px"}}>
      <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 transition-opacity duration-1000">
        {current.text}
      </h1>
      <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-10 mt-8">
        <Link to={'/signup'}><Button text={'Get Started'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-yellow-500 border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} /></Link>
        <Link to={'/FAQ'}><Button text={'Learn More'} classes={'py-2 px-4 md:py-3 md:px-7 rounded-s-full rounded-e-full bg-black border-3 transition-all duration-500 font-bold border-white hover:bg-white hover:text-black'} /></Link>
      </div>
      </div>
    </section>

    {/*  */}

      {/* Order Ride Section*/}
      <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-8 lg:gap-26 mt-8 md:mt-16 lg:mt-40">
        <div className="w-full md:w-1/2">
          <div className="heading">
            <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Go Anywhere with Nova Ride</h2>
            <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold">Order a maruwa to any destination of your choice</p>
          </div>

          <div className="mt-8 w-full md:w-3/4">
            <div className="rounded-sm bg-stone-200 h-12 px-2 w-full flex items-center">
               <input type="text" value={pickupLocation} placeholder="Current location" className="h-full placeholder:font-semibold w-full border-0 outline-0" onChange={(e)=>dispatch(setPickupLocation(e.target.value))}/>
               <FaLocationArrow />
            </div>
           <div className="rounded-sm bg-stone-200 h-12 px-2 w-full mt-5 flex items-center">
               <input type="text" value={destination} placeholder="Destination" className="h-full placeholder:font-semibold w-full border-0 outline-0" onChange={(e)=> dispatch(setDestination(e.target.value))}/>
              <TbLocationDown />
            </div>
            {/* previous destinations removed from landing page - moved to general dashboard */}
            {bookLater &&
            <>
              <hr className="mt-5 border-2 border-gray-100"/>
              <div className="border-t-2 w-fit border-gray-200 mt-5 py-2 bg-gray-200 ps-2 md:ps-8 pe-4 md:pe-18">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-full border-0 text-stone-800 outline-0 bg-gray-200 rounded-md"/>
              </div>
            </>
            }
            <div className="flex justify-start items-end gap-3 mt-5 group">
              <Button text={'Order Ride'} classes={'bg-black font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white hover:scale-105'}/>
              <div className="flex flex-col" onClick={()=>setBookLater(!bookLater)}>
                Book for a later date
                <div className="bg-stone-300 h-1 rounded-e-full rounded-s-full">
                  <div className="w-1 h-1 rounded-e-full rounded-s-full transition-all duration-300 group-hover:w-full group-hover:bg-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img src={map} alt="" className="w-full h-auto rounded-s-2xl" />
        </div>
      </section>

      {/* How it works (Booking Ride) */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white w-full mt-20 md:mt-40">
        <h2 className="text-3xl md:text-5xl font-bold text-start mb-12">How it Works</h2>
        <div className="flex flex-wrap justify-between gap-4 md:gap-8">
          <Gestures text={'Select prefferred ride out of the available rides at your current location'} icon={<TbTableOptions className="mt-5 text-3xl text-purple-800"/>} />
          <Gestures text={'Experience an enjoyable ride to all locations, with well trained and courteous drivers.'} icon={<RiEBikeFill className="mt-5 text-5xl text-amber-700" />}/>
          <Gestures text={'Pay for your ride using our secure payment options. You can pay from your Nova wallet, or use your debit/credit card.'} icon={<MdPayments className="mt-5 text-5xl text-teal-700" />}/>
        </div>
      </section>

      {/* Become a Rider and Earn */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-8 lg:gap-26 mt-20 md:mt-40">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Help people Get To Their Destinations And Earn Big!</h2>
          <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold"> Make money with ease and at your own convenience by using your ride on your own terms while you also help others or goods get to their destinations </p>
          <Link to={'/register'}><Button text={'Get Started'} classes={'font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white bg-black mt-8 hover:scale-105'}/></Link>
        </div>
        <div className="w-full md:w-1/2">
          <img src={driver} alt="" className="w-full h-auto rounded-s-2xl" />
        </div>
      </section>

      {/* Installment */}
      <section className="py-8 md:py-16 px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row items-center w-full gap-4 md:gap-8 lg:gap-26 my-20 md:my-40">
        <div className="w-full md:w-1/2">
          <img src={passanger} alt="" className="w-full h-auto rounded-e-2xl"/>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Own Your Own Maruwa with 60k In Simple Steps</h2>
          <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold">Be a proud owner of your own Maruwa in good condition with as low as #60,000 downpayment. We offer the best price and easy repayment plans</p>
          <h3 className="bg-yellow-400 ps-4 md:ps-8 pe-4 md:pe-18 text-stone-800 py-5 font-bold rounded-tl-2xl rounded-br-2xl mt-5 text-xl md:text-2xl w-fit">We have you in mind!</h3>
          <Link to={'/register'}><Button text={'Own a Ride'} classes={'font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white bg-black mt-8 hover:scale-105'} /></Link>
        </div>

      </section>

      {/* footer */}
      <section className="bg-neutral-900 text-white text-center py-16 px-4 mt-20">
          <Footer/>
      </section>

      {/* copyright */}
      <footer className="bg-gray-600 text-white py-6 px-4 text-sm text-center">
        <div className="space-x-4">
          <div className="mb-2">&copy; {new Date().getFullYear()} NovaRide. All rights reserved.</div>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Help</a>
          <a href="/admin" className="hover:text-white">Career</a>
        </div>
      </footer>
    </div>
  );
}
