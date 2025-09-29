import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, TrendingUp, Star, CheckCircle, Menu, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import Middle from '../sections/Middle';
import TimeLine from '../sections/Timeline';
import Testimonials from '../sections/Testimonials';
import Cta from '../sections/cta';

export default function PMInternshipLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
       <Hero />

      {/* Features Section */}
      <Features />

      <Middle />

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Students Matched", color: "text-blue-400" },
            { number: "500+", label: "Partner Companies", color: "text-green-400" },
            { number: "95%", label: "Success Rate", color: "text-blue-400" },
            { number: "4.9", label: "Average Rating", color: "text-green-400" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-md hover:border-gray-600 transition-colors duration-300">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

      <TimeLine />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Success Banner */}
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-y border-gray-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-blue-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">Join 10,000+ Successful Interns</h3>
        </div>
        <p className="text-gray-300 text-lg">
          Our students have secured internships at Google, Meta, Microsoft, Apple, and 500+ other top companies.
        </p>
      </div>
    </section>


      {/* CTA Section */}
      <Cta />

      {/* Footer */}
    <footer className="bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-white font-bold text-xl">InternSathi</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Empowering the next generation of product managers through intelligent internship matching.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 InternSathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
}