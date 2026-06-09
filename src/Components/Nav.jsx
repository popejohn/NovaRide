import React, { useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { LuCircleHelp } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, children, icon: Icon, isHash = false, userverified = false }) => {
  const location = useLocation();
  const path = location.pathname;

  // Section-based active logic
  let isActive = path === to;

  if (to === '/bookride') {
    const bookingRoutes = ['/', '/bookride', '/driver-selection', '/live-tracking', '/ride-completion'];
    isActive = bookingRoutes.includes(path) && (path !== '/' || userverified);
  }

  if (to === '/rider-profile-setup') {
    const riderRoutes = ['/rider', '/riderdashboard', '/rider-profile-setup', '/ride-request', '/rider-live-tracking', '/register'];
    isActive = riderRoutes.includes(path);
  }

  const classes = `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-[10px] md:text-xs uppercase tracking-widest ${isActive ? 'text-orange-500 bg-orange-50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
    }`;

  const content = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2"
    >
      {Icon && <Icon className="text-sm" />}
      {children}
    </motion.span>
  );

  if (isHash) {
    return <HashLink smooth to={to} className={classes}>{content}</HashLink>;
  }
  return <Link to={to} className={classes}>{content}</Link>;
};

const Nav = ({ userrole = 'passenger', userverified = false }) => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const location = useLocation();
  const isFaqPage = location.pathname.startsWith('/FAQ');

  return (
    <nav>
      <ul className='flex items-center gap-1'>
        <li>
          <NavItem to='/bookride' userverified={userverified}>Book a Ride</NavItem>
        </li>
        {userrole !== 'rider' && (
          <li>
            <NavItem to='/rider-profile-setup' userverified={userverified}>Earn as a Rider</NavItem>
          </li>
        )}
        <li
          className='relative'
          onMouseEnter={() => setIsFaqOpen(true)}
          onMouseLeave={() => setIsFaqOpen(false)}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${isFaqPage ? 'text-orange-500 bg-orange-50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'} ${isFaqOpen ? 'bg-neutral-50 text-neutral-900' : ''}`}
          >
            FAQ <FaAngleDown className={`transition-transform duration-300 ${isFaqOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isFaqOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className='absolute left-0 mt-2 w-64 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-2 z-[5002]'
              >
                <ul className="space-y-1">
                  {[
                    { to: '/FAQ#services', label: 'Our services' },
                    { to: '/FAQ#bookride', label: 'How to book' },
                    { to: '/FAQ#later', label: 'Book for later' },
                    { to: '/FAQ#installment', label: 'Installment plans' },
                    { to: '/FAQ#bearider', label: 'Drive & Earn' },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <HashLink
                        smooth
                        to={item.to}
                        className="block px-4 py-2 text-[10px] md:text-xs font-bold text-neutral-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                      >
                        {item.label}
                      </HashLink>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
        <li>
          <NavItem to='/help' icon={LuCircleHelp}>
            Help
          </NavItem>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
