import React, { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { Spiral as Hamburger } from 'hamburger-react'
import { gsap } from 'gsap'
const LandingPage = () => {
  const [isOpen, setOpen] = useState(false)
  const navRef = useRef(null)
  const textRef = useRef(null)
  const buttonsRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    // Set initial states
    gsap.set(navRef.current, { opacity: 0, y: -50 })
    gsap.set(textRef.current, { opacity: 0, y: 50, scale: 0.8 })
    gsap.set(buttonsRef.current, { opacity: 0, y: 50 })
    gsap.set(logoRef.current, { opacity: 0, scale: 0.5 })

    // Create entrance animation timeline
    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.to(logoRef.current, { 
      opacity: 1, 
      scale: 1, 
      duration: 1.2, 
      ease: "back.out(1.7)" 
    })
    .to(navRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power2.out" 
    }, "-=0.6")
    .to(textRef.current, { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 1, 
      ease: "power2.out" 
    }, "-=0.4")
    .to(buttonsRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power2.out" 
    }, "-=0.2")

    // Add floating animation to text
    gsap.to(textRef.current, {
      y: "+=10",
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    })

    // Add subtle rotation to logo
    gsap.to(logoRef.current, {
      rotation: "+=5",
      duration: 8,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    })


  }, [])

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {/* Fixed navbar at the top */}
      <nav ref={navRef} className='fixed top-0 left-0 right-0 text-white flex justify-between w-full items-center z-50  backdrop-blur-sm px-4 py-2'>
        <img ref={logoRef} className='h-16' src="/logo.png" alt="Logo" />
        <img className='absolute left-1/2 transform -translate-x-1/2' src="/logo_headline.svg" alt="" srcSet="" />
        <div className="flex items-center px-8">
          <div className="md:hidden z-20">
            <Hamburger toggled={isOpen} toggle={setOpen} size={28} color="#fff" />
          </div>
          <ul className={`
            flex-col md:flex-row md:flex gap-8 ml-8 text-lg font-semibold transition-all duration-300
            ${isOpen ? 'flex absolute top-16 left-0 w-full bg-black bg-opacity-90 z-10 p-6' : 'hidden md:flex'}
          `}>
            <li className="hover:text-yellow-500 cursor-pointer"><a href="#home">Home</a></li>
            <li className="hover:text-yellow-500 cursor-pointer"><a href="#about">About</a></li>
            <li className="hover:text-yellow-500 cursor-pointer"><a href="#models">Models</a></li>
            <li className="hover:text-yellow-500 cursor-pointer"><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>
      
      {/* 3D Scene takes full screen */}
      <Logo/>
      
      {/* Text overlay */}
      <h1 ref={textRef} className="absolute bottom-32 md:bottom-62 left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl font-extrabold text-yellow-500 text-center drop-shadow-lg flex flex-col md:flex-row gap-4 md:gap-[40vw] whitespace-nowrap font-serif">
        <span>Dare to Dream</span>
        <span>Dare to Drive</span>
      </h1>
      
      {/* Action Buttons */}
      <div ref={buttonsRef} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-3 z-40">
        {/* Primary CTA Button */}
        <button className="group relative px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-sm rounded-md shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 overflow-hidden">
          <span className="relative z-10">Explore Models</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        {/* Secondary Button */}
        <button className="group relative px-4 py-2 bg-transparent border border-yellow-500 text-yellow-500 font-semibold text-sm rounded-md hover:bg-yellow-500 hover:text-black transition-all duration-300 hover:scale-105 overflow-hidden">
          <span className="relative z-10">Learn More</span>
          <div className="absolute inset-0 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
        
        {/* Luxury Button */}
        <button className="group relative px-4 py-2 bg-black/50 backdrop-blur-sm border border-yellow-500/30 text-yellow-500 font-semibold text-sm rounded-md hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-300 hover:scale-105 overflow-hidden">
          <span className="relative z-10">Contact Us</span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  )
}

export default LandingPage