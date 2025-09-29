
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp,
  BookmarkCheck,
  Building2,
  Users,
  Target,
  CheckCircle,
  X,
  Briefcase,
  TrendingUp,
  Heart,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const SuccessModal = ({ isOpen, onClose, internship, setActiveTab }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
     <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative animate-scale-in shadow-2xl">
        {/* Celebration confetti animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-confetti">🎉</div>
          <div className="animate-confetti-delayed">✨</div>
          <div className="animate-confetti-delayed-2">🎊</div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Application Submitted! 🎉
          </h3>
          
          <p className="text-gray-600 mb-6">
            Your application for <span className="font-medium">{internship.role}</span> at{' '}
            <span className="font-medium">{internship.company}</span> has been successfully submitted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('applications')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Applications
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InternshipsPage = ({setActiveTab}) => {
  const [showMore, setShowMore] = useState(false);
  const [filters, setFilters] = useState({
    location: 'all',
    sector: 'all', 
    skills: 'all',
    duration: 'all',
    stipend: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [appliedInternships, setAppliedInternships] = useState({});
  const [applyingInternships, setApplyingInternships] = useState({});
  
  // New states for ML recommendations
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedInternshipDetails, setAppliedInternshipDetails] = useState(null);

  // Sample additional internships for explore more section (keeping static for now)
  const additionalInternships = [
    {
      id: 6,
      company: "Swiggy",
      logo: "S",
      role: "Growth PM Intern",
      stipend: "₹32,000/month",
      duration: "4 months",
      location: "Bangalore",
      matchScore: 72,
      matchType: "Moderate Match",
      tags: ["Growth", "Food Delivery", "Operations"],
      description: "Drive user acquisition and retention strategies for Swiggy platform.",
      sector: "Food Tech",
      remote: false
    },
    {
      id: 7,
      company: "Razorpay", 
      logo: "R",
      role: "Product Intern - Payments",
      stipend: "₹42,000/month",
      duration: "6 months",
      location: "Bangalore", 
      matchScore: 85,
      matchType: "High Match",
      tags: ["Payments", "B2B", "API Products"],
      description: "Build payment infrastructure products used by thousands of businesses.",
      sector: "FinTech", 
      remote: false
    },
    {
      id: 8,
      company: "Ola",
      logo: "O",
      role: "Mobility PM Intern",
      stipend: "₹36,000/month",
      duration: "4 months",
      location: "Bangalore",
      matchScore: 68,
      matchType: "Moderate Match", 
      tags: ["Mobility", "Marketplace", "Consumer"],
      description: "Work on ride-sharing and mobility solutions for urban transportation.",
      sector: "Transportation",
      remote: false
    },
    {
      id: 9,
      company: "CRED",
      logo: "C",
      role: "Consumer PM Intern", 
      stipend: "₹45,000/month",
      duration: "3 months",
      location: "Bangalore",
      matchScore: 81,
      matchType: "Good Match",
      tags: ["Consumer Finance", "Premium", "Rewards"],
      description: "Design premium financial products for India's most creditworthy consumers.",
      sector: "FinTech",
      remote: false
    },
    {
      id: 10,
      company: "Unacademy",
      logo: "U", 
      role: "EdTech PM Intern",
      stipend: "₹30,000/month",
      duration: "5 months",
      location: "Bangalore",
      matchScore: 74,
      matchType: "Good Match",
      tags: ["EdTech", "Learning", "Content"],
      description: "Build learning experiences for millions of students across India.",
      sector: "Education",
      remote: false
    }
  ];

  // Function to handle internship application
  const handleApplyInternship = async (internship) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to apply for internships");
      return;
    }

    try {
      setApplyingInternships(prev => ({...prev, [internship.id]: true}));

      // Check if user has already applied for this internship
      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef, 
        where('userId', '==', user.uid),
        where('internshipId', '==', internship.id)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        alert('You have already applied for this internship!');
        setApplyingInternships(prev => ({...prev, [internship.id]: false}));
        return;
      }

      // Get user data for additional context
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      // Prepare application data
      const applicationData = {
        userId: user.uid,
        userEmail: user.email,
        userName: userData.fullName || user.displayName || 'Unknown',
        userSkills: userData.skills || [],
        userCourse: userData.course || '',
        
        // Internship details
        internshipId: internship.id,
        companyName: internship.company,
        internshipTitle: internship.role,
        stipend: internship.stipend,
        duration: internship.duration,
        location: internship.location,
        sector: internship.sector,
        tags: internship.tags || [],
        description: internship.description,
        matchScore: internship.matchScore || 0,
        matchType: internship.matchType || 'Not specified',
        
        // Application metadata
        appliedAt: serverTimestamp(),
        status: 'applied', // applied, reviewed, shortlisted, rejected, accepted
        source: 'web_app', // where the application came from
        isRecommended: internship.isRecommended || false
      };

      // Add application to Firestore
      await addDoc(collection(db, 'applications'), applicationData);

      // Update local state
      setAppliedInternships(prev => ({...prev, [internship.id]: true}));
      
      // Show success message
      setAppliedInternshipDetails(internship);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error applying for internship:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplyingInternships(prev => ({...prev, [internship.id]: false}));
    }
  };

  // Load user's existing applications on component mount
  const loadUserApplications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const appliedIds = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appliedIds[data.internshipId] = true;
      });
      
      setAppliedInternships(appliedIds);
    } catch (error) {
      console.error('Error loading user applications:', error);
    }
  };

  // Function to get company logo (first letter)
  const getCompanyLogo = (companyName) => {
    return companyName ? companyName.charAt(0).toUpperCase() : 'C';
  };

  // Function to determine match type based on percentage
  const getMatchType = (percentage) => {
    if (percentage >= 85) return 'High Match';
    if (percentage >= 70) return 'Good Match';
    return 'Moderate Match';
  };

  // Function to extract skills tags from requirements
  const extractSkillsTags = (skillsRequirement) => {
    if (!skillsRequirement) return [];
    
    // Split by common separators and clean up
    const skills = skillsRequirement
      .split(/[,;|]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .slice(0, 3); // Limit to 3 tags for UI consistency
    
    return skills;
  };

  // Function to map sector/category
  const mapSector = (category) => {
    const sectorMap = {
      'technology': 'Technology',
      'fintech': 'FinTech',
      'finance': 'FinTech',
      'food': 'Food Tech',
      'ecommerce': 'E-commerce',
      'education': 'Education',
      'healthcare': 'Healthcare',
      'transport': 'Transportation',
      'consulting': 'Consulting'
    };
    
    return sectorMap[category?.toLowerCase()] || 'Other';
  };

  // Function to transform backend data to match UI format
  const transformRecommendationData = (backendData) => {
    return backendData.map((item, index) => ({
      id: `rec_${index + 1}`,
      company: item.company_name,
      logo: getCompanyLogo(item.company_name),
      role: item.internship_title,
      stipend: `₹${item.stipend_inr?.toLocaleString()}/month` || 'Not specified',
      duration: `${item.duration_months} months` || 'Not specified',
      location: item.location || 'Not specified',
      matchScore: Math.round(item.match_percentage) || 0,
      matchType: getMatchType(item.match_percentage),
      tags: extractSkillsTags(item.skills_requirement),
      description: item.description || `Join ${item.company_name} as a ${item.internship_title} and gain valuable industry experience.`,
      requirements: item.skills_requirement ? 
        item.skills_requirement.split(',').map(skill => skill.trim()).slice(0, 3) : 
        ['Relevant skills required', 'Good communication', 'Team player'],
      sector: mapSector(item.category),
      remote: item.location?.toLowerCase().includes('remote') || false,
      featured: item.match_percentage >= 85, // Mark high match as featured
      isRecommended: true
    }));
  };

  // Fetch recommendations from your ML API
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in first");
        setLoading(false);
        return;
      }

      // Fetch user document from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User data not found!");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // Build payload dynamically from Firestore data
      const payload = {
        education: userData.course || "",                  
        skills: (userData.skills || []).join(" "),         
        top_n: 5
      };
      
      const response = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.recommendations) {
        const transformedData = transformRecommendationData(data.data.recommendations);
        setRecommendedInternships(transformedData);
      } else {
        throw new Error(data.message || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations. Please try again.');
      setRecommendedInternships([]);
    } finally {
      setLoading(false);
    }
  };

  // Load recommendations and user applications on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRecommendations(),
        loadUserApplications()
      ]);
    };
    
    loadData();
  }, []);

  const handleFeedback = (internshipId, type) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [internshipId]: type
    }));
  };

  const toggleBookmark = (internshipId) => {
    setBookmarked(prev => ({
      ...prev,
      [internshipId]: !prev[internshipId]
    }));
  };

  const getMatchBadgeColor = (matchType) => {
    switch(matchType) {
      case 'High Match': return 'bg-green-100 text-green-800';
      case 'Good Match': return 'bg-blue-100 text-blue-800'; 
      case 'Moderate Match': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const InternshipCard = ({ internship, isRecommended = false, showFeedback = false }) => {
    const isApplied = appliedInternships[internship.id];
    const isApplying = applyingInternships[internship.id];

    return (
    <> 
      <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all ${
        internship.featured ? 'ring-2 ring-blue-100' : ''
      }`}>
        {internship.featured && (
          <div className="flex items-center mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            <span className="text-xs font-medium text-yellow-700">Featured</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
              {internship.logo}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{internship.company}</h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchBadgeColor(internship.matchType)}`}>
                  ✓ {internship.matchType}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => toggleBookmark(internship.id)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {bookmarked[internship.id] ? (
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            ) : (
              <BookmarkCheck className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-3 text-lg">{internship.role}</h4>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{internship.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            {internship.stipend}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            {internship.duration}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-600" />
            {internship.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-purple-600" />
            {internship.sector}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {internship.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        {internship.requirements && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h5>
            <ul className="space-y-1">
              {internship.requirements.map((req, index) => (
                <li key={index} className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleApplyInternship(internship)}
              disabled={isApplied || isApplying}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center ${
                isApplied 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : isApplying
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Applying...
                </>
              ) : isApplied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Applied
                </>
              ) : (
                <>
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Briefcase className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {showFeedback && !feedbackGiven[internship.id] && (
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-xs text-gray-500">Helpful?</span>
              <button 
                onClick={() => handleFeedback(internship.id, 'up')}
                className="p-1 hover:bg-green-50 rounded transition-colors"
              >
                <ThumbsUp className="w-4 h-4 text-green-600" />
              </button>
              <button 
                onClick={() => handleFeedback(internship.id, 'down')}
                className="p-1 hover:bg-red-50 rounded transition-colors"
              >
                <ThumbsDown className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
          
          {feedbackGiven[internship.id] && (
            <div className="flex items-center ml-4">
              <span className="text-xs text-gray-500">Thanks for feedback!</span>
              {feedbackGiven[internship.id] === 'up' ? (
                <ThumbsUp className="w-4 h-4 text-green-600 ml-1 fill-current" />
              ) : (
                <ThumbsDown className="w-4 h-4 text-red-600 ml-1 fill-current" />
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
      @keyframes scale-in {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes confetti {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) rotate(360deg);
          opacity: 0;
        }
      }

      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }

      .animate-confetti {
        position: absolute;
        top: 50%;
        left: 20%;
        font-size: 2rem;
        animation: confetti 2s ease-out forwards;
      }

      .animate-confetti-delayed {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 2rem;
        animation: confetti 2s ease-out 0.2s forwards;
      }

      .animate-confetti-delayed-2 {
        position: absolute;
        top: 50%;
        right: 20%;
        font-size: 2rem;
        animation: confetti 2s ease-out 0.4s forwards;
      }
    `}</style>
      </>
    );
  };

  const FilterBar = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none text-sm bg-transparent min-w-[200px]"
          />
        </div>
        
        <div className="h-6 border-l border-gray-200"></div>
        
        <select 
          value={filters.location} 
          onChange={(e) => setFilters({...filters, location: e.target.value})}
          className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
        >
          <option value="all">All Locations</option>
          <option value="remote">Remote</option>
          <option value="bangalore">Bangalore</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi NCR</option>
          <option value="pune">Pune</option>
        </select>
        
        <select 
          value={filters.sector} 
          onChange={(e) => setFilters({...filters, sector: e.target.value})}
          className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
        >
          <option value="all">All Sectors</option>
          <option value="technology">Technology</option>
          <option value="fintech">FinTech</option>
          <option value="foodtech">Food Tech</option>
          <option value="ecommerce">E-commerce</option>
          <option value="education">Education</option>
        </select>
        
        <select 
          value={filters.duration} 
          onChange={(e) => setFilters({...filters, duration: e.target.value})}
          className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
        >
          <option value="all">Any Duration</option>
          <option value="1-3">1-3 months</option>
          <option value="3-6">3-6 months</option>
          <option value="6+">6+ months</option>
        </select>
        
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Finding Perfect Matches</h3>
        <p className="text-gray-600">We're analyzing your profile to find the best internship opportunities...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Recommendations</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-600 mb-4">Complete your profile to get personalized internship recommendations.</p>
        <button 
          onClick={fetchRecommendations}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Recommendations
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900">
              Internships for You
            </h1>
            <p className="text-gray-600 mt-1">
              Discover opportunities that match your profile and career goals
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              <span>AI-powered recommendations</span>
            </div>
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-medium text-gray-900">
                Handpicked for You
              </h2>
              <p className="text-gray-600 text-sm">
                AI-powered recommendations based on your profile and preferences
              </p>
            </div>
          </div>
          {!loading && !error && recommendedInternships.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              Updated just now
            </div>
          )}
        </div>

        {loading && <LoadingState />}
        {error && <ErrorState />}
        {!loading && !error && recommendedInternships.length === 0 && (
          <EmptyState />
        )}

        {!loading && !error && recommendedInternships.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedInternships
                .slice(0, showMore ? recommendedInternships.length : 3)
                .map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    isRecommended={true}
                    showFeedback={true}
                  />
                ))}
            </div>

            {recommendedInternships.length > 3 && !showMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMore(true)}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Show More Recommendations ({recommendedInternships.length - 3}{" "}
                  more)
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Explore More Section */}
      {showMore && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900">
                Explore More Opportunities
              </h2>
              <p className="text-gray-600 text-sm">
                Browse additional internships that might interest you
              </p>
            </div>
            <button
              onClick={() => setShowMore(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

          <FilterBar />

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {additionalInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                isRecommended={false}
                showFeedback={false}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Load More Internships
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* User Feedback Section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium text-gray-900 mb-2">
              Help Us Improve Your Recommendations
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your feedback helps us understand what you're looking for and
              improves our ML recommendations for you and other users.
            </p>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Share Feedback
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Update Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">12</h3>
          <p className="text-gray-600 text-sm">Applications Submitted</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">
            {Object.keys(bookmarked).filter((key) => bookmarked[key]).length}
          </h3>
          <p className="text-gray-600 text-sm">Saved Internships</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">
            {recommendedInternships.length > 0
              ? Math.round(
                  recommendedInternships.reduce(
                    (acc, intern) => acc + intern.matchScore,
                    0
                  ) / recommendedInternships.length
                )
              : 0}
            %
          </h3>
          <p className="text-gray-600 text-sm">Average Match Score</p>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && appliedInternshipDetails && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setAppliedInternshipDetails(null);
          }}
          internship={appliedInternshipDetails}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default InternshipsPage;