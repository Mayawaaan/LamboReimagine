import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { GLTFLoader } from 'three-stdlib'
import { extend } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'

// Extend React Three Fiber with GLTFLoader
extend({ GLTFLoader })

// Camera Controller Component (must be inside Canvas)
const CameraController = ({ onRotationChange }) => {
  const { camera } = useThree()

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Only track mouse when over the canvas area
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const isOverCanvas = event.clientX >= rect.left && 
                          event.clientX <= rect.right && 
                          event.clientY >= rect.top && 
                          event.clientY <= rect.bottom;
      
      if (!isOverCanvas) return;
      
      // Map mouse position to rotation angles (-1 to 1)
      const mouseX = ((event.clientX / window.innerWidth)*1) - 0.5;
      let zRotation = 0;
      
      // Apply consistent z-rotation scaling across all x points
      zRotation = mouseX + mouseX;
            
      console.log("z:",zRotation)
      // Apply rotation to camera
      camera.rotation.z = zRotation;
      
      // Keep camera looking at the center
      camera.rotation(0, 0, 0);
      
      // Notify parent component of rotation change
      onRotationChange(zRotation);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, onRotationChange]);

  return null; // This component doesn't render anything
}

// Enhanced Dynamic Lighting Component
const DynamicLighting = ({ rotation }) => {
  // Calculate light position based on rotation
  const lightX = Math.cos(rotation) * 8;
  const lightY = Math.sin(rotation) * 8;
  const lightZ = 4;
  
  // Calculate light intensity based on rotation (1.0 to 4.0)
  const intensity = 1.0 + (Math.abs(rotation) / 2) * 3.0;
  
  // Calculate light color based on rotation
  const hue = (rotation + 2) * 60; // Convert rotation to hue (0-240)
  const color = `hsl(${hue}, 80%, 60%)`;

  return (
    <>
      {/* Main directional light */}
      <directionalLight 
        position={[lightX, lightY, lightZ]} 
        intensity={intensity}
        color={color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Secondary point light */}
      <pointLight 
        position={[lightX * 0.6, lightY * 0.6, lightZ * 0.6]} 
        intensity={intensity * 0.8}
        color={color}
        distance={20}
        decay={2}
      />
      
      {/* Rim lighting */}
      <pointLight 
        position={[-lightX * 0.8, -lightY * 0.8, lightZ * 1.2]} 
        intensity={intensity * 0.4}
        color={color}
        distance={15}
        decay={1.5}
      />
      
      {/* Fill light */}
      <pointLight 
        position={[0, 0, lightZ * 1.5]} 
        intensity={intensity * 0.3}
        color={color}
        distance={25}
        decay={2}
      />
      
      {/* Accent spotlight */}
      <spotLight
        position={[lightX * 1.5, lightY * 1.5, lightZ * 1.5]}
        intensity={intensity * 0.6}
        color={color}
        angle={Math.PI / 6}
        penumbra={0.3}
        distance={30}
        decay={2}
        target-position={[0, 0, 0]}
        castShadow
      />
    </>
  );
};

// GLTF Model Component
const Model = () => {
  const { scene } = useGLTF('/wheel.glb')
  return <primitive object={scene} scale={0.75} position={[0,-0.15 , 0]} rotation={[0,-1.7,0]} />
}

// Loading fallback
const ModelLoader = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const Logo = () => {
  const [rotation, setRotation] = React.useState(0);
  const ambientLightRef = useRef(null);
  const gridRef = useRef(null);
  const highlightRef = useRef(null);
  const floorRef = useRef(null);
  const accentRef = useRef(null);
  const spotlight1Ref = useRef(null);
  const spotlight2Ref = useRef(null);

  const handleRotationChange = (newRotation) => {
    setRotation(newRotation);
  };

  useEffect(() => {
    // Animate background elements on mount
    gsap.set([ambientLightRef.current, gridRef.current, highlightRef.current, floorRef.current, accentRef.current, spotlight1Ref.current, spotlight2Ref.current], {
      opacity: 0,
      scale: 0.8
    });

    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.to(ambientLightRef.current, {
      opacity: 0.3,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    })
    .to(gridRef.current, {
      opacity: 0.08,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(highlightRef.current, {
      opacity: 0.2,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(floorRef.current, {
      opacity: 0.15,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to(accentRef.current, {
      opacity: 0.1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to([spotlight1Ref.current, spotlight2Ref.current], {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5");

    // Add continuous animations
    gsap.to(ambientLightRef.current, {
      opacity: 0.4,
      duration: 4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(gridRef.current, {
      rotation: "+=360",
      duration: 20,
      ease: "none",
      repeat: -1
    });

    gsap.to(highlightRef.current, {
      rotation: "+=180",
      duration: 8,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(floorRef.current, {
      rotation: "+=90",
      duration: 15,
      ease: "none",
      repeat: -1
    });

    gsap.to(accentRef.current, {
      rotation: "+=270",
      duration: 12,
      ease: "none",
      repeat: -1
    });

    gsap.to(spotlight1Ref.current, {
      x: "+=50",
      y: "+=30",
      duration: 6,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(spotlight2Ref.current, {
      x: "-=40",
      y: "-=20",
      duration: 8,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

  }, []);

  // Calculate gradient colors based on rotation
  const getGradientColors = (rotation) => {
    // Neutral luxury palette - sophisticated grays and subtle tones
    const baseHue = 0; // Neutral gray base
    const rotationOffset = rotation * 5; // Very subtle color shift
    
    return {
      color1: `hsl(${baseHue + rotationOffset}, 5%, 12%)`, // Dark charcoal
      color2: `hsl(${baseHue + rotationOffset + 10}, 3%, 8%)`, // Darker charcoal
      color3: `hsl(${baseHue + rotationOffset + 20}, 2%, 4%)`  // Almost black
    };
  };

  const gradientColors = getGradientColors(rotation);

  return (
    <div 
      className="w-full h-screen relative "
      style={{
        background: `radial-gradient(ellipse at center, ${gradientColors.color1} 0%, ${gradientColors.color2} 50%, ${gradientColors.color3} 100%)`
      }}
    >
      {/* Subtle ambient lighting */}
      <div 
        ref={ambientLightRef}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)`
        }}
      />
      
      {/* Neutral grid pattern */}
      <div 
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Subtle highlight sweep */}
      <div 
        ref={highlightRef}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${90 + rotation * 15}deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)`
        }}
      />
      
      {/* Neutral floor pattern */}
      <div 
        ref={floorRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 30%)
          `
        }}
      />
      
      {/* Sophisticated accent lines */}
      <div 
        ref={accentRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              ${30 + rotation * 3}deg,
              transparent 0px,
              transparent 148px,
              rgba(255, 255, 255, 0.05) 150px,
              rgba(255, 255, 255, 0.05) 152px
            )
          `
        }}
      />
      
      {/* Gentle spotlight effects */}
      <div 
        ref={spotlight1Ref}
        className="absolute top-1/3 left-1/3 w-40 h-40"
        style={{
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`
        }}
      />
      <div 
        ref={spotlight2Ref}
        className="absolute bottom-1/3 right-1/3 w-32 h-32"
        style={{
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)`
        }}
      />

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50, rotation:[0,0,0]}}
        style={{ 
          pointerEvents: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      >
        <Suspense fallback={<ModelLoader />}>
          <CameraController onRotationChange={handleRotationChange} />
          <Model />
          <Environment preset="studio" />
          <ambientLight intensity={0.2} />
          <DynamicLighting rotation={rotation} />
          
          {/* Additional atmospheric lighting */}
          <hemisphereLight 
            skyColor={`hsl(${(rotation + 2) * 30 + 200}, 20%, 0.3)`}
            groundColor={`hsl(${(rotation + 2) * 30 + 200}, 30%, 0.1)`}
            intensity={0.4}
          />
          
          {/* Volumetric lighting effect */}
          <pointLight 
            position={[Math.cos(rotation) * 6, Math.sin(rotation) * 6, 3]} 
            intensity={0.5}
            color={`hsl(${(rotation + 2) * 60 + 30}, 60%, 70%)`}
            distance={12}
            decay={1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Logo