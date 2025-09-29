import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
        <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-white font-bold text-xl">InternSathi</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Reviews</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">Pricing</a>
              <a href="/signin">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md">
                  Sign Up
                </button>
              </a>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white font-medium">Features</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white font-medium">Reviews</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white font-medium">Pricing</a>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                Sign Up
              </button>
            </div>
          </div>
        )}
        
        {/* Government Bar */}
        <div className="w-full bg-black py-1">
          <div className="text-center">
            <span className="text-white text-xs font-medium">भारत सरकार / Government of India</span>
          </div>
        </div>
      </nav>
  )
}