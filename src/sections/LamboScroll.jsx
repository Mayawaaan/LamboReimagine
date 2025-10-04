import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LamboScroll = () => {
  // --- Refs for DOM Elements and Mutable Values ---
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const overlayRef = useRef(null); // <-- 1. Add a ref for the overlay content
  const imageSeqRef = useRef({ frame: 0 });
  const imagesRef = useRef([]);

  // --- State for Loading Management ---
  const [loading, setLoading] = useState({
    progress: 0,
    isLoaded: false,
  });

  // --- Configuration ---
  const frameCount = 192;
  const firstFrameIndex = 1;

  // --- Canvas and Image Preloading Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    
    // The initial render function, used before ScrollTrigger takes over
    const initialRender = () => {
        const img = imagesRef.current[firstFrameIndex];
        if (!img || !img.complete) return;
        
        const canvasW = canvas.clientWidth;
        const canvasH = canvas.clientHeight;
        const canvasAspect = canvasW / canvasH;
        const imgAspect = img.width / img.height;
        let renderW, renderH, x, y;

        if (imgAspect > canvasAspect) {
            renderH = canvasH;
            renderW = renderH * imgAspect;
            x = (canvasW - renderW) / 2;
            y = 0;
        } else {
            renderW = canvasW;
            renderH = renderW / imgAspect;
            x = 0;
            y = (canvasH - renderH) / 2;
        }
        context.drawImage(img, x, y, renderW, renderH);
    };

    const loadImages = () => {
      let loadedCount = 0;
      for (let i = firstFrameIndex; i < firstFrameIndex + frameCount; i++) {
        const img = new Image();
        // Corrected the typo in the image path from "lmabo" to "lambo"
        img.src = `/lambo/lambo_${String(i).padStart(4, '0')}.jpg`;
        // Fallback for testing if you don't have the images locally:
        // img.src = `https://www.apple.com/105/media/us/airpods-pro/2022/d2deeb8e-83eb-48ea-9721-f567cf0fffa8/anim/sequence/large/01-hero-lightpass/${String(i).padStart(4, "0")}.jpg`;

        img.onload = () => {
          loadedCount++;
          const progress = Math.floor((loadedCount / frameCount) * 100);
          setLoading({ progress, isLoaded: false });
          
          if (loadedCount === frameCount) {
            setLoading({ progress: 100, isLoaded: true });
            initialRender(); 
          }
        };
        imagesRef.current[i] = img;
      }
    };

    setCanvasSize();
    loadImages();

    const handleResize = () => {
      setCanvasSize();
      initialRender();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --- GSAP ScrollTrigger Setup ---
  useEffect(() => {
    if (!loading.isLoaded || !heroRef.current) return;

    const render = (frame) => {
        const img = imagesRef.current[frame + firstFrameIndex];
        const canvas = canvasRef.current;
        if (!canvas || !img || !img.complete) return;
        const context = canvas.getContext('2d');
        const canvasW = canvas.clientWidth;
        const canvasH = canvas.clientHeight;
        const canvasAspect = canvasW / canvasH;
        const imgAspect = img.width / img.height;
        let renderW, renderH, x, y;
        if (imgAspect > canvasAspect) {
            renderH = canvasH;
            renderW = renderH * imgAspect;
            x = (canvasW - renderW) / 2;
            y = 0;
        } else {
            renderW = canvasW;
            renderH = renderW / imgAspect;
            x = 0;
            y = (canvasH - renderH) / 2;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, renderW, renderH);
    };

    const ctx = gsap.context(() => {
      // --- 2. Animate the overlay content ---
      gsap.to(overlayRef.current, {
        opacity: 0,
        y: -50, // Move it up slightly as it fades
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          // Make it fade out over the first 30% of the scroll
          end: '+=30%', 
          scrub: 1,
        },
      });
      
      // Canvas Image Sequence Animation
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: `+=${frameCount * 20}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const frame = Math.floor(self.progress * (frameCount - 1));
          if (imageSeqRef.current.frame !== frame) {
            imageSeqRef.current.frame = frame;
            window.requestAnimationFrame(() => render(frame));
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loading.isLoaded]);

  return (
    <div id="app-container" className="overflow-x-hidden">
      <div ref={heroRef} className="hero-container relative w-full h-screen flex flex-col items-center justify-center">
        <canvas ref={canvasRef} id="lambo-canvas" className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
        {!loading.isLoaded && (
          <div id="loading-overlay" className='absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center z-50 transition-opacity duration-500'>
            <div className='text-xl font-bold mb-4'>Loading Cinematic Experience...</div>
            <div className='w-48 bg-gray-700 rounded-full h-2.5'>
              <div
                className='bg-red-600 h-2.5 rounded-full transition-all duration-300'
                style={{ width: `${loading.progress}%` }}
              ></div>
            </div>
            <div className='mt-2 text-sm text-gray-400'>{loading.progress}%</div>
          </div>
        )}
        {/* --- 3. Attach the ref to the overlay div --- */}
        <div
          ref={overlayRef}
          id="overlay-content"
          className={`relative z-10 p-4 md:p-8 rounded-xl backdrop-blur-md bg-black/40 text-center ${!loading.isLoaded && 'opacity-0'}`}
        >
          <h1 className='text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight font-serif'>The Ultimate Drive</h1>
          <p className='mt-4 text-lg md:text-xl text-gray-300'>Scroll Down</p>
        </div>
      </div>

    </div>
  );
};

export default LamboScroll;