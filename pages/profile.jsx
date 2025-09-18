import React, { useState, useRef, useEffect } from 'react';
import { User, Star, Briefcase, GraduationCap, Target, Award, Plus, X, Trash2 } from 'lucide-react';

// Move component definitions outside to prevent re-renders
const ProfileHeader = ({ formData, isEditing, handleSave, handleCancel, setIsEditing, getInitials }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(formData.firstName, formData.lastName)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-gray-600 mb-1">{formData.email}</p>
          <p className="text-gray-500">{formData.location}</p>
        </div>
      </div>
      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </div>
);

const PersonalInfoSection = ({ formData, isEditing, handleInputChange, inputRef }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h2 className="text-xl font-medium text-gray-900 mb-6">Personal Information</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900">{formData.firstName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900">{formData.lastName}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div className="flex items-center space-x-2">
          <p className="text-gray-900">{formData.email}</p>
          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Verified</div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        {isEditing ? (
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+91 98765 43210"
          />
        ) : (
          <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, State"
          />
        ) : (
          <p className="text-gray-900">{formData.location || 'Not provided'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
        {isEditing ? (
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900">{formData.dateOfBirth || 'Not provided'}</p>
        )}
      </div>
    </div>
    
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
      {isEditing ? (
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      ) : (
        <p className="text-gray-900">{formData.bio || 'No bio provided yet'}</p>
      )}
    </div>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
        {isEditing ? (
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/username"
          />
        ) : (
          <p className="text-gray-900">{formData.linkedinUrl || 'Not provided'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
        {isEditing ? (
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username"
          />
        ) : (
          <p className="text-gray-900">{formData.githubUrl || 'Not provided'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
        {isEditing ? (
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourportfolio.com"
          />
        ) : (
          <p className="text-gray-900">{formData.portfolioUrl || 'Not provided'}</p>
        )}
      </div>
    </div>
  </div>
);

const SkillsSection = ({ formData, isEditing, newSkill, setNewSkill, addSkill, removeSkill }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-medium text-gray-900">Skills</h2>
      {isEditing && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <button
            onClick={addSkill}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
    
    <div className="flex flex-wrap gap-3">
      {formData.skills.map((skill, index) => (
        <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
          <span className="font-medium">{skill}</span>
          {isEditing && (
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ExperienceSection = ({ formData, isEditing }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-medium text-gray-900">Experience</h2>
      {isEditing && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      )}
    </div>
    
    <div className="space-y-6">
      {formData.experience.map((exp, index) => (
        <div key={index} className="border-l-4 border-blue-600 pl-6 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{exp.title}</h3>
              <p className="text-blue-600 mb-2">{exp.company}</p>
              <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
            {isEditing && (
              <button className="text-red-500 hover:text-red-700 ml-4">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EducationSection = ({ formData, isEditing, addEducation, updateEducation, removeEducation }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-medium text-gray-900">Education</h2>
      {isEditing && (
        <button 
          onClick={addEducation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      )}
    </div>
    
    <div className="space-y-6">
      {formData.education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education entries yet</p>
          {isEditing && (
            <p className="text-sm">Click "Add Education" to get started</p>
          )}
        </div>
      )}
      
      {formData.education.map((edu, index) => (
        <div key={index} className="border-l-4 border-green-500 pl-6 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Bachelor of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2022 - 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="8.5/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={edu.description || ''}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Relevant coursework, achievements, etc."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-green-600 mb-2">{edu.institution}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>{edu.year}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm">{edu.description}</p>
                  )}
                </div>
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PreferencesSection = ({ formData, isEditing, handleInputChange }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h2 className="text-xl font-medium text-gray-900 mb-6">Internship Preferences</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
        {isEditing ? (
          <select
            value={formData.preferences.jobType}
            onChange={(e) => handleInputChange('preferences', {...formData.preferences, jobType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        ) : (
          <p className="text-gray-900">{formData.preferences.jobType || 'Not specified'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        {isEditing ? (
          <select
            value={formData.preferences.duration}
            onChange={(e) => handleInputChange('preferences', {...formData.preferences, duration: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select duration</option>
            <option value="1-3 months">1-3 months</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6+ months">6+ months</option>
          </select>
        ) : (
          <p className="text-gray-900">{formData.preferences.duration || 'Not specified'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Stipend</label>
        {isEditing ? (
          <input
            type="text"
            value={formData.preferences.expectedStipend}
            onChange={(e) => handleInputChange('preferences', {...formData.preferences, expectedStipend: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="₹40,000 - ₹60,000"
          />
        ) : (
          <p className="text-gray-900">{formData.preferences.expectedStipend || 'Not specified'}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
        <div className="flex flex-wrap gap-2">
          {formData.preferences.preferredLocations.map((location, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {location}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const NavigationTabs = ({ activeSection, setActiveSection }) => {
  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'skills', name: 'Skills', icon: Star },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'preferences', name: 'Preferences', icon: Target }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors min-w-0 flex-shrink-0 ${
              activeSection === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    skills: user?.skills || ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB'],
    experience: user?.experience || [
      {
        title: 'Software Development Intern',
        company: 'TechCorp',
        duration: 'Jun 2024 - Aug 2024',
        description: 'Developed web applications using React and Node.js'
      }
    ],
    education: user?.education || [],
    preferences: user?.preferences || {
      jobType: 'Full-time',
      preferredLocations: ['Remote', 'Bangalore', 'Mumbai'],
      expectedStipend: '₹40,000 - ₹60,000',
      duration: '3-6 months'
    }
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      dateOfBirth: user?.dateOfBirth || '',
      linkedinUrl: user?.linkedinUrl || '',
      githubUrl: user?.githubUrl || '',
      portfolioUrl: user?.portfolioUrl || '',
      skills: user?.skills || ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB'],
      experience: user?.experience || [],
      education: user?.education || [],
      preferences: user?.preferences || {
        jobType: 'Full-time',
        preferredLocations: ['Remote', 'Bangalore', 'Mumbai'],
        expectedStipend: '₹40,000 - ₹60,000',
        duration: '3-6 months'
      }
    });
    setIsEditing(false);
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        year: '',
        gpa: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || 'U';
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection 
          formData={formData} 
          isEditing={isEditing} 
          handleInputChange={handleInputChange} 
          inputRef={inputRef}
        />;
      case 'skills':
        return <SkillsSection 
          formData={formData} 
          isEditing={isEditing} 
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />;
      case 'experience':
        return <ExperienceSection 
          formData={formData} 
          isEditing={isEditing} 
        />;
      case 'education':
        return <EducationSection 
          formData={formData} 
          isEditing={isEditing}
          addEducation={addEducation}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
        />;
      case 'preferences':
        return <PreferencesSection 
          formData={formData} 
          isEditing={isEditing} 
          handleInputChange={handleInputChange}
        />;
      default:
        return <PersonalInfoSection 
          formData={formData} 
          isEditing={isEditing} 
          handleInputChange={handleInputChange} 
          inputRef={inputRef}
        />;
    }
  };

 return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader 
        formData={formData}
        isEditing={isEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
        setIsEditing={setIsEditing}
        getInitials={getInitials}
      />
      <NavigationTabs 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderActiveSection()}
      
      {/* Profile Completion Tips */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-900 mb-2">Complete your profile to get better matches!</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add a professional bio to showcase your personality</li>
              <li>• Include your portfolio or GitHub links</li>
              <li>• Specify your internship preferences for better recommendations</li>
              <li>• Add relevant skills and experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;