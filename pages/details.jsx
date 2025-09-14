import React, { useState } from 'react';
import { User, BookOpen, GraduationCap, Code, MapPin, Clock, Plus, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

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

  const closeModal = () => {
    setIsModalOpen(false);
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Modal Area */}
      <div className="w-2/3 flex items-center justify-center p-8 relative">
        {!isModalOpen ? (
          /* Initial State - Start Button */
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
              Complete Your Profile
            </h1>
            <p className="text-xl font-semibold text-blue-700 mb-8">
              Tell us about yourself to find the perfect internship match
            </p>
            <button
              onClick={openModal}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-200"
            >
              Get Started
            </button>
          </div>
        ) : (
          /* Modal Content */
          <div className="bg-white border-2 border-blue-100 rounded-lg shadow-2xl w-full max-w-md">
            {/* Progress Bar */}
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={closeModal}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
              {/* Step Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  {currentStepData.title}
                </h2>
                <p className="text-blue-700 text-sm">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Form Input */}
              <div className="mb-6">
                {currentStepData.type === 'select' && (
                  <div className="relative">
                    <select
                      value={formData[currentStepData.field]}
                      onChange={(e) => updateFormData(currentStepData.field, e.target.value)}
                      className="w-full px-4 py-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-blue-800 bg-white appearance-none cursor-pointer text-sm font-medium shadow-sm hover:border-blue-300 transition-all duration-200"
                    >
                      <option value="" disabled className="text-blue-400">
                        Choose an option...
                      </option>
                      {currentStepData.options.map((option) => (
                        <option key={option} value={option} className="text-blue-800 py-2">
                          {option}
                        </option>
                      ))}
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {currentStepData.type === 'input' && (
                  <input
                    type="text"
                    value={formData[currentStepData.field]}
                    onChange={(e) => updateFormData(currentStepData.field, e.target.value)}
                    placeholder={currentStepData.placeholder}
                    className="w-full px-4 py-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-blue-800"
                  />
                )}

                {currentStepData.type === 'skills' && (
                  <div>
                    {/* Add Skill Input */}
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a skill (e.g., JavaScript, Communication)"
                        className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-blue-800"
                      />
                      <button
                        onClick={addSkill}
                        className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Skills Display */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
                        >
                          <span className="text-blue-800 text-sm font-medium">{skill}</span>
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-blue-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {formData.skills.length === 0 && (
                      <p className="text-blue-500 text-sm text-center py-4">
                        No skills added yet. Add at least one skill to continue.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition duration-200 ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                >
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                  {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Progress Tree */}
      <div className="w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">
              Your Progress
            </h2>
            <p className="text-blue-700">
              Complete all steps to build your profile
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
                <div key={index} className="flex items-center space-x-4 relative">
                  {/* Step Indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-600 text-white animate-pulse' 
                        : isPast 
                          ? 'bg-blue-200 text-blue-600' 
                          : 'bg-white border-2 border-blue-200 text-blue-400'
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
                      className={`absolute left-5 top-10 w-0.5 h-8 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-300' : 'bg-blue-200'
                      }`}
                    ></div>
                  )}

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors duration-300 ${
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
                      <p className="text-sm text-blue-600 mt-1">
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </p>
                    )}
                    {isCompleted && formData[step.field] && step.field !== 'skills' && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        {formData[step.field]}
                      </p>
                    )}
                    {isCompleted && step.field === 'skills' && formData.skills.length > 0 && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        {formData.skills.length} skill{formData.skills.length > 1 ? 's' : ''} added
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Status */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {steps.filter((_, index) => isStepCompleted(index)).length} / {steps.length}
              </div>
              <p className="text-sm text-blue-700">Steps Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}