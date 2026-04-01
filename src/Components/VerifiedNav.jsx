import React, { useState } from 'react';
import { FaAngleDown } from "react-icons/fa6";
import { LuCircleHelp } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, children, icon: Icon, isHash = false, userverified = true }) => {
  const location = useLocation();
  const path = location.pathname;

  // Section-based active logic
  let isActive = path === to;

  if (to === '/bookride') {
    const bookingRoutes = ['/', '/bookride', '/driver-selection', '/live-tracking', '/ride-completion'];
    isActive = bookingRoutes.includes(path) && (path !== '/' || userverified);
  }

  if (to === '/rider') {
    const riderRoutes = ['/rider', '/riderdashboard', '/rider-profile-setup', '/ride-request', '/rider-live-tracking', '/register'];
    isActive = riderRoutes.includes(path);
  }

  const classes = `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-widest ${isActive ? 'text-orange-500 bg-orange-50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
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

const OtherNav = ({ userrole, name = "My Account", userverified = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const isAccountSection = ['/profile', '/wallet'].includes(path);
  const roles = Array.isArray(userrole) ? userrole : [userrole].filter(Boolean);

  return (
    <nav>
      <ul className='flex items-center gap-1'>
        <li>
          <NavItem to='/bookride'>Book a Ride</NavItem>
        </li>
        {userverified && !roles.includes('rider') && (
          <li>
            <NavItem to='/rider'>Earn as a Rider</NavItem>
          </li>
        )}
        {userverified && !roles.includes('installment') && (
          <li>
            <NavItem to='/installment-profile-setup'>Own a maruwa</NavItem>
          </li>
        )}
        <li
          className='relative'
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${isAccountSection ? 'text-orange-500 bg-orange-50' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'} ${isDropdownOpen ? 'bg-neutral-50 text-neutral-900' : ''}`}
          >
            {name} <FaAngleDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className='absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-2 z-[5002]'
              >
                <div className="p-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 mb-1 px-4">
                  Quick Access
                </div>
                <Link to="/profile" className="block px-4 py-2 text-xs font-bold text-neutral-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">Profile</Link>
                <Link to="/wallet" className="block px-4 py-2 text-xs font-bold text-neutral-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">Wallet</Link>
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

export default OtherNav;