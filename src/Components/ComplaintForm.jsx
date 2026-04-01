import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ComplaintForm = ({ showComplaintForm, setShowComplaintForm, complaintText, setComplaintText, handleSubmitComplaint }) => {
  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <button
        onClick={() => setShowComplaintForm(!showComplaintForm)}
        className="w-full flex items-center justify-between group py-2"
      >
        <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-red-500 transition-colors">Report Discrepancy</span>
        <FaExclamationTriangle className="text-neutral-800 group-hover:text-red-500 transition-colors" />
      </button>

      <AnimatePresence>
        {showComplaintForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4"
          >
            <textarea
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe the issue..."
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-sm focus:border-orange-500/50 focus:outline-none min-h-[120px] resize-none transition-all placeholder:text-neutral-700"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitComplaint}
              className="w-full mt-4 py-4 bg-red-600/90 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-2xl shadow-red-600/20"
            >
              Send Report
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintForm;