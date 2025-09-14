import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Briefcase, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";


export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = () => {
    console.log('Registration attempted with:', { name, email, password, agreeTerms });
    // Handle registration logic here
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Registration Modal */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-3">
              Join Us Today
            </h1>
            <p className="text-xl font-semibold text-blue-700">
              Create your Internship Engine account
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white border border-blue-100 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 placeholder-blue-400"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-400 hover:text-blue-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-blue-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Create Account
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-sm text-blue-600">
                  Already have an account?{' '}
              <button
      type="button"
      onClick={() => navigate("/signin")}
      className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
    >
      Sign in here
    </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-blue-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Modern Animated Background */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-bg-600 to-blue-300">
          {/* Floating Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-16 w-20 h-20 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-32 w-16 h-16 bg-white/5 rounded-full animate-bounce delay-500"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            {/* GIF Container with Modern Frame */}
            <div className="mb-8 relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                <img 
                  src="/ok2.gif" 
                  alt="Developer working animation"
                  className="w-full h-auto max-w-sm mx-auto rounded-xl shadow-lg"
                />
              </div>
              {/* Floating Emojis */}
              <div className="absolute -top-4 -left-4 text-3xl animate-bounce">🎓</div>
              <div className="absolute -top-2 -right-6 text-2xl animate-pulse delay-300">🚀</div>
              <div className="absolute -bottom-4 -left-2 text-2xl animate-bounce delay-700">⭐</div>
              <div className="absolute -bottom-6 -right-4 text-3xl animate-pulse delay-1000">💼</div>
            </div>

            {/* Modern Typography */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                🌟 Start Your Journey
              </h2>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-blue-200">
              <p className="text-sm flex items-center justify-center gap-2">
                🎯 Your success story begins now • 💫 Ready to get started?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}