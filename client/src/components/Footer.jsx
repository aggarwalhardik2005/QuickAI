import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
const Footer = () => {
    const navigate = useNavigate();
    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }
                `}
            </style>
            <div className='bg-gradient-to-b from-white via-rose-50/40 to-indigo-50/50 pt-20 px-4 mt-12 mb-5'>
                <footer className="bg-white/60 backdrop-blur-sm w-full max-w-[1350px] mx-auto text-slate-800 pt-8 lg:pt-12 px-4 sm:px-8 md:px-16 lg:px-28 rounded-tl-3xl rounded-tr-3xl overflow-hidden border border-gray-100">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">
                        
                        <div className="lg:col-span-3 space-y-6">
                                <img src={assets.logo} alt="logo" onClick={()=>navigate('/')} className='w-44 sm:w-48 cursor-pointer' />
                            <p className="text-sm/6 text-gray-500 max-w-96">Experience the power of AI with QuickAi.<br/>
                                Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.</p>
                            <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                                {/* X (Twitter) */}
                                <a href="#" className="text-slate-600 hover:text-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                </a>
                                {/* Github */}
                                <a href="#" className="text-slate-600 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
                                    </svg>
                                </a>
                                {/* Linkedin */}
                                <a href="#" className="text-slate-600 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                                    </svg>
                                </a>
                                {/* Youtube */}
                                <a href="#" className="text-slate-600 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
                                    </svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" className="text-slate-600 hover:text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-28 items-start">
                            {/* Products */}
                            <div>
                                <h3 className="font-medium text-sm mb-4 text-slate-700">Products</h3>
                                <ul className="space-y-3 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-neutral-400">Components</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Templates</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Icons</a></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h3 className="font-medium text-sm mb-4 text-slate-700">Resources</h3>
                                <ul className="space-y-3 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-neutral-400">PrebuiltUI</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Templates</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Components</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Blogs</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Store</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div className="col-span-2 md:col-span-1">
                                <h3 className="font-medium text-sm mb-4 text-slate-700">Company</h3>
                                <ul className="space-y-3 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-neutral-400">About</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Vision</a></li>
                                    <li className="flex items-center gap-2">
                                        <a href="#" className="hover:text-neutral-400">Careers</a>
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 border border-primary/30 text-primary">HIRING</span>
                                    </li>
                                    <li><a href="#" className="hover:text-neutral-400">Privacy policy</a></li>
                                    <li><a href="#" className="hover:text-neutral-400">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-gray-400 text-sm">© 2026 QuickAI</p>
                        <p className='text-sm text-gray-400'>All rights reserved.</p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-indigo-300/40 rounded-full blur-[170px] pointer-events-none"/>
                        <h3 className="text-center font-extrabold leading-[0.7] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-[clamp(3rem,15vw,15rem)] [-webkit-text-stroke:1px_#a5b4fc] mt-6" >
                            QuickAI
                        </h3>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Footer;