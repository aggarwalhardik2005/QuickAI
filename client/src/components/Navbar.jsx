import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/react';

const Navbar = () => {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    return (
    <div className='fixed z-5 w-full flex backdrop-blur-2xl justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer'>
       <img src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer'
        onClick={()=>{navigate('/')}}
        />

        {
            isSignedIn ? <UserButton /> 
            : 
            <button 
            onClick={openSignIn}
            className='group flex items-center gap-2 rounded-full text-sm 
            cursor-pointer bg-primary text-white px-10 py-2.5 transition 
            duration-300 hover:bg-indigo-700'>
                Get Started 
            <ArrowRight className='w-4 h-4 transition-transform duration-300 
            ease-in-out group-hover:translate-x-1'/></button>
        }

    </div>
  )
}

export default Navbar
