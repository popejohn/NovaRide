import { motion } from 'framer-motion';
import { FaUsers, FaLocationDot } from 'react-icons/fa6';
import { FaCircle, FaMapMarkerAlt } from 'react-icons/fa';

const AvailablePassengers = ({ list = [], onViewRequest }) => {
    const handleViewRequest = (ride) => {
        onViewRequest(ride);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Live Feed</p>
                    <h3 className="text-2xl font-black text-neutral-900">Incoming Requests</h3>
                </div>
                <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl animate-pulse">
                    <FaUsers className="text-xl" />
                </div>
            </div>

            {list.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCircle className="text-neutral-200 text-sm animate-ping" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Scanning for passengers...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {list.map((r) => (
                        <motion.div
                            key={r._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-white border border-neutral-100 rounded-3xl flex items-center justify-between group hover:border-orange-500/30 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                    <img src={r.user?.profilePic || '/placeholderProfile.jpg'} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900">{r.user?.firstname} {r.user?.lastname}</div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 mt-1">
                                        <FaLocationDot className="text-[10px] text-orange-500" /> {r.pickupLocation}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2 mt-0.5">
                                        <FaMapMarkerAlt className="text-[10px] text-blue-500" /> {r.destination}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="text-lg font-black text-orange-500 tracking-tighter">₦{r.fare.toLocaleString()}</div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewRequest(r)}
                                    className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-500/20"
                                >
                                    View Request
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default AvailablePassengers;




