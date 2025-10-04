import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 font-serif">
      <div className="max-w-6xl mx-auto">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <img className="h-16 mx-auto mb-4" src="/logo.png" alt="Lamborghini Logo" />
          <p className="text-yellow-500 text-lg font-semibold">Dare to Dream, Dare to Drive</p>
        </div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8"
        >
          <a href="#home" className="hover:text-yellow-500 transition-colors duration-300">Home</a>
          <a href="#about" className="hover:text-yellow-500 transition-colors duration-300">About</a>
          <a href="#models" className="hover:text-yellow-500 transition-colors duration-300">Models</a>
          <a href="#contact" className="hover:text-yellow-500 transition-colors duration-300">Contact</a>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-6 mb-8"
        >
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-yellow-500 transition-colors duration-300">
            <Facebook size={24} />
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-gray-400 text-sm"
        >
          <p>&copy; 2025 Lamborghini. All rights reserved.</p>
        </motion.div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-4">
        Designed and created by Ayan Magardey
      </div>
    </footer>
  );
};

export default Footer;
