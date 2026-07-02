import React from "react";
import { useNavigate } from "react-router-dom";
import LocationSearch from "./Booking/LocationSearch";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import map from "../assets/map.png";
import { useRideBooking } from "../hooks/useRideBooking";

const OrderRideSection = ({ bookLater, setBookLater, startDate, setStartDate }) => {
  const navigate = useNavigate();
  const {
    pickupLocation,
    destination,
    pickupSuggestions,
    destinationSuggestions,
    activeInput,
    handleLocationChange,
    handleSuggestionClick,
    handleUseMyLocation,
    clearInput,
    isAuthenticated
  } = useRideBooking();

  const handleOrderRide = () => {
    if (isAuthenticated) {
      navigate('/bookride');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-36 bg-white flex flex-col md:flex-row justify-center items-center w-full gap-4 md:gap-8 lg:gap-26 mt-8 md:mt-16 lg:mt-40">
      <div className="w-full md:w-1/2">
        <div className="heading">
          <h2 className="text-3xl md:text-5xl leading-14 font-bold text-start mb-12">Go Anywhere with Nova Ride</h2>
          <p className="-mt-10 text-sm md:text-md text-stone-500 font-semibold">Order a maruwa to any destination of your choice</p>
        </div>

        <div className="mt-8 w-full md:w-3/4 space-y-4">
          <LocationSearch
            type="pickup"
            theme="light"
            value={pickupLocation}
            placeholder="Pick-up location"
            suggestions={activeInput === "pickup" ? pickupSuggestions : []}
            onValueChange={(val) => handleLocationChange(val, "pickup")}
            onSuggestionClick={(item) => handleSuggestionClick(item, "pickup")}
            onClear={() => clearInput("pickup")}
            onUseMyLocation={handleUseMyLocation}
          />

          <LocationSearch
            type="destination"
            theme="light"
            value={destination}
            placeholder="Destination"
            suggestions={activeInput === "destination" ? destinationSuggestions : []}
            onValueChange={(val) => handleLocationChange(val, "destination")}
            onSuggestionClick={(item) => handleSuggestionClick(item, "destination")}
            onClear={() => clearInput("destination")}
          />

          {bookLater && (
            <>
              <hr className="mt-5 border-2 border-gray-100" />
              <div className="border-t-2 w-fit border-gray-200 mt-5 py-2 bg-gray-200 ps-2 md:ps-8 pe-4 md:pe-18">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full border-0 text-stone-800 outline-0 bg-gray-200 rounded-md"
                />
              </div>
            </>
          )}
          <div className="flex justify-start items-end gap-3 mt-5 group">
            <Button 
              text={'Order Ride'} 
              classes={'bg-black font-bold py-2 px-4 md:py-3 md:px-5 rounded-md text-white hover:scale-105 active:scale-95 transition-all'} 
              onClick={handleOrderRide}
            />
            <div className="flex flex-col cursor-pointer" onClick={() => setBookLater(!bookLater)}>
              Book for a later date
              <div className="bg-stone-300 h-1 rounded-e-full rounded-s-full">
                <div className="w-1 h-1 rounded-e-full rounded-s-full transition-all duration-300 group-hover:w-full group-hover:bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <img src={map} alt="Map showing ride locations" className="w-full h-auto rounded-s-2xl" />
      </div>
    </section>
  );
};

export default OrderRideSection;



