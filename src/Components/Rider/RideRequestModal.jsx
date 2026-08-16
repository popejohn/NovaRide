import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaUser, FaCar, FaRoute, FaTimes } from 'react-icons/fa';
import Button from '../Button';

const RideRequestModal = ({ ride, onAccept, onDecline, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!ride) return null;

    const handleAction = async (actionFn) => {
        setIsProcessing(true);
        try {
            await actionFn(ride._id);
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-lg bg-[#121212] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-br from-orange-500 to-orange-600 p-8">
                        <button
                            onClick={onClose}
                            aria-label="Close ride request"
                            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Ride Request</h2>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Incoming specific request</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Passenger Info */}
                        <div className="flex items-center gap-4">
                            <img
                                src={ride.user?.profilePic || '/placeholderProfile.jpg'}
                                alt=""
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/20"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-white">{ride.user?.firstname} {ride.user?.lastname}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-orange-500 text-xs font-black uppercase tracking-widest">★ 4.8 Rating</span>
                                </div>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">Fare</p>
                                <p className="text-2xl font-black text-white tracking-tighter">₦{ride.fare.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Route Info */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-6 relative">
                            {/* Visual Line */}
                            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-orange-500 to-blue-500 rounded-full opacity-30" />

                            <div className="flex items-start gap-4 relative">
                                <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 border-4 border-[#121212] z-10" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Pickup</p>
                                    <p className="text-sm font-bold text-white line-clamp-2 leading-tight">{ride.pickupLocation}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 relative">
                                <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 border-4 border-[#121212] z-10" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Destination</p>
                                    <p className="text-sm font-bold text-white line-clamp-2 leading-tight">{ride.destination}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                                    <FaRoute />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Distance</p>
                                    <p className="text-sm font-bold text-white">{ride.distance} km</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <FaClock />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Duration</p>
                                    <p className="text-sm font-bold text-white">{ride.eta} mins</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                text={isProcessing ? "Processing..." : "Accept Ride"}
                                onClick={() => handleAction(onAccept)}
                                disabled={isProcessing}
                                classes="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-orange-500/20"
                            />
                            <Button
                                text="Decline"
                                onClick={() => handleAction(onDecline)}
                                disabled={isProcessing}
                                classes="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 transition-all"
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RideRequestModal;




