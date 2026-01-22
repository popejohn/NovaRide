import React, { useState } from 'react'
import novaLogo from '../assets/nova.png'
import '../App.css'
import Nav from './Nav'
import Button from './Button'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'


// Navbar component accepting props for user role, navigation links, verification status, profile picture, and button
// Features like a profile picture and conditional rendering based on user verification status

const Navbar = ({userrole, nav, userverified, profilePic = '', button }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const buttonStyle = 'rounded-e-full rounded-s-full text-white font-bold py-2 px-7 text-lg hover:bg-white hover:text-black hover: border-2 hover:border-black';

  return (
    <div className='z-2000'>
        <div className='logo flex fixed z-50 top-0 bg-white shadow-sm shadow-gray-300 items-center justify-between h-20 py-3 px-4 md:px-20 w-full'>
            {/* logo and company name */}
            <Link to={'/'} className='flex items-center gap-2'>
                <img src= {novaLogo} alt="Company Logo" className='h-12' />
                <div className='hidden md:block Quicksand-companyname'>Nova Ride</div>
            </Link>
            {/* Nav links */}
            <div className='hidden lg:block'>
                {nav}
            </div>
            {/* Button */}
            <div className='flex justify-center items-center gap-5'>
              {/* verified user has profile picture and no sign in button */}
                {!userverified && <Link to={'/login'}><button className='font-semibold text-neutral-500 hover:text-black'>login</button></Link>}
                {userrole !== 'installment' ?button :''}
                {userverified && <div className='hidden lg:block'>
                    <img src= {profilePic} alt="" className='rounded-full shadow-md border border-stone-100 h-12 w-12 p-2 bg-stone-100'/>
                  </div>}
                <div className='lg:hidden'>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-2xl text-gray-700'>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
            
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className='lg:hidden fixed top-20 left-0 w-full bg-white shadow-md border-t'>
                <div className='p-4'>
                    {nav}
                </div>
                {userverified && (
                    <div className='p-4 border-t'>
                        <img src={profilePic} alt="" className='rounded-full shadow-md border border-stone-100 h-12 w-12 p-2 bg-stone-100'/>
                    </div>
                )}
            </div>
        )}
    </div>
  )
}

export default Navbar