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
    showCostDist,
    distance,
    eta,
    isRevealVisible,
    onOpenMap,
    children
}) => {
    const Motion = motion;
    const isRevealActive = Boolean(isRevealVisible ?? (distance && eta && showCostDist));
    const isDisabled = Boolean(loading || isRevealActive);
    const isPickupDisabled = isDisabled;
    const isDestinationDisabled = isDisabled;

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
                        onClick={isDisabled ? undefined : onOpenMap}
                        disabled={isDisabled}
                        className={`w-full h-14 border rounded-xl flex items-center justify-between px-6 transition-all group ${
                            isDisabled
                                ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <FaMapMarkedAlt className={`text-lg transition-transform ${isDisabled ? 'text-neutral-500' : 'text-orange-400 group-hover:scale-110'}`} />
                            <span className={`font-semibold ${isDisabled ? 'text-neutral-500' : 'text-white'}`}>Set location on map</span>
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
                    disabled={isPickupDisabled}
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
                    disabled={isDestinationDisabled}
                />

                <div className='flex justify-start items-center gap-4 mt-8'>
                    <Button
                        text={loading
                            ? <div className="flex justify-center items-center w-full"><ClipLoader color="#fff" size={20} /></div>
                            : 'Find Rides'}
                        classes={`flex-1 h-14 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg ${
                            isDisabled
                                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 cursor-pointer'
                        }`}
                        disabled={isDisabled}
                        onClick={isDisabled ? undefined : handleFare}
                    />

                    {pickupLocation && destination && (
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Button
                                text={'Clear'}
                                classes={`h-14 px-6 rounded-xl transition-all font-semibold border ${
                                    isDisabled
                                        ? 'bg-white/5 text-neutral-500 border-white/5 opacity-40 cursor-not-allowed'
                                        : 'bg-white/10 text-white hover:bg-white/20 border-white/10 cursor-pointer'
                                }`}
                                disabled={isDisabled}
                                onClick={isDisabled ? undefined : cancelRide}
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




