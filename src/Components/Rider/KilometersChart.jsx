import { motion } from 'framer-motion';
import { FaArrowTrendUp } from 'react-icons/fa6';

const KilometersChart = ({ monthly = [120, 180, 210, 150, 200, 260] }) => {
    const max = Math.max(...monthly, 1);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden group"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Performance</p>
                    <h3 className="text-2xl font-black text-neutral-900">Ride Coverage</h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600">
                    <FaArrowTrendUp className="text-xl" />
                </div>
            </div>
            <div className="flex items-end gap-3 h-48">
                {monthly.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group/bar">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(val / max) * 100}%` }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 50 }}
                            className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="text-[10px] font-black mt-4 text-neutral-400 uppercase tracking-widest leading-none">M{i + 1}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default KilometersChart;
