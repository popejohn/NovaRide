import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiPathDistance } from "react-icons/gi";
import { IoMdTimer } from "react-icons/io";
import Button from './Button';

const ClickToReveal = ({distance, duration, cancelRide}) => {
  const navigate = useNavigate();

  const handlePayForRide = () => {
    navigate('/driver-selection');
  };

  return (
    <div className="mt-5 w-full">

      <AnimatePresence>
        (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-4 bg-gray-100 p-4 rounded shadow-lg shadow-neutral-700 w-full font-mono"
          >
            {distance && <div className='flex justify-start items-center text-stone-700 gap-3'>
                <GiPathDistance className='text-xl' />
                <span>{distance} meters</span>
            </div>}
            {duration && <div className='flex justify-start items-center text-stone-700 gap-3 mt-2'>
                <IoMdTimer className='text-xl'/>
                <span>{duration} minutes</span>
            </div>}
            <div className='text-neutral-800 mt-2'><span>Fare:</span> #{distance && distance * 150}</div>
            <div>
              <Button text={'Pick rider'}  classes={'rounded-sm bg-black py-2 px-3 text-white mt-4 hover:bg-stone-900'} onClick={handlePickRider}/>
              <Button text={'Cancel'}  classes={'rounded-sm bg-orange-300 text-black ms-5 shadow-md py-2 px-3 mt-4 hover:bg-orange-200'} onClick={cancelRide}/>
            </div>
          </motion.div>
        )
      </AnimatePresence>
    </div>
  );
};

export default ClickToReveal;
