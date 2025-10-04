import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";


/**
 * Reusable Carousel Component
 * Built with Swiper.js
 */
const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}) => {
  // Inline styles are generally discouraged, but kept here to match the original code's intent.
  // A better approach would be to use CSS modules or a CSS-in-JS library.
  const css = `
    .Carousel_003 {
      width: 100%;
      height: 400px;
      padding-bottom: 50px !important;
    }

    @media (min-width: 768px) {
      .Carousel_003 {
        height: 550px;
      }
    }

    .Carousel_003 .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 300px;
    }

    @media (min-width: 768px) {
      .Carousel_003 .swiper-slide {
        width: 400px;
      }
    }

    .swiper-pagination-bullet {
      background-color: #fff !important;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-4xl px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousel_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                className="h-full w-full object-cover"
                src={image.src}
                alt={image.alt}
              />
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

/**
 * Component that provides data to the carousel.
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 */
const Skiper49 = () => {
  const images = [
    { src: "/swiperImg/HuracánSuccessor.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/LamborghiniHuracán.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/LamborghiniRevuelto.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/LamborghiniUrus.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/Lanzador.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/Lambo1.jpg", alt: "Lamborghini image" },
    { src: "/swiperImg/Lambo2.jpg", alt: "Lamborghini image" },

  ];

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[#000000]">
      <Carousel_003 images={images} showPagination loop />
    </div>
  );
};

/**
 * Main wrapper component.
 */
const LamboCrousel = () => {
  return <Skiper49 />;
};

export default LamboCrousel;