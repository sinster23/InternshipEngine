import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookmarkCheck, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  ChevronRight, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  Building2,
  Target,
  Users,
  Calendar,
  Filter,
  Home,
  Briefcase,
  ChevronLeft,
  ChevronDown,
  Plus,
  LogOut,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../src/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";
import ProfilePage from './profile';
import InternshipPage from './internship';

// Hero Section Component
const HeroSection = ({ user }) => {
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[today.getMonth()] + " " + today.getFullYear();
  
  const getUserName = () => {
    if (user?.firstName) {
      return user.firstName; 
    }
    return "User";
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Hello, {getUserName()}!
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your internship dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Apply to Internship
          </button>
        </div>
      </div>
    </div>
  );
};

// Calendar Widget Component
const CalendarWidget = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-medium text-gray-900">{monthNames[currentMonth]} {currentYear}</h3>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 text-sm cursor-pointer hover:bg-gray-50 rounded ${
              day === currentDate 
                ? 'bg-blue-600 text-white rounded-full font-medium' 
                : day 
                  ? 'text-gray-700' 
                  : 'text-gray-300'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

// Getting Started Section Component
const GettingStartedSection = () => {
  const steps = [
    {
      number: "1",
      title: "Complete your profile",
      description: "Add your skills, experience, and preferences to get better internship matches.",
      action: "Complete your profile",
      completed: false,
      color: "blue"
    },
    {
      number: "2", 
      title: "Add your preferences",
      description: "Tell us what kind of internships you're looking for to get personalized recommendations.",
      action: "Set preferences",
      completed: false,
      color: "blue"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Get started with InternSathi</h2>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 bg-${step.color}-100 rounded-lg flex items-center justify-center relative`}>
                <span className={`text-2xl font-light text-${step.color}-600`}>{step.number}</span>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{step.description}</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                {step.action}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recommended Internships Component
const RecommendedInternships = ({ user, profile }) => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState('');
  const [predictedCategory, setPredictedCategory] = useState('');

  // Function to get company logo initial
  const getCompanyInitial = (companyName) => {
    return companyName.charAt(0).toUpperCase();
  };

  // Function to format duration
  const formatDuration = (months) => {
    if (months === 1) return '1 month';
    return `${months} months`;
  };

  // Function to generate tags based on skills and category
  const generateTags = (skills, category, location) => {
    const tags = [];
    
    // Add category tag
    if (category) {
      tags.push(category.charAt(0).toUpperCase() + category.slice(1));
    }
    
    // Add location type tag
    if (location.toLowerCase().includes('remote')) {
      tags.push('Remote');
    } else {
      tags.push('Onsite');
    }
    
    // Add a skill-based tag if available
    if (skills) {
      const skillList = skills.split(' ');
      if (skillList.length > 0) {
        tags.push(skillList[0]);
      }
    }
    
    return tags.slice(0, 3); // Limit to 3 tags
  };

  // Helper function to convert array to string
  const arrayToString = (value) => {
    if (Array.isArray(value)) {
      return value.join(' ');
    }
    return value || '';
  };

  // Fetch recommendations from backend
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare payload from user profile - ensure strings not arrays
      const payload = {
        education: arrayToString(profile?.education) || "Computer Science Bachelor",
        skills: arrayToString(profile?.skills) || "Python React JavaScript Machine Learning",
        top_n: 3
      };

      console.log("Sending payload to backend:", payload); // Debug log

      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setInternships(data.data.recommendations);
        setConfidence(data.data.confidence);
        setPredictedCategory(data.data.predicted_category);
      } else {
        setError(data.message || "Failed to fetch recommendations");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      if (err.message.includes('HTTP error')) {
        setError(`Server error: ${err.message}`);
      } else {
        setError("Unable to connect to recommendation service");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations on component mount
  useEffect(() => {
    if (user && profile) {
      fetchRecommendations();
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900">Recommended Internships</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-900">Recommended Internships</h2>
          <button 
            onClick={fetchRecommendations}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center text-center">
            <div>
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Unable to load recommendations</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button 
                onClick={fetchRecommendations}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900">Recommended Internships</h2>
          {confidence && predictedCategory && (
            <p className="text-sm text-gray-600 mt-1">
              Predicted category: <span className="font-medium">{predictedCategory}</span> 
              {" "}(Confidence: {confidence})
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchRecommendations}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all internships →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                  {getCompanyInitial(internship.company_name)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{internship.company_name}</h3>
                  <div className="flex items-center text-blue-600 text-sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {internship.match_percentage} match
                  </div>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-3">{internship.internship_title}</h4>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                ₹{internship.stipend_inr.toLocaleString()}/month
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {formatDuration(internship.duration_months)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {internship.location}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
              <p className="text-sm text-gray-700">{internship.skills_requirement}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {generateTags(internship.skills_requirement, predictedCategory, internship.location).map((tag, tagIndex) => (
                <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                Apply Now
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <BookmarkCheck className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bottom Section Component  
const BottomSection = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">Build your network to get better opportunities</h3>
          <p className="text-gray-600 text-sm mb-4">
            Connect with professionals, join internship communities, and get referrals to increase your chances of landing your dream internship.
          </p>
          <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium">
            Join Network
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-medium text-gray-900 mb-4">Your application stats</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Applications</span>
            <span className="text-gray-900 font-medium">12 out of 50 until 17/09/2025</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Profile completeness</span>
            <span className="text-gray-900 font-medium">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
      
      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
        Manage your applications →
      </button>
    </div>
  );
};

// User Profile Section
const UserProfileSection = ({ user, signOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 rounded-lg hover:bg-gray-50 transition-colors w-full"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
          {getInitials(user.displayName)}
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900 text-sm">{user.displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>
      
      {showDropdown && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
          <button 
            onClick={signOut}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user, signOut }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'internships', name: 'Internships', icon: Briefcase },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'applications', name: 'Applications', icon: BookmarkCheck },
    { id: 'network', name: 'Network', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-medium text-blue-600">InternSathi</h1>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg mb-1 transition-colors text-sm ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <UserProfileSection user={user} signOut={signOut} />
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Loading InternSathi...</h3>
        <p className="text-gray-300">Please wait while we load your dashboard</p>
      </div>
    </div>
  );
};

// Main Dashboard Component
const InternshipDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);

        // Fetch extra profile details from Firestore if you have them
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
        }
      } else {
        // No user -> redirect to signin
        window.location.href = "/signin";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    if (loading) {
    return <LoadingScreen />;
  }
 
  const signOut = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} signOut={signOut} />
      
      <div className="flex-1 ml-64">
        <div className="h-screen overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <>
                <HeroSection user={profile} />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-3 space-y-8">
                    <GettingStartedSection />
                    <RecommendedInternships user={user} profile={profile} />
                    <BottomSection />
                  </div>
                  
                  {/* Right Column - Sidebar Content */}
                  <div className="space-y-6">
                    <CalendarWidget />
                    <StatsCard />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'profile' && (
              <ProfilePage user={profile} />
            )}

            {activeTab === 'internships' && (
              <InternshipPage />
            )}
            
            {activeTab !== 'dashboard' && activeTab !== 'profile' && activeTab !== 'internships' && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className="text-gray-600">This section is under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDashboard;