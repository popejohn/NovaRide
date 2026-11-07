import { motion } from 'framer-motion';
import { FaRoute } from 'react-icons/fa6';
import { FaCircle, FaMapMarkerAlt } from 'react-icons/fa';

const Journeys = ({ items = [] }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-padding sm:p-8 bg-white/40 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] border border-white/20 shadow-2xl mt-8"
    >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
                <p className="text-caption sm:text-[10px] font-black uppercase tracking-label sm:tracking-[0.2em] text-neutral-400 mb-1">Records</p>
                <h3 className="text-2xl font-black text-neutral-900">Trip History</h3>
            </div>
            <div className="p-3 bg-neutral-900 text-white rounded-2xl">
                <FaRoute className="text-xl" />
            </div>
        </div>

        {items.length === 0 ? (
            <div className="py-6 sm:py-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRoute className="text-neutral-300 text-2xl" />
                </div>
                <p className="text-caption sm:text-[10px] font-black uppercase tracking-widest text-neutral-400">No recent journeys found</p>
            </div>
        ) : (
            <div className="space-y-4">
                {items.map((j, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card-padding sm:p-6 bg-white border border-neutral-100 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-xl hover:shadow-neutral-900/5 transition-all group"
                    >
                        <div className="flex min-w-0 max-w-full items-center gap-4">
                            <div className="flex flex-col items-center">
                                <FaCircle className="text-[8px] text-orange-500" />
                                <div className="w-px h-6 bg-neutral-200 my-1" />
                                <FaMapMarkerAlt className="text-caption sm:text-[10px] text-neutral-400" />
                            </div>
                            <div>
                                <div className="font-bold text-neutral-900 text-sm break-words sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis sm:max-w-[200px]" title={`${j.pickupLocation} → ${j.destination}`}>
                                    {j.pickupLocation} → {j.destination}
                                </div>
                                <div className="text-caption sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">
                                    {j.distance} km • {new Date(j.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-orange-500">
                            <div className="text-lg font-black tracking-tighter leading-none">₦{j.fare}</div>
                            <div className="text-caption sm:text-[10px] font-black uppercase tracking-widest mt-1">Earned</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
);

export default Journeys;




