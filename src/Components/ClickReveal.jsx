import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { GiPathDistance } from "react-icons/gi";
import { IoMdTimer } from "react-icons/io";
import Button from './Button';
import { useRidePayment } from '../hooks/useRidePayment';

const ClickToReveal = ({ distance, duration, cancelRide }) => {
  const { pickupLocation, destination } = useSelector((state) => state.getRide);
  const { pickupCoordinate, destinationCoordinate } = useSelector((state) => state.location);
  const { checkBalanceAndPay, isProcessing } = useRidePayment(distance, duration, pickupLocation, destination, pickupCoordinate, destinationCoordinate);

  return (
    <div className="mt-5 w-full">

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-6 bg-black/85 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl w-full text-white"
        >
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-500/20 rounded-lg'>
                  <GiPathDistance className='text-orange-400 text-xl' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs text-neutral-400 uppercase tracking-wider font-bold'>Distance</span>
                  <span className='text-lg font-semibold'>{distance} KM</span>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-500/20 rounded-lg'>
                  <IoMdTimer className='text-blue-400 text-xl' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-xs text-neutral-400 uppercase tracking-wider font-bold'>Duration</span>
                  <span className='text-lg font-semibold'>{duration} minutes</span>
                </div>
              </div>
            </div>

            <div className='mt-2 flex items-center justify-between px-2'>
              <span className='text-neutral-400 font-medium'>Estimated Fare</span>
              <span className='text-2xl font-bold text-orange-400'>#{distance && distance * 150}</span>
            </div>

            <div className='flex gap-4 mt-2'>
              <Button
                text={isProcessing ? 'Processing...' : 'Pick rider'}
                classes={`flex-1 h-12 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg ${isProcessing ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                onClick={checkBalanceAndPay}
                disabled={isProcessing}
              />
              <Button
                text={'Cancel'}
                classes={'px-6 h-12 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10'}
                onClick={cancelRide}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ClickToReveal;




