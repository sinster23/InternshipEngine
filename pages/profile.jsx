import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Upload,
  Camera,
  ExternalLink,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Target,
  FileText,
  Link,
  Star,
  CheckCircle,
  Loader
} from 'lucide-react';

// Import Firebase functions - Replace with your actual Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from "../src/firebase"; 

const ProfilePage = ({ userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Separate state for original data to handle cancellation
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    dateOfBirth: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    experience: [],
    education: [],
    preferences: {
      jobType: '',
      preferredLocations: [],
      expectedStipend: '',
      duration: ''
    },
    profileCompleteness: 0
  });

  // Load profile data from Firebase on component mount
  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const getCurrentUserId = () => {
    return userId || auth.currentUser?.uid;
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUserId = getCurrentUserId();
      
      if (!currentUserId) {
        throw new Error('No authenticated user found');
      }

      // Fetch user profile from Firestore
      const docRef = doc(db, 'users', currentUserId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('User data:', userData);
        const completeData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || auth.currentUser?.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          dateOfBirth: userData.dateOfBirth || '',
          linkedinUrl: userData.linkedinUrl || '',
          githubUrl: userData.githubUrl || '',
          portfolioUrl: userData.portfolioUrl || '',
          skills: userData.skills || [],
          experience: userData.experience || [],
          education: userData.education || [],
          preferences: {
            jobType: userData.workPreference || '',
            preferredLocations: userData.preferredCities || [],
            expectedStipend: userData.expectedStipend || '',
            duration: userData.internshipDuration || ''
          },
          profileCompleteness: userData.profileCompleteness || 0
        };
        
        setFormData(completeData);
        setOriginalData(completeData);
      } else {
        // Create default profile structure for new users
        const defaultData = {
          firstName: '',
          lastName: '',
          email: auth.currentUser?.email || '',
          phone: '',
          location: '',
          bio: '',
          dateOfBirth: '',
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          skills: [],
          experience: [],
          education: [],
          preferences: {
            jobType: '',
            preferredLocations: [],
            expectedStipend: '',
            duration: ''
          },
          profileCompleteness: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(docRef, defaultData);
        setFormData(defaultData);
        setOriginalData(defaultData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple input change handler without recalculating completeness
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedInputChange = useCallback((parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      const currentUserId = getCurrentUserId();
      
      if (!currentUserId) {
        throw new Error('No authenticated user found');
      }

      // Calculate completeness only when saving
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      // Save to Firebase
      const docRef = doc(db, 'users', currentUserId);
      await updateDoc(docRef, dataToSave);
      
      // Update both formData and original data to new saved state
      setFormData(dataToSave);
      setOriginalData(dataToSave);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restore original data
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setError(null);
  };

  const addSkill = useCallback(() => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  }, [newSkill, formData.skills]);

  const removeSkill = useCallback((skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);

  const addExperience = useCallback(() => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      duration: '',
      description: ''
    };
    
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      year: '',
      gpa: ''
    };
    
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  }, []);

  const updateEducation = useCallback((id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, []);

  const addPreferredLocation = useCallback((location) => {
    if (location.trim() && !formData.preferences.preferredLocations.includes(location.trim())) {
      handleNestedInputChange('preferences', 'preferredLocations', [
        ...formData.preferences.preferredLocations,
        location.trim()
      ]);
    }
  }, [formData.preferences.preferredLocations, handleNestedInputChange]);

  const removePreferredLocation = useCallback((location) => {
    handleNestedInputChange('preferences', 'preferredLocations',
      formData.preferences.preferredLocations.filter(loc => loc !== location)
    );
  }, [formData.preferences.preferredLocations, handleNestedInputChange]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const ProfileHeader = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
              {getInitials(`${formData.firstName} ${formData.lastName}`)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-light text-gray-900">
                {formData.firstName} {formData.lastName}
              </h1>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span className="text-sm">{formData.email}</span>
              </div>
              {formData.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formData.location}</span>
                </div>
              )}
            </div>
            
            {formData.bio && (
              <p className="text-gray-600 mb-4 max-w-2xl">{formData.bio}</p>
            )}
            
            <div className="flex items-center space-x-4">
              {formData.linkedinUrl && (
                <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {formData.githubUrl && (
                <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {formData.portfolioUrl && (
                <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const PersonalInfoSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          ) : (
            <p className="text-gray-900">{formData.firstName || 'Not provided'}</p>
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
              placeholder="Enter your last name"
            />
          ) : (
            <p className="text-gray-900">{formData.lastName || 'Not provided'}</p>
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

  const SkillsSection = () => (
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
        {formData.skills.length === 0 && (
          <p className="text-gray-500">No skills added yet. Click "Edit Profile" to add some skills.</p>
        )}
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Experience</h2>
        {isEditing && (
          <button 
            onClick={addExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {formData.experience.map((exp) => (
          <div key={exp.id} className="border-l-4 border-blue-600 pl-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-600"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g., Jun 2024 - Aug 2024)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Description of your role and achievements"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-blue-600 mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                    <p className="text-gray-700">{exp.description}</p>
                  </>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {formData.experience.length === 0 && (
          <p className="text-gray-500">No experience added yet. Click "Edit Profile" to add your work experience.</p>
        )}
      </div>
    </div>
  );

  const EducationSection = () => (
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
        {formData.education.map((edu) => (
          <div key={edu.id} className="border-l-4 border-green-500 pl-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Degree/Course Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Institution Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-green-600"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        placeholder="Year (e.g., 2022 - 2026)"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
                      />
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="GPA/Percentage (optional)"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-600"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600 mb-2">{edu.institution}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{edu.year}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {formData.education.length === 0 && (
          <p className="text-gray-500">No education added yet. Click "Edit Profile" to add your educational background.</p>
        )}
      </div>
    </div>
  );

  const PreferencesSection = () => {
    const addLocation = () => {
      if (newLocation.trim()) {
        addPreferredLocation(newLocation);
        setNewLocation('');
      }
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Internship Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            {isEditing ? (
              <select
                value={formData.preferences.jobType}
                onChange={(e) => handleNestedInputChange('preferences', 'jobType', e.target.value)}
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
                onChange={(e) => handleNestedInputChange('preferences', 'duration', e.target.value)}
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Stipend</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.preferences.expectedStipend}
                onChange={(e) => handleNestedInputChange('preferences', 'expectedStipend', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="₹40,000 - ₹60,000"
              />
            ) : (
              <p className="text-gray-900">{formData.preferences.expectedStipend || 'Not specified'}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
            {isEditing && (
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add a location"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                />
                <button
                  onClick={addLocation}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.preferences.preferredLocations.map((location, index) => (
                <div key={index} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  <span>{location}</span>
                  {isEditing && (
                    <button
                      onClick={() => removePreferredLocation(location)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {formData.preferences.preferredLocations.length === 0 && (
                <p className="text-gray-500">No preferred locations added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NavigationTabs = () => {
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection />;
      case 'skills':
        return <SkillsSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'preferences':
        return <PreferencesSection />;
      default:
        return <PersonalInfoSection />;
    }
  };

  const getCompletionTips = () => {
    const tips = [];
    
    if (!formData.firstName || !formData.lastName) {
      tips.push('Add your full name to make your profile more professional');
    }
    if (!formData.bio) {
      tips.push('Add a professional bio to showcase your personality and goals');
    }
    if (!formData.linkedinUrl && !formData.githubUrl && !formData.portfolioUrl) {
      tips.push('Include your LinkedIn, GitHub, or portfolio links');
    }
    if (formData.skills.length === 0) {
      tips.push('Add relevant skills to highlight your expertise');
    }
    if (formData.experience.length === 0) {
      tips.push('Add your work experience or projects');
    }
    if (formData.education.length === 0) {
      tips.push('Include your educational background');
    }
    if (!formData.preferences.jobType || !formData.preferences.duration) {
      tips.push('Specify your internship preferences for better matches');
    }
    
    return tips.slice(0, 4); // Show max 4 tips
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader />
      <NavigationTabs />
      {renderActiveSection()}
      
      {/* Profile Completion Tips */}
      {getCompletionTips().length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">
                Complete your profile to get better matches! 
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {getCompletionTips().map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
};

export default ProfilePage;