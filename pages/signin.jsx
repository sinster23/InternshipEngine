import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log('Sign in attempted with:', { email, password, rememberMe });
    // Handle sign in logic here
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Sign In Modal */}
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
              Welcome Back
            </h1>
            <p className="text-xl font-semibold text-blue-700">
              Sign in to your Internship Engine 
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white border border-blue-100 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400" />
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
              
                </div>
              
              </div>

              {/* Sign In Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Sign In
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-blue-600">
                  Don't have an account?{' '}
                <Link to="/registration">
  <button
    type="button"
    className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
  >
    Sign up here
  </button>
</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-blue-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
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
              <div className="absolute -top-4 -left-4 text-3xl animate-bounce">💼</div>
              <div className="absolute -top-2 -right-6 text-2xl animate-pulse delay-300">🚀</div>
              <div className="absolute -bottom-4 -left-2 text-2xl animate-bounce delay-700">⭐</div>
              <div className="absolute -bottom-6 -right-4 text-3xl animate-pulse delay-1000">💡</div>
            </div>

            {/* Modern Typography */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                🎯 Launch Your Dream Career
              </h2>
             
            </div>

            {/* Modern Stats Cards */}
         
            {/* Call to Action */}
            <div className="mt-8 text-blue-200">
              <p className="text-sm flex items-center justify-center gap-2">
                ✨ Your future starts here • 🎓 Ready to shine?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}