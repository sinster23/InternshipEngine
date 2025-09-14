import React, { useState } from 'react';
import { User, BookOpen, GraduationCap, Code, MapPin, Clock, Plus, X, ChevronRight, ChevronLeft, Check, Star, Sparkles } from 'lucide-react';

export default function StudentDetailsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    educationLevel: '',
    branch: '',
    yearExperience: '',
    skills: [],
    locationPreference: '',
    preferredCity: '',
    availability: '',
    duration: ''
  });
  
  const [newSkill, setNewSkill] = useState('');

  const steps = [
    {
      title: 'Education Level',
      subtitle: 'What is your current education level?',
      icon: GraduationCap,
      field: 'educationLevel',
      type: 'select',
      options: [
        'B.Tech', 'B.E', 'BCA', 'MBA', 'MCA', 'M.Tech', 
        'Diploma', 'B.Com', 'BBA', 'Other'
      ]
    },
    {
      title: 'Branch/Field of Study',
      subtitle: 'What is your area of specialization?',
      icon: BookOpen,
      field: 'branch',
      type: 'select',
      options: [
        'Computer Science', 'Information Technology', 'Mechanical Engineering',
        'Electrical Engineering', 'Civil Engineering', 'Electronics & Communication',
        'Marketing', 'Finance', 'Human Resources', 'Data Science', 'Other'
      ]
    },
    {
      title: 'Year/Experience Level',
      subtitle: 'What is your current academic year or experience level?',
      icon: Clock,
      field: 'yearExperience',
      type: 'select',
      options: [
        '1st Year', '2nd Year', '3rd Year', 'Final Year',
        'Fresher', '0-1 years experience', '1-2 years experience', '2+ years experience'
      ]
    },
    {
      title: 'Skills & Technologies',
      subtitle: 'Add your technical and soft skills',
      icon: Code,
      field: 'skills',
      type: 'skills'
    },
    {
      title: 'Work Preference',
      subtitle: 'How do you prefer to work?',
      icon: MapPin,
      field: 'locationPreference',
      type: 'select',
      options: ['Remote', 'Hybrid', 'In-Office', 'Flexible']
    },
    {
      title: 'Preferred City',
      subtitle: 'Which city would you like to work in? (Optional)',
      icon: MapPin,
      field: 'preferredCity',
      type: 'input',
      placeholder: 'e.g., Mumbai, Delhi, Bangalore'
    },
    {
      title: 'Availability',
      subtitle: 'What is your availability?',
      icon: Clock,
      field: 'availability',
      type: 'select',
      options: ['Full-time', 'Part-time', 'Flexible']
    },
    {
      title: 'Duration',
      subtitle: 'How long can you commit to an internship?',
      icon: Clock,
      field: 'duration',
      type: 'select',
      options: ['1 month', '2 months', '3 months', '6 months', '12 months', 'Flexible']
    }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      updateFormData('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(skill => skill !== skillToRemove);
    updateFormData('skills', updatedSkills);
  };

  const isStepCompleted = (stepIndex) => {
    const field = steps[stepIndex].field;
    if (field === 'skills') {
      return formData.skills.length > 0;
    }
    if (field === 'preferredCity') {
      return true; // Optional field
    }
    return formData[field] !== '';
  };

  const handleNext = () => {
    const currentField = steps[currentStep].field;
    const currentValue = formData[currentField];
    
    // Validation
    if (steps[currentStep].type === 'skills') {
      if (formData.skills.length === 0) {
        alert('Please add at least one skill before proceeding.');
        return;
      }
    } else if (steps[currentStep].field !== 'preferredCity' && !currentValue) {
      alert('Please make a selection before proceeding.');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      console.log('Student details completed:', formData);
      setIsModalOpen(false);
      alert('Profile completed successfully!');
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentStep === 3) { // Skills step
      e.preventDefault();
      addSkill();
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon;
  const completedSteps = steps.filter((_, index) => isStepCompleted(index)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex relative overflow-hidden">
      {/* Left Side - Modal Area */}
      <div className="w-3/4 mt-15 p-8 relative z-10">
        {!isModalOpen ? (
          /* Initial State - Start Button */
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-2xl transform rotate-3 animate-pulse">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6 leading-tight">
                Complete Your Profile
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-2xl font-semibold text-blue-700 mb-4 max-w-2xl mx-auto leading-relaxed">
                Tell us about yourself to find the perfect internship match
              </p>
              <p className="text-lg text-blue-600 opacity-80">
                Join thousands of students who have found their dream internships
              </p>
            </div>
            <button
              onClick={openModal}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
            >
              <span className="flex items-center justify-center">
                Get Started
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        ) : (
          /* Step Content - Direct Display */
          <div className="text-center max-w-3xl mx-auto">
            {/* Step Header */}
            <div className="mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{currentStep + 1}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6 leading-tight">
                {currentStepData.title}
              </h1>
              <p className="text-2xl font-medium text-blue-700 mb-4">
                {currentStepData.subtitle}
              </p>
              
              {/* Enhanced Progress Bar */}
              <div className="mb-8 max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-blue-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                  </span>
                </div>
                <div className="relative w-full bg-blue-100 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Input */}
            <div className="mb-12">
              {currentStepData.type === 'select' && (
                <div className="relative max-w-lg mx-auto">
                  <select
                    value={formData[currentStepData.field]}
                    onChange={(e) => updateFormData(currentStepData.field, e.target.value)}
                    className="w-full px-8 py-6 border-3 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-blue-800 bg-white appearance-none cursor-pointer text-lg font-semibold shadow-lg hover:border-blue-300 transition-all duration-300 hover:shadow-xl"
                  >
                    <option value="" disabled className="text-blue-400">
                      Choose an option...
                    </option>
                    {currentStepData.options.map((option) => (
                      <option key={option} value={option} className="text-blue-800 py-3 font-medium">
                        {option}
                      </option>
                    ))}
                  </select>
                  {/* Enhanced Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-6 pointer-events-none">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.type === 'input' && (
                <div className="max-w-lg mx-auto">
                  <input
                    type="text"
                    value={formData[currentStepData.field]}
                    onChange={(e) => updateFormData(currentStepData.field, e.target.value)}
                    placeholder={currentStepData.placeholder}
                    className="w-full px-8 py-6 border-3 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-blue-800 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>
              )}

              {currentStepData.type === 'skills' && (
                <div className="max-w-2xl mx-auto">
                  {/* Add Skill Input */}
                  <div className="flex space-x-4 mb-8">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill (e.g., JavaScript, Communication)"
                      className="flex-1 px-8 py-6 border-3 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-blue-800 text-lg font-semibold shadow-lg"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Skills Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 px-6 py-4 rounded-xl hover:from-blue-100 hover:to-blue-150 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <span className="text-blue-800 text-base font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-2 text-blue-500" />
                          {skill}
                        </span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-blue-400 hover:text-red-500 transition-colors ml-3 p-1 rounded-full hover:bg-red-50"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.skills.length === 0 && (
                    <div className="text-center py-12">
                      <Code className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                      <p className="text-blue-500 text-lg">
                        No skills added yet. Add at least one skill to continue.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-center space-x-6">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm'
                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 transform hover:scale-105 active:scale-95 hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-6 h-6 mr-2" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-6 h-6 mr-2" />
                    Complete Profile
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Right Side - Progress Tree */}
      <div className="w-1/4 bg-gradient-to-br from-blue-100 via-blue-50 to-white p-8 flex items-center justify-center shadow-2xl relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-6 w-16 h-16 bg-blue-300 rounded-full opacity-15"></div>
        
        <div className="w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-blue-900 mb-3">
              Your Progress
            </h2>
            <p className="text-blue-700 text-sm font-medium">
              Complete all steps to build your profile
            </p>
          </div>

          {/* Enhanced Progress Tree */}
          <div className="space-y-4 relative">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = isStepCompleted(index);
              const isCurrent = currentStep === index && isModalOpen;
              const isPast = index < currentStep;
              
              return (
                <div key={index} className="flex items-center space-x-4 relative group">
                  {/* Enhanced Step Indicator */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 flex-shrink-0 shadow-lg ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white transform scale-110 shadow-green-200' 
                      : isCurrent 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white animate-pulse transform scale-110 shadow-blue-200' 
                        : isPast 
                          ? 'bg-gradient-to-r from-blue-200 to-blue-300 text-blue-700 shadow-blue-100' 
                          : 'bg-white border-3 border-blue-200 text-blue-400 shadow-blue-50'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Enhanced Connector Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`absolute left-6 top-12 w-1 h-8 transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-gradient-to-b from-green-400 to-green-300' : 'bg-gradient-to-b from-blue-200 to-blue-150'
                      }`}
                    ></div>
                  )}

                  {/* Enhanced Step Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm transition-colors duration-300 ${
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
                    {(isCurrent || isCompleted) && (
                      <p className={`text-xs mt-1 font-semibold ${
                        isCompleted ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {isCompleted ? 'Completed ✓' : 'In Progress...'}
                      </p>
                    )}
                    {isCompleted && formData[step.field] && step.field !== 'skills' && (
                      <p className="text-xs text-green-600 mt-1 font-medium truncate bg-green-50 px-2 py-1 rounded">
                        {formData[step.field]}
                      </p>
                    )}
                    {isCompleted && step.field === 'skills' && formData.skills.length > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 px-2 py-1 rounded">
                        {formData.skills.length} skill{formData.skills.length > 1 ? 's' : ''} added
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Completion Status */}
          <div className="mt-8 p-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100">
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-2">
                {completedSteps} / {steps.length}
              </div>
              <p className="text-sm text-blue-700 font-semibold">Steps Completed</p>
              <div className="mt-3 w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}