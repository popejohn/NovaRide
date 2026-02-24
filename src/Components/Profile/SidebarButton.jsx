import { motion } from 'framer-motion';

const SidebarButton = ({ active, onClick, children, icon: Icon }) => (
    <motion.button
        animate={{
            backgroundColor: active ? '#171717' : 'transparent',
            color: active ? '#ffffff' : '#737373'
        }}
        whileHover={{
            x: 5,
            backgroundColor: active ? '#171717' : 'rgba(249, 115, 22, 0.08)',
            color: active ? '#ffffff' : '#f97316'
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl mb-2 transition-all duration-300 font-bold text-sm tracking-tight relative overflow-hidden ${active ? 'shadow-xl translate-x-1' : ''} group`}
    >
        {active && <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />}
        {Icon && <Icon className={`text-lg transition-colors ${active ? 'text-orange-500' : 'text-neutral-400 group-hover:text-orange-500'}`} />}
        {children}
    </motion.button>
);

export default SidebarButton;
