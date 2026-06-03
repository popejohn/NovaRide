import { motion, AnimatePresence } from 'framer-motion';
import { FaLocationDot, FaLocationArrow } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useState } from 'react';

const LocationSearch = ({
    type,
    value,
    placeholder,
    suggestions,
    onValueChange,
    onSuggestionClick,
    onClear,
    onUseMyLocation,
    inputRef
}) => {
    const Motion = motion;
    const Icon = type === 'pickup' ? FaLocationDot : FaLocationArrow;
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleUseMyLocation = async () => {
        setIsLoadingLocation(true);
        try {
            await onUseMyLocation();
        } finally {
            setIsLoadingLocation(false);
        }
    };

    return (
        <div className="relative w-full">
            <div className='w-full flex justify-start items-center bg-white/10 backdrop-blur-sm rounded-xl mt-4 ps-4 focus-within:ring-2 focus-within:ring-orange-400 transition-all border border-white/5'>
                <Icon className='text-orange-400' />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    ref={inputRef}
                    className="p-3 w-full border-0 outline-0 bg-transparent text-white placeholder:text-neutral-400"
                />
                <div className="flex items-center gap-2">
                    {type === 'pickup' && onUseMyLocation && (
                        <motion.button
                            onClick={handleUseMyLocation}
                            disabled={isLoadingLocation}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Use my current location"
                            className="text-neutral-400 hover:text-orange-400 disabled:text-orange-300 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
                        >
                            <FaLocationArrow className={`text-sm ${isLoadingLocation ? 'animate-pulse' : ''}`} />
                            {isLoadingLocation && <span className="text-[10px] font-bold">...</span>}
                        </motion.button>
                    )}
                    {value && (
                        <IoClose
                            className='text-neutral-400 cursor-pointer mx-2 hover:text-white transition-colors'
                            onClick={onClear}
                        />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {suggestions.length > 0 && (
                    <Motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bg-neutral-900/95 backdrop-blur-lg border border-white/10 shadow-2xl mt-2 rounded-xl w-full max-h-48 overflow-y-auto z-50 overflow-hidden"
                    >
                        {suggestions.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-3 text-white hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                                onClick={() => onSuggestionClick(item)}
                            >
                                {item.display}
                            </div>
                        ))}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationSearch;
