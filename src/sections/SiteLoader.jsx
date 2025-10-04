import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const SiteLoader = () => {
  const mainDivRef = useRef(null)
  const titleRef = useRef(null)
  const logoWrapRef = useRef(null)
  const speedoWrapRef = useRef(null)
  const arcRef = useRef(null)
  const speedLabelRef = useRef(null)
  const gearLabelRef = useRef(null)
  const speedValue = useRef(0)
  const gsapTween = useRef(null)
  const [gear, setGear] = useState('P')

  const getAutoGear = (speed) => {
    const realSpeed = Math.round(speed * 355)
    if (realSpeed === 0) return 'P'
    if (realSpeed > 0 && realSpeed <= 50) return 'D'
    if (realSpeed > 50 && realSpeed <= 100) return 'L'
    if (realSpeed > 100) return 'S'
    return 'P'
  }

  function getColorForValue(val) {
    if (val < 0.5) {
      const t = val * 2
      return `rgb(${255 - Math.round(233 * t)},255,${255 - Math.round(255 * t)})`
    } else {
      const t = (val - 0.5) * 2
      return `rgb(${34 + Math.round(221 * t)},${197 - Math.round(153 * t)},${94 - Math.round(94 * t)})`
    }
  }

  useEffect(() => {
    gsap.set(mainDivRef.current, { opacity: 0, height: 0 })
    gsap.set(titleRef.current, { opacity: 0, y: 40, scale: 0.8 })
    gsap.set(logoWrapRef.current, { opacity: 0, y: 40, scale: 0.5})
    gsap.set(speedoWrapRef.current, { opacity: 0, y: 40, scale: 0.8 })

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    })

    tl.to(mainDivRef.current, { opacity: 1, height: '100vh', duration: 0.8, ease: "power2.inOut" })
      .to(titleRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)" 
      }, "+=0.2")
      .to(logoWrapRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        ease: "back.out(1.7)" 
      }, "+=0.1")
      .to(speedoWrapRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: "power2.out" 
      }, "+=0.1")
      .add(() => {
        // Add pulsing animation to logo
        gsap.to(logoWrapRef.current, {
          scale: 1.1,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        })

        // Add floating animation to title
        gsap.to(titleRef.current, {
          y: "+=5",
          duration: 3,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        })

        gsapTween.current = gsap.to(speedValue, {
          current: 1,
          duration: 8,
          ease: "power1.inOut",
          onUpdate: () => {
            const speed = speedValue.current
            const color = getColorForValue(speed)
            if (arcRef.current) {
              arcRef.current.setAttribute("stroke", color)
            }
            if (speedLabelRef.current) {
              const realSpeed = Math.round(speed * 355)
              speedLabelRef.current.textContent = `Speed: ${realSpeed}`
              speedLabelRef.current.style.color = color
            }
            const newGear = getAutoGear(speed)
            setGear(newGear)
            if (gearLabelRef.current) {
              gearLabelRef.current.textContent = newGear
              gearLabelRef.current.style.color = color
            }
          },
          onComplete: () => {
            setTimeout(() => {
              exitSequence()
            }, 600)
          }
        })
      }, "+=0.2")

    const exitSequence = () => {
      const exitTl = gsap.timeline()
      exitTl
        .to(speedoWrapRef.current, { opacity: 0, y: 40, duration: 0.4 })
        .to(logoWrapRef.current, { opacity: 0, y: 40, duration: 0.4 }, "-=0.2")
        .to(titleRef.current, { opacity: 0, y: 40, duration: 0.4 }, "-=0.2")
        .to(mainDivRef.current, { opacity: 0, height: 0, duration: 0.6 }, "-=0.1")
        .call(() => {
          // Emit completion event after exit animation is fully complete
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('loaderComplete'))
          }, 200)
        })
    }

    return () => {
      if (gsapTween.current) {
        gsapTween.current.kill()
      }
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={mainDivRef}
      className="bg-black text-white uppercase h-screen w-full flex flex-col items-center justify-around mainDiv overflow-hidden"
      style={{ height: '100vh', transition: 'height 0.6s' }}
    >
      <p
        ref={titleRef}
        className="text-xl md:text-2xl mt-4 tracking-widest font-extrabold font-mono"
      >
        Unleash the Power Within
      </p>
      <div ref={logoWrapRef} className="relative flex flex-col items-center">
        <img src="./logo.png" alt="Lamborgini Logo" className="relative z-10" />
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 -mt-4 w-40 h-8 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, #22c55e 0%, #ef4444 100%)',
            opacity: 0.7,
            zIndex: 0,
          }}
        ></div>
      </div>
      <div
        ref={speedoWrapRef}
        className="flex flex-col items-center mt-8 relative"
        style={{ minHeight: 180 }}
      >
        <svg
          id="speedometer"
          width="300"
          height="160"
          viewBox="0 0 300 160"
          className="mb-4"
        >
          <defs>
            <linearGradient id="speedo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path
            id="arc"
            ref={arcRef}
            d="M 40 140 A 110 110 0 0 1 260 140"
            stroke="url(#speedo-gradient)"
            strokeWidth="18"
            fill="none"
          />
        </svg>
        <div
          className="mt-25 mb-1 flex items-center justify-center absolute"
          style={{
            minWidth: 60,
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '0.2em',
            border: 'none'
          }}
        >
          <span ref={gearLabelRef}>{gear}</span>
        </div>
        <p
          id="speed-label"
          ref={speedLabelRef}
          className="text-lg font-mono tracking-widest"
        ></p>
      </div>
    </div>
  )
}

export default SiteLoader