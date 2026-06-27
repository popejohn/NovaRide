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
    inputRef,
    theme = 'dark'
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

    const isDark = theme === 'dark';

    return (
        <div className="relative w-full">
            <div className={`w-full flex justify-start items-center rounded-xl mt-4 ps-4 focus-within:ring-2 focus-within:ring-orange-400 transition-all border ${
                isDark 
                    ? 'bg-white/10 backdrop-blur-sm border-white/5' 
                    : 'bg-neutral-100 border-neutral-200'
            }`}>
                <Icon className='text-orange-400' />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    ref={inputRef}
                    className={`p-3 w-full border-0 outline-0 bg-transparent ${isDark ? 'text-white placeholder:text-neutral-400' : 'text-neutral-900 placeholder:text-neutral-500'}`}
                />
                <div className="flex items-center gap-2">
                    {type === 'pickup' && onUseMyLocation && (
                        <motion.button
                            onClick={handleUseMyLocation}
                            disabled={isLoadingLocation}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Use my current location"
                            className={`transition-colors flex items-center gap-1 px-2 py-1 rounded ${
                                isDark 
                                    ? 'text-neutral-400 hover:text-orange-400 disabled:text-orange-300 hover:bg-white/5' 
                                    : 'text-neutral-500 hover:text-orange-500 disabled:text-orange-300 hover:bg-neutral-200/50'
                            }`}
                        >
                            <FaLocationArrow className={`text-sm ${isLoadingLocation ? 'animate-pulse' : ''}`} />
                            {isLoadingLocation && <span className="text-[10px] font-bold">...</span>}
                        </motion.button>
                    )}
                    {value && (
                        <IoClose
                            className={`cursor-pointer mx-2 transition-colors ${
                                isDark 
                                    ? 'text-neutral-400 hover:text-white' 
                                    : 'text-neutral-500 hover:text-neutral-900'
                            }`}
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
                        className={`absolute border shadow-2xl mt-2 rounded-xl w-full max-h-48 overflow-y-auto z-50 overflow-hidden ${
                            isDark 
                                ? 'bg-neutral-900/95 backdrop-blur-lg border-white/10 text-white' 
                                : 'bg-white border-neutral-200 text-neutral-900'
                        }`}
                    >
                        {suggestions.map((item, idx) => (
                            <div
                                key={idx}
                                className={`p-3 cursor-pointer border-b last:border-0 transition-colors ${
                                    isDark 
                                        ? 'text-white hover:bg-white/10 border-white/5' 
                                        : 'text-neutral-900 hover:bg-neutral-100 border-neutral-100'
                                }`}
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
