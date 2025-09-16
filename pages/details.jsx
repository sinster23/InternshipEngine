import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Calendar, Briefcase, Upload, FileText, CheckCircle, X, ChevronRight, ChevronLeft, Check, GraduationCap, Sparkles, Plus, Trash2, Clock, Building, Home, Laptop } from 'lucide-react';
import { auth,db } from '../src/firebase';
import { collection, addDoc,setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { markProfileComplete } from '../auth/AuthFunctions';

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    university: '',
    course: '',
    graduationYear: '',
    experience: '',
    linkedIn: '',
    portfolio: '',
    skills: [],
    internshipDuration: '',
    preferredCities: [],
    workPreference: '',
    availability: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  // Predefined skill suggestions
  const skillSuggestions = [
    'Product Strategy', 'Market Research', 'User Research', 'Data Analysis',
    'A/B Testing', 'SQL', 'Python', 'Figma', 'Jira', 'Agile/Scrum',
    'Wireframing', 'User Experience Design', 'Project Management',
    'Competitive Analysis', 'Customer Interviews', 'Product Roadmapping',
    'Stakeholder Management', 'Business Intelligence', 'Excel/Sheets',
    'Presentation Skills', 'Communication', 'Leadership'
  ];

  // Popular cities for internships
  const popularCities = [
    'New York', 'San Francisco', 'Seattle', 'Austin', 'Boston', 'Chicago',
    'Los Angeles', 'Denver', 'Atlanta', 'Washington DC', 'Remote'
  ];

  const steps = [
    {
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      icon: User,
      type: 'personal'
    },
    {
      title: 'Resume Upload',
      subtitle: 'Upload your resume for better matching',
      icon: Upload,
      type: 'resume'
    },
    {
      title: 'Education Details',
      subtitle: 'Your academic background',
      icon: GraduationCap,
      type: 'education'
    },
    {
      title: 'Internship Preferences',
      subtitle: 'Help us match you with perfect opportunities',
      icon: Sparkles,
      type: 'preferences'
    },
    {
      title: 'Additional Information',
      subtitle: 'Social links and profiles',
      icon: Briefcase,
      type: 'additional'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (files) => {
    const file = files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf') || 
                 file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setUploadedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type || 'document',
        file: file // Store the actual file object for later upload if needed
      });
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  // Skills management functions
  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmedSkill]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  // City management functions
  const addCity = (city) => {
    const trimmedCity = city.trim();
    if (trimmedCity && !formData.preferredCities.includes(trimmedCity)) {
      setFormData({
        ...formData,
        preferredCities: [...formData.preferredCities, trimmedCity]
      });
      setCityInput('');
    }
  };

  const removeCity = (cityToRemove) => {
    setFormData({
      ...formData,
      preferredCities: formData.preferredCities.filter(city => city !== cityToRemove)
    });
  };

  const handleCityInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCity(cityInput);
    }
  };

  const isStepCompleted = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Personal Information
        return formData.firstName && formData.lastName && 
             formData.phone;
      case 1: // Resume Upload
        return uploadedFile !== null;
      case 2: // Education Details
        return formData.university && formData.course && formData.graduationYear && formData.experience;
      case 3: // Internship Preferences - NOW REQUIRED
        return formData.skills.length > 0 && 
               formData.internshipDuration && 
               formData.preferredCities.length > 0 && 
               formData.workPreference && 
               formData.availability;
      case 4: // Additional Information - now always completed (optional step)
        return true;
      default:
        return false;
    }
  };

  // Function to save data to Firebase
  const saveToFirestore = async () => {
  setIsSubmitting(true);
  try {
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: auth.currentUser.email,
      phone: formData.phone,
      location: formData.location,
      university: formData.university,
      course: formData.course,
      graduationYear: parseInt(formData.graduationYear),
      experience: formData.experience,
      resume: uploadedFile
        ? {
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type,
          }
        : null,
      skills: formData.skills,
      internshipDuration: formData.internshipDuration,
      preferredCities: formData.preferredCities,
      workPreference: formData.workPreference,
      availability: formData.availability,
      linkedIn: formData.linkedIn || null,
      portfolio: formData.portfolio || null,
      accountType: "student",
      registrationDate: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      isActive: true,
    };
    await markProfileComplete(auth.currentUser.uid, userData);

    alert("Account created successfully! Welcome to PM Internships Hub.");

    setIsModalOpen(false);
    setCurrentStep(0);
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      location: "",
      university: "",
      course: "",
      graduationYear: "",
      experience: "",
      linkedIn: "",
      portfolio: "",
      skills: [],
      internshipDuration: "",
      preferredCities: [],
      workPreference: "",
      availability: "",
    });
    setUploadedFile(null);
  } catch (error) {
    console.error("Error saving user data: ", error);
    alert("There was an error creating your account. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    
    // Validation based on step - only skip validation for step 4 (Additional Information)
    if (!isStepCompleted(currentStep) && currentStep !== 4) {
      if (currentStep === 3) {
        alert('Please complete all internship preference fields to help us find the best matches for you.');
      } else {
        alert('Please complete all required fields before proceeding.');
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - save to Firebase
      await saveToFirestore();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon;
  const completedSteps = steps.filter((_, index) => isStepCompleted(index)).length;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex relative overflow-hidden">
      {/* Left Side - Progress Tree */}
      <div className="w-1/3 bg-gradient-to-br from-blue-100 via-blue-50 to-white p-6 flex items-center justify-center shadow-2xl relative">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-blue-900 mb-3">
              Profile Completion
            </h2>
            <p className="text-blue-700 text-sm font-medium">
              Complete all steps to set up your account
            </p>
          </div>

          {/* Progress Tree */}
          <div className="space-y-4 relative">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = isStepCompleted(index);
              const isCurrent = currentStep === index && isModalOpen;
              const isPast = index < currentStep;
              
              return (
                <div key={index} className="flex items-center space-x-4 relative group">
                  {/* Step Indicator */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 z-10 flex-shrink-0 shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white transform scale-105 shadow-green-200' 
                      : isCurrent 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-700 text-white animate-pulse transform scale-105 shadow-blue-200' 
                        : isPast 
                          ? 'bg-gradient-to-r from-blue-200 to-cyan-300 text-blue-700 shadow-blue-100' 
                          : 'bg-white border-2 border-blue-200 text-blue-400 shadow-blue-50'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-6 top-12 w-0.5 h-6 transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-gradient-to-b from-green-400 to-green-300' : 'bg-gradient-to-b from-blue-200 to-blue-150'
                      }`}
                    ></div>
                  )}

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm transition-colors duration-300 mb-1 ${
                      isCompleted 
                        ? 'text-green-700' 
                        : isCurrent 
                          ? 'text-blue-900' 
                          : isPast 
                            ? 'text-blue-700' 
                            : 'text-blue-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs ${
                      isCompleted 
                        ? 'text-green-600 font-semibold' 
                        : isCurrent 
                          ? 'text-blue-600 font-semibold'
                          : 'text-blue-500'
                    }`}>
                      {isCompleted ? 'Completed ✓' : isCurrent ? 'In Progress...' : step.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Status */}
          <div className="mt-8 p-4 bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100">
            <div className="text-center">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-800 mb-2">
                {completedSteps} / {steps.length}
              </div>
              <p className="text-sm text-blue-700 font-semibold mb-3">Steps Completed</p>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Forms */}
      <div className="w-2/3 p-6 flex items-center justify-center relative z-10 overflow-y-auto">
        {!isModalOpen ? (
          /* Initial State - Start Button */
          <div className="text-center max-w-2xl">
            <div className="mb-6">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-800 mb-4 leading-tight">
                Complete Your Profile
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 mx-auto mb-4 rounded-full"></div>
              <p className="text-lg font-semibold text-blue-700 mb-3 leading-relaxed">
                Join PM Internships Hub and start your product management journey
              </p>
              <p className="text-base text-blue-600 opacity-80">
                Connect with 10,000+ product management internship opportunities
              </p>
            </div>
            <button
              onClick={openModal}
              className="group bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-cyan-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
            >
              <span className="flex items-center justify-center">
                Get Started
                <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        ) : (
          /* Step Content */
          <div className="w-full max-w-2xl">
            {/* Step Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-800 mb-3 leading-tight text-center">
                {currentStepData.title}
              </h1>
              <p className="text-lg font-medium text-blue-700 mb-4 text-center">
                {currentStepData.subtitle}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-blue-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                  </span>
                </div>
                <div className="relative w-full bg-blue-100 rounded-full h-2 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="mb-6">
              {/* Personal Information Step */}
              {currentStep === 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="w-4 h-4 inline mr-2" />
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Upload Step */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : uploadedFile
                        ? 'border-green-500 bg-green-50'
                        : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {!uploadedFile ? (
                      <>
                        <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Drag and drop your resume here
                        </h4>
                        <p className="text-gray-500 mb-3">
                          or click to browse files
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Choose File
                        </button>
                        <p className="text-sm text-gray-400 mt-2">
                          Supported formats: PDF, DOC, DOCX (Max 10MB)
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <FileText className="w-10 h-10 text-green-600" />
                        <div className="text-left">
                          <h4 className="text-base font-medium text-gray-900">{uploadedFile.name}</h4>
                          <p className="text-gray-500 text-sm">{uploadedFile.size}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm">Why upload your resume?</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• AI-powered matching with relevant internships</li>
                      <li>• Personalized job recommendations</li>
                      <li>• Faster application process</li>
                      <li>• Resume optimization suggestions</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Education Details Step */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <GraduationCap className="w-4 h-4 inline mr-2" />
                      University/College
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Course/Branch
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select your course/branch</option>
                      <option value="computer-science">Computer Science & Engineering</option>
                      <option value="information-technology">Information Technology</option>
                      <option value="electronics-communication">Electronics & Communication</option>
                      <option value="mechanical">Mechanical Engineering</option>
                      <option value="electrical">Electrical Engineering</option>
                      <option value="civil">Civil Engineering</option>
                      <option value="chemical">Chemical Engineering</option>
                      <option value="bba">Bachelor of Business Administration (BBA)</option>
                      <option value="mba">Master of Business Administration (MBA)</option>
                      <option value="bcom">Bachelor of Commerce (B.Com)</option>
                      <option value="economics">Economics</option>
                      <option value="design">Design (UI/UX/Product)</option>
                      <option value="psychology">Psychology</option>
                      <option value="management">Management Studies</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="data-science">Data Science/Analytics</option>
                      <option value="biotechnology">Biotechnology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Graduation Year
                    </label>
                    <select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select graduation year</option>
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="no-experience">No prior PM experience</option>
                      <option value="some-experience">Some PM-related experience</option>
                      <option value="internship">Previous PM internship</option>
                      <option value="entry-level">Entry-level PM experience</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Internship Preferences Step - NOW STEP 3 AND REQUIRED */}
              {currentStep === 3 && (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {/* Required Notice */}
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-lg">
                    <div className="flex">
                      <Sparkles className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900 text-sm">Required Information</h4>
                        <p className="text-xs text-orange-800 mt-1">
                          These preferences help us match you with the most relevant internship opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Skills & Competencies <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Add Skill Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleSkillInputKeyPress}
                        placeholder="Add a skill (e.g., Product Strategy)"
                        className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => addSkill(skillInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Current Skills */}
                    {formData.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-blue-600 hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill Suggestions */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Popular PM Skills:</p>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        {skillSuggestions
                          .filter(skill => !formData.skills.includes(skill))
                          .map((skill, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addSkill(skill)}
                              className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-blue-100 hover:text-blue-800 transition-colors"
                            >
                              {skill}
                              <Plus className="w-2 h-2 ml-1" />
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Internship Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Internship Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="internshipDuration"
                      value={formData.internshipDuration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select duration</option>
                      <option value="3-months">3 months</option>
                      <option value="6-months">6 months</option>
                      <option value="12-months">12 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  {/* Preferred Cities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Preferred Cities <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Add City Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyPress={handleCityInputKeyPress}
                        placeholder="Add a city or 'Remote'"
                        className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => addCity(cityInput)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Current Cities */}
                    {formData.preferredCities.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {formData.preferredCities.map((city, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {city}
                              <button
                                type="button"
                                onClick={() => removeCity(city)}
                                className="ml-2 text-green-600 hover:text-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* City Suggestions */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Popular Cities:</p>
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                        {popularCities
                          .filter(city => !formData.preferredCities.includes(city))
                          .map((city, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addCity(city)}
                              className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-green-100 hover:text-green-800 transition-colors"
                            >
                              {city}
                              <Plus className="w-2 h-2 ml-1" />
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Work Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Building className="w-4 h-4 inline mr-2" />
                      Work Preference <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="workPreference"
                      value={formData.workPreference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select work preference</option>
                      <option value="remote">Remote Only</option>
                      <option value="onsite">On-site Only</option>
                      <option value="hybrid">Hybrid (Remote + On-site)</option>
                      <option value="flexible">Flexible/Open to All</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Availability <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="">When can you start?</option>
                      <option value="immediately">Immediately</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-months">Within 2 months</option>
                      <option value="3-months">Within 3 months</option>
                      <option value="flexible">Flexible timing</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 mb-1 text-sm">
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      Perfect Match Ahead!
                    </h4>
                    <p className="text-xs text-blue-800">
                      {formData.skills.length > 0 || formData.preferredCities.length > 0 || formData.internshipDuration || formData.workPreference || formData.availability
                        ? `Great! Your preferences help us find ${
                            formData.workPreference === 'remote' ? 'remote' : 
                            formData.workPreference === 'onsite' ? 'on-site' : 
                            formData.workPreference === 'hybrid' ? 'hybrid' : ''
                          } internships ${formData.preferredCities.length > 0 ? `in ${formData.preferredCities.join(', ')}` : ''} that match your ${formData.skills.length} skill${formData.skills.length !== 1 ? 's' : ''}.`
                        : 'Complete all fields to help us find the perfect internship matches for you!'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Information Step - NOW STEP 4 AND OPTIONAL */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        type="url"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio/Website (Optional)
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-blue-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-medium text-green-900 mb-1 text-sm">Almost Done!</h4>
                    <p className="text-xs text-green-800">
                      These links are optional but help recruiters learn more about your background and projects.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm'
                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 transform hover:scale-105 active:scale-95 hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`flex items-center bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}