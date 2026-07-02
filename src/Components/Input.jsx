import { motion } from 'framer-motion';

export default function Input({ label, error, variant = "dark", icon: Icon, field, form, className: customClassName, ...props }) {
  const isDark = variant === "dark";

  // Extract special props and merge Formik field props
  const { show, ...restProps } = props;
  const inputProps = field ? { ...field, ...restProps } : restProps;

  return (
    <div className={`mb-6 w-full group/input ${customClassName || ''}`}>
      {label && (
        <label className={`block mb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${error ? 'text-red-500' : isDark ? 'text-neutral-500 group-focus-within/input:text-orange-500' : 'text-neutral-400 group-focus-within/input:text-orange-600'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-6 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 pointer-events-none ${error ? 'text-red-500' : isDark ? 'text-neutral-600 group-focus-within/input:text-orange-500' : 'text-neutral-400 group-focus-within/input:text-orange-500'}`}>
            <Icon className="text-xl" />
          </div>
        )}
        <input
          {...inputProps}
          className={`w-full ${Icon ? 'pl-16' : 'px-8'} pr-8 py-5 rounded-[1.25rem] border-2 transition-all duration-300 outline-none font-bold text-sm
            ${isDark
              ? 'bg-neutral-800/40 border-neutral-800 text-white placeholder:text-neutral-700 focus:bg-neutral-800 focus:border-orange-500/50'
              : 'bg-white/40 backdrop-blur-xl border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-orange-500/30'}
            ${error ? 'border-red-500/50 bg-red-500/5 text-red-500' : 'hover:border-neutral-300'}
            shadow-sm group-focus-within/input:shadow-2xl group-focus-within/input:shadow-orange-500/5`}
        />
        <div className={`absolute inset-0 rounded-[1.25rem] pointer-events-none transition-all duration-300 opacity-0 group-focus-within/input:opacity-100 ring-[6px] ring-orange-500/5`} />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-[10px] font-bold text-red-500 italic flex items-center gap-2 px-1 uppercase tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {error}
        </motion.p>
      )}
    </div>
  );
}



