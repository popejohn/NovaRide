import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa6';

const WalletPanel = ({ balance = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Available Funds</p>
                    <h3 className="text-2xl font-black text-white">Nova Wallet</h3>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-orange-500">
                    <FaWallet className="text-2xl" />
                </div>
            </div>

            <div className="mb-10">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">
                    ₦{balance.toLocaleString()}
                </div>
                <p className="text-xs font-bold text-neutral-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Verified Balance
                </p>
            </div>

            {/* <div className="flex gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 px-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-colors"
                >
                    Withdraw
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 px-6 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                    Top up
                </motion.button>
            </div> */}
        </div>
    </motion.div>
);

export default WalletPanel;




