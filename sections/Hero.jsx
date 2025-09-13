import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, TrendingUp, Star, CheckCircle, Menu, X, MapPin, Zap } from 'lucide-react';

// Internship Card Component
const InternshipCard = ({ company, role, location, match, color, delay, index }) => (
  <div 
    className={`${color} border rounded-xl p-4 transform transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer mb-3`}
    style={{ 
      animationDelay: delay,
      animation: `fadeInUp 0.6s ease-out ${delay} both`
    }}
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-sm">{company}</h3>
        <p className="text-xs text-gray-700 mb-1">{role}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
      </div>
      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
        <Zap className="w-3 h-3" />
        {match}
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors">
        Apply Now
      </button>
      <button className="border border-gray-300 text-gray-600 px-3 py-1 rounded-md text-xs hover:bg-gray-50 transition-colors">
        Save
      </button>
    </div>
  </div>
);

export default function () {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
           
    useEffect(() => {
        setIsVisible(true);
        
        // Animate scroll position
        const interval = setInterval(() => {
          setScrollPosition(prev => (prev + 1) % 100);
        }, 100);
        
        return () => clearInterval(interval);
    }, []);

    const internships = [
      { company: "Google", role: "Product Manager Intern", location: "Mountain View, CA", match: "95%", color: "bg-green-50 border-green-200" },
      { company: "Meta", role: "PM Intern - Social Impact", location: "Menlo Park, CA", match: "89%", color: "bg-blue-50 border-blue-200" },
      { company: "Stripe", role: "Product Intern - Payments", location: "San Francisco, CA", match: "92%", color: "bg-purple-50 border-purple-200" },
      { company: "Notion", role: "Product Manager Intern", location: "New York, NY", match: "87%", color: "bg-gray-50 border-gray-200" },
      { company: "Figma", role: "PM Intern - Design Tools", location: "Remote", match: "90%", color: "bg-pink-50 border-pink-200" },
      { company: "Airbnb", role: "Product Strategy Intern", location: "Seattle, WA", match: "88%", color: "bg-red-50 border-red-200" },
      { company: "Netflix", role: "PM Intern - Content", location: "Los Angeles, CA", match: "91%", color: "bg-yellow-50 border-yellow-200" }
    ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          
          @keyframes pulseGlow {
            0%, 100% { 
              background-color: rgb(219 234 254);
              border-color: rgb(147 197 253);
              transform: scale(1);
            }
            50% { 
              background-color: rgb(191 219 254);
              border-color: rgb(59 130 246);
              transform: scale(1.05);
            }
          }
          
          .scroll-container {
            animation: scrollUp 15s linear infinite;
          }
          
          .pulse-domain {
            animation: pulseGlow 2s infinite;
          }
        `
      }} />
      
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-900 mb-6 leading-tight">
                Find Your Perfect
                <span className="text-blue-600 block">
                  PM Internship
                </span>
                <span className="text-blue-800 block text-3xl md:text-4xl lg:text-5xl mt-2">
                  with AI.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-700 mb-8 leading-relaxed">
                #1 AI internship platform for <span className="text-blue-600 font-semibold">students</span>, <span className="text-blue-600 font-semibold">teams</span>, and <span className="text-blue-600 font-semibold">organizations</span>.
              </p>
              
              <div className="mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg mb-6">
                  Get started – free forever!
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="space-y-2 text-blue-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Yes, it's 100% free! AI-powered matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>We don't train AI on your data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Section - Animated Internship Finder */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden h-[500px]">
                {/* Browser Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600">Find PM Internships</div>
                </div>

                {/* Domain Selection Filter - Animated */}
                <div className="mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {['Tech', 'Fintech', 'Healthcare', 'E-commerce', 'Startup'].map((domain, index) => (
                      <div
                        key={domain}
                        className={`px-3 py-1 text-xs rounded-full border-2 cursor-pointer transition-all duration-500 ${
                          index === 0 || index === 2 
                            ? 'pulse-domain text-blue-700' 
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-200'
                        }`}
                      >
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scrolling Internship Cards */}
                <div className="relative h-80 overflow-hidden">
                  <div className="scroll-container">
                    <div className="space-y-0">
                      {[...internships, ...internships].map((internship, index) => (
                        <InternshipCard 
                          key={`${internship.company}-${index}`}
                          company={internship.company}
                          role={internship.role}
                          location={internship.location}
                          match={internship.match}
                          color={internship.color}
                          delay={`${index * 0.1}s`}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Gradient fade at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                </div>

                {/* AI Match Indicator */}
                <div 
                  className="absolute top-20 right-6 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out 1s both, pulseGlow 3s infinite 2s'
                  }}
                >
                  AI Match!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}