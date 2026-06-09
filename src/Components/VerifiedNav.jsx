import React from 'react';
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

  if (to === '/rider-profile-setup') {
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
  const location = useLocation();
  const path = location.pathname;
  const roles = Array.isArray(userrole) ? userrole : [userrole].filter(Boolean);

  return (
    <nav>
      <ul className='flex items-center gap-1'>
        <li>
          <NavItem to='/bookride'>Book a Ride</NavItem>
        </li>
        {userverified && !roles.includes('rider') && (
          <li>
            <NavItem to='/rider-profile-setup'>Earn as a Rider</NavItem>
          </li>
        )}
        {userverified && !roles.includes('installment') && (
          <li>
            <NavItem to='/installment-profile-setup'>Own a maruwa</NavItem>
          </li>
        )}
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