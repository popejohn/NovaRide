import { motion } from 'framer-motion';
import Button from '../Button';
import { ClipLoader } from 'react-spinners';
import LocationSearch from './LocationSearch';
import { FaMapMarkedAlt } from 'react-icons/fa';

const RideBookingSidebar = ({
    user,
    loading,
    pickupLocation,
    destination,
    pickupSuggestions,
    destinationSuggestions,
    activeInput,
    destinationInputRef,
    handleFare,
    handleLocationChange,
    handleSuggestionClick,
    handleUseMyLocation,
    clearInput,
    cancelRide,
    onOpenMap,
    children
}) => {
    const Motion = motion;
    const isFindRideDisabled = loading || !pickupLocation?.trim() || !destination?.trim();

    return (
        <Motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col w-full lg:w-2/5'
        >
            <div className='inputs-class bg-black/90 backdrop-blur-xl rounded-2xl px-8 pt-8 pb-10 relative border border-white/10 shadow-2xl'>
                <div className='font-bold text-3xl text-white leading-tight'>
                    <span className='text-orange-400'>Hello {user?.firstname || 'User'}</span>, <br />
                    where are you going today?
                </div>

                {/* Map Trigger (Mobile & Tablet) */}
                <div className="lg:hidden mt-6">
                    <button
                        onClick={onOpenMap}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between px-6 hover:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <FaMapMarkedAlt className="text-orange-400 text-lg group-hover:scale-110 transition-transform" />
                            <span className="text-white font-semibold">Set location on map</span>
                        </div>
                    </button>
                </div>

                <LocationSearch
                    type="pickup"
                    value={pickupLocation}
                    placeholder="Pick-up location"
                    suggestions={activeInput === "pickup" ? pickupSuggestions : []}
                    onValueChange={(val) => handleLocationChange(val, "pickup")}
                    onSuggestionClick={(item) => handleSuggestionClick(item, "pickup")}
                    onClear={() => clearInput("pickup")}
                    onUseMyLocation={handleUseMyLocation}
                    disabled={loading}
                />

                <LocationSearch
                    type="destination"
                    value={destination}
                    placeholder="Destination"
                    suggestions={activeInput === "destination" ? destinationSuggestions : []}
                    onValueChange={(val) => handleLocationChange(val, "destination")}
                    onSuggestionClick={(item) => handleSuggestionClick(item, "destination")}
                    onClear={() => clearInput("destination")}
                    inputRef={destinationInputRef}
                    disabled={loading}
                />

                <div className='flex justify-start items-center gap-4 mt-8'>
                    <Button
                        text={loading
                            ? <div className="flex justify-center items-center w-full"><ClipLoader color="#fff" size={20} /></div>
                            : 'Find Rides'}
                        classes={`flex-1 h-14 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg ${isFindRideDisabled ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 cursor-pointer'}`}
                        disabled={isFindRideDisabled}
                        onClick={handleFare}
                    />

                    {pickupLocation && destination && (
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Button
                                text={'Clear'}
                                classes={`h-14 px-6 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold border border-white/10`}
                                onClick={cancelRide}
                            />
                        </Motion.div>
                    )}
                </div>
            </div>

            {children}
        </Motion.aside>
    );
};

export default RideBookingSidebar;




