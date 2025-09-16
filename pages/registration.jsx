import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Briefcase, CheckCircle, Star, Mail, Apple, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { signUpUser, signInWithGoogle, signInWithApple, validatePasswordStrength, validateEmail } from '../auth/AuthFunctions';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);
  
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time password validation
    if (name === 'password') {
      const validation = validatePasswordStrength(value);
      setPasswordValidation(validation);
    }

    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isStrong) {
      setError('Please choose a stronger password with at least 8 characters, including uppercase, lowercase, numbers, and special characters');
      setLoading(false);
      return;
    }

    // Attempt to create account
    const result = await signUpUser(email, password);

    if (result.success) {
      setSuccessMessage(result.message);
      // Clear form
      setFormData({
        email: '',
        password: '',
      });
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/details');
      }, 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    const result = await signInWithGoogle();

    if (result.success) {
    // Redirect based on profile status
    if (result.redirectTo === "details") {
      // Navigate to details page
      navigate("/details");
    } else {
      // Navigate to dashboard
      navigate("/dashboard");
    }
  } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Handle Apple sign up
  const handleAppleSignUp = async () => {
    setError('');
    setLoading(true);

    const result = await signInWithApple();

   
    if (result.success) {
    if (result.redirectTo === "details") {
      navigate("/details");
    } else {
      navigate("/dashboard");
    }
  }  else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Sign Up Form */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-3">
              Welcome to InternMatch
            </h1>
            <p className="text-xl font-semibold text-blue-700">
              Create your account to get started
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-green-700 text-sm">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordValidation && formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordValidation.strength < 2 ? 'bg-red-500 w-1/4' :
                          passwordValidation.strength < 4 ? 'bg-yellow-500 w-2/4' : 
                          'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordValidation.strength < 2 ? 'text-red-500' :
                      passwordValidation.strength < 4 ? 'text-yellow-500' : 
                      'text-green-500'
                    }`}>
                      {passwordValidation.message}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries({
                      'At least 8 characters': passwordValidation.requirements.minLength,
                      'Uppercase letter': passwordValidation.requirements.hasUpperCase,
                      'Lowercase letter': passwordValidation.requirements.hasLowerCase,
                      'Number': passwordValidation.requirements.hasNumbers,
                    }).map(([requirement, met]) => (
                      <div key={requirement} className={`flex items-center space-x-1 ${met ? 'text-green-600' : 'text-gray-400'}`}>
                        {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Sign up with Google
            </button>

            <button
              type="button"
              onClick={handleAppleSignUp}
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Apple className="w-5 h-5 mr-2" />
              )}
              Sign up with Apple
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-xs text-blue-500 mt-2">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Modern Animated Background */}
      <div className="hidden md:block md:w-3/5 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-16">
          <div className="text-center text-white max-w-2xl">
            {/* GIF Container with Enhanced Modern Frame */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-xl">
                {/* Placeholder for your GIF */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src="/ok2.gif" 
                    alt="AI matching process visualization"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Floating elements for visual interest */}
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                  <Star className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Enhanced Modern Typography */}
            <div className="space-y-6 mt-2">
              <p className="text-lg text-blue-800 leading-relaxed max-w-lg mx-auto">
                Join thousands of students who've kickstarted their careers with our platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}