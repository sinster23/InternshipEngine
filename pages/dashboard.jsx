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
  LogOut
} from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../src/firebase"; // adjust path if needed
import { doc, getDoc } from "firebase/firestore";
import ProfilePage from './profile';

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
      <h2 className="text-xl font-medium text-gray-900 mb-6">Get started with InternMatch</h2>
      
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
const RecommendedInternships = () => {
  const internships = [
    {
      id: 1,
      company: "Google",
      logo: "G",
      role: "Product Management Intern",
      stipend: "₹50,000/month",
      duration: "3 months",
      location: "Remote",
      matchScore: 95,
      tags: ["Tech", "Remote", "Full-time"]
    },
    {
      id: 2,
      company: "Microsoft", 
      logo: "M",
      role: "PM Intern - Azure",
      stipend: "₹45,000/month",
      duration: "6 months",
      location: "Bangalore",
      matchScore: 87,
      tags: ["Tech", "Onsite", "Full-time"]
    },
    {
      id: 3,
      company: "Zomato",
      logo: "Z", 
      role: "Associate PM Intern",
      stipend: "₹35,000/month",
      duration: "4 months",
      location: "Gurgaon",
      matchScore: 82,
      tags: ["Food Tech", "Onsite", "Part-time"]
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-900">Recommended Internships</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View all internships →
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div key={internship.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                  {internship.logo}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{internship.company}</h3>
                  <div className="flex items-center text-blue-600 text-sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {internship.matchScore}% match
                  </div>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-3">{internship.role}</h4>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                {internship.stipend}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {internship.duration}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {internship.location}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {internship.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
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
        <h1 className="text-xl font-medium text-blue-600">InternMatch</h1>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading InternMatch...</h3>
        <p className="text-gray-600">Please wait while we load your dashboard</p>
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
 


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      
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
                    <RecommendedInternships />
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
            
            {activeTab !== 'dashboard' && activeTab !== 'profile' && (
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