import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { LuCircleHelp } from "react-icons/lu";



const OtherNav = ({ userrole, name = "My Account" }) => {
        const [dropdown, setDropDown] = useState(false)
  return (
    <div className=''>
        <nav>
            <ul className='flex gap-2 font-semibold items-center text-stone-500'>
                <li className='text-black cursor-pointer bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>Book a Ride</li>
                {userrole !== 'rider' ?<li className='cursor-pointer hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>Earn as a Rider</li> : ""}
                <li className='relative cursor-pointer flex items-center gap-2 hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'>{name} {dropdown ?<FaAngleUp /> :<FaAngleDown /> }
                    <div className='absolute'>

                    </div>
                </li>
                <li className='flex items-center gap-2 cursor-pointer hover:text-black hover:bg-stone-100 px-3 py-1 rounded-s-full rounded-e-full'> <LuCircleHelp /> Help</li>
                </ul>
            </nav>
    </div>
  )
}

export default OtherNav