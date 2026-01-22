import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { LuCircleHelp } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';



const Nav = ({userrole = 'passenger'}) => {
        const [dropdown, setDropDown] = useState(false)
  return (
    <div className=''>
        <nav>
            <ul className='flex gap-2 font-semibold items-center text-stone-500'>
                <li><Link to={'/bookride'} className='cursor-pointer hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>Book a Ride</Link></li>
                {userrole !== 'rider' && <li><Link to={'/rider'} className='cursor-pointer hover:text-black  hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>Earn as a Rider</Link></li>}
                <li className='relative cursor-pointer group py-4'>
                    <button className='flex items-center gap-2 hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>FAQ {dropdown ?<FaAngleUp /> :<FaAngleDown /> }</button>
                    <div className="absolute left-0 top-full w-60 bg-white shadow-md rounded-lg max-h-0 overflow-hidden 
                                    text-sm group-hover:max-h-96 transition-all duration-500 ease-in-out">
                      <ul className="p-2">
                        <li className="hover:bg-gray-100 hover:text-yellow-500  p-2"><HashLink smooth to={'/FAQ#services'}>Our services</HashLink></li>
                        <li className="hover:bg-gray-100 hover:text-yellow-500 p-2"><HashLink smooth to={'/FAQ#bookride'}> Procedure to book a ride </HashLink></li>
                        <li className="hover:bg-gray-100 hover:text-yellow-500 p-2"><HashLink smooth to={'/FAQ#bookride'}> Can I book for later ?</HashLink></li>
                        <li className="hover:bg-gray-100 hover:text-yellow-500 p-2"><HashLink smooth to={'/FAQ#installment'}> Maruwa in installment ? </HashLink></li>
                        <li className="hover:bg-gray-100 hover:text-yellow-500 p-2"><HashLink smooth to={'/FAQ#bearider'}> Make money with my ride </HashLink></li>
                      </ul>
                    </div>
                </li>
                <li><Link to={'/help'} className='flex items-center gap-2 cursor-pointer hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'> <LuCircleHelp /> Help</Link></li>
                </ul>
            </nav>
    </div>
  )
}

export default Nav