import { motion } from 'framer-motion';
import { FaWallet, FaArrowTrendUp } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { MdOutlineHistory } from 'react-icons/md';

const RecentTransactions = ({ items = [] }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl mt-8"
    >
        <div className="flex justify-between items-center mb-8">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Activity</p>
                <h3 className="text-2xl font-black text-neutral-900">Wallet History</h3>
            </div>
            <div className="p-3 bg-neutral-900 text-white rounded-2xl">
                <MdOutlineHistory className="text-xl" />
            </div>
        </div>

        {items.length === 0 ? (
            <div className="py-12 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaWallet className="text-neutral-300 text-2xl" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No recent transactions</p>
            </div>
        ) : (
            <div className="space-y-4">
                {items.map((t, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-neutral-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${t.type === 'credit' || t.type === 'funding' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {t.type === 'credit' || t.type === 'funding' ? <FaArrowTrendUp /> : <FaPlus className="rotate-45" />}
                            </div>
                            <div>
                                <div className="font-bold text-neutral-900 text-sm">{t.description}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">
                                    {new Date(t.createdAt).toLocaleDateString()} • {t.status}
                                </div>
                            </div>
                        </div>
                        <div className={`font-black tracking-tighter text-lg ${t.type === 'credit' || t.type === 'funding' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'credit' || t.type === 'funding' ? '+' : '-'}₦{t.amount.toLocaleString()}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
);

export default RecentTransactions;
