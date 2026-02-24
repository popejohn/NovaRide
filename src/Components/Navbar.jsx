import React, { useState } from 'react'
import novaLogo from '../assets/nova.png'
import '../App.css'
import Nav from './Nav'
import Button from './Button'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes, FaUser, FaWallet, FaCarSide, FaQuestionCircle, FaChevronDown } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'


const Navbar = ({ userrole, nav, userverified, profilePic = '', button }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuItems = [
        { icon: <FaUser />, label: 'My profile', path: '/profile' },
        { icon: <FaWallet />, label: 'Wallet', path: '/wallet' },
        { icon: <FaCarSide />, label: 'Earn as a rider', path: '/earn' },
        { icon: <FaQuestionCircle />, label: 'Support', path: '/support' },
    ];

    return (
        <div className='z-[5000] relative'>
            <header className='fixed top-0 left-0 right-0 z-[5000]'>
                <nav className='flex items-center justify-between h-16 md:h-20 px-6 md:px-12 bg-white border-b border-neutral-200 shadow-sm transition-all duration-300'>
                    {/* Logo Section */}
                    <Link to={'/'} className='flex items-center gap-3 group'>
                        <div className='p-1 bg-white rounded-xl transition-transform group-hover:scale-105'>
                            <img src={novaLogo} alt="Nova Logo" className='h-10 md:h-12 w-auto' />
                        </div>
                        <div className='hidden md:block font-black text-2xl tracking-tighter text-neutral-900'>
                            NOVA <span className='text-orange-500'>RIDE</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:flex items-center gap-8'>
                        <div className='text-sm font-bold tracking-tight'>
                            {nav}
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className='flex items-center gap-4'>
                        {!userverified ? (
                            <Link to={'/login'}>
                                <button className='hidden md:block font-bold text-sm uppercase tracking-widest text-neutral-500 hover:text-orange-500 transition-colors px-4'>
                                    Login
                                </button>
                            </Link>
                        ) : null}

                        <div className='flex items-center gap-3'>
                            {userrole !== 'installment' && button}

                            {userverified && (
                                <div
                                    className='hidden lg:block relative'
                                    onMouseEnter={() => setIsDropdownOpen(true)}
                                    onMouseLeave={() => setIsDropdownOpen(false)}
                                >
                                    <button className='flex items-center gap-2 p-1 pl-3 bg-neutral-100 hover:bg-neutral-200 rounded-full border border-neutral-200 transition-all'>
                                        <FaChevronDown className={`text-[10px] text-neutral-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        <img
                                            src={profilePic || '/placeholderProfile.jpg'}
                                            alt="Profile"
                                            className='h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow-sm'
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                                className='absolute right-0 mt-3 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-[5001]'
                                            >
                                                <div className='p-4 border-b border-neutral-100 bg-neutral-50/50'>
                                                    <p className='text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1'>Account</p>
                                                    <p className='font-bold text-neutral-800 text-sm truncate'>Nova User</p>
                                                </div>
                                                <div className='p-2'>
                                                    {menuItems.map((item, idx) => (
                                                        <Link
                                                            key={idx}
                                                            to={item.path}
                                                            className='flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-600 hover:bg-orange-500 hover:text-white transition-all group'
                                                        >
                                                            <span className='text-sm group-hover:scale-110 transition-transform'>{item.icon}</span>
                                                            <span className='text-sm font-bold'>{item.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className='p-4 border-t border-neutral-100'>
                                                    <button className='w-full py-2 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-colors'>
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className='lg:hidden p-3 bg-neutral-100/50 hover:bg-neutral-200/50 rounded-2xl text-neutral-700 transition-colors'
                            >
                                {isMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className='lg:hidden fixed inset-x-0 top-16 md:top-20 z-[4999] bg-white border-b border-neutral-200 shadow-xl p-8 max-h-[calc(100vh-80px)] overflow-y-auto'
                    >
                        <div className='space-y-8'>
                            <div>
                                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6'>Navigation</p>
                                <div className='flex flex-col gap-4 text-lg font-bold'>
                                    {nav}
                                </div>
                            </div>

                            {userverified && (
                                <div>
                                    <p className='text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6'>Your Account</p>
                                    <div className='grid grid-cols-2 gap-3'>
                                        {menuItems.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                to={item.path}
                                                className='flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-3xl gap-2 hover:bg-orange-50 transition-colors'
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <span className='text-orange-500 text-xl'>{item.icon}</span>
                                                <span className='text-[10px] font-black uppercase tracking-wider text-neutral-600'>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!userverified && (
                                <Link to={'/login'} onClick={() => setIsMenuOpen(false)}>
                                    <button className='w-full py-5 bg-orange-500 text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20'>
                                        Sign In to Nova
                                    </button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMenuOpen(false)}
                        className='lg:hidden fixed inset-0 bg-black/40 z-[4998]'
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar
