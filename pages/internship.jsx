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
  ExternalLink
} from 'lucide-react';

const InternshipsPage = () => {
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

  // Sample recommended internships data
  const recommendedInternships = [
    {
      id: 1,
      company: "Google",
      logo: "G",
      role: "Product Management Intern",
      stipend: "₹50,000/month",
      duration: "3 months", 
      location: "Remote",
      matchScore: 95,
      matchType: "High Match",
      tags: ["Product Management", "Strategy", "Analytics"],
      description: "Join Google's PM team and work on products used by billions of users worldwide.",
      requirements: ["MBA/Engineering", "0-1 years experience", "Strong analytical skills"],
      sector: "Technology",
      remote: true,
      featured: true
    },
    {
      id: 2,
      company: "Microsoft",
      logo: "M", 
      role: "PM Intern - Azure Cloud",
      stipend: "₹45,000/month",
      duration: "6 months",
      location: "Bangalore",
      matchScore: 87,
      matchType: "High Match",
      tags: ["Cloud Computing", "Product Strategy", "B2B"],
      description: "Work with Azure team to build enterprise cloud solutions for global customers.",
      requirements: ["Technical background", "Cloud knowledge preferred", "Communication skills"],
      sector: "Technology",
      remote: false,
      featured: true
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
      matchType: "Good Match",
      tags: ["Food Tech", "Consumer Products", "Growth"],
      description: "Drive growth initiatives for Zomato's consumer products across multiple markets.",
      requirements: ["Analytics background", "Consumer insights", "Growth mindset"],
      sector: "Food Tech",
      remote: false,
      featured: true
    },
    {
      id: 4,
      company: "Flipkart",
      logo: "F",
      role: "Product Intern - Commerce",
      stipend: "₹40,000/month",
      duration: "5 months", 
      location: "Bangalore",
      matchScore: 79,
      matchType: "Good Match", 
      tags: ["E-commerce", "User Experience", "Mobile"],
      description: "Shape the shopping experience for millions of users on Flipkart platform.",
      requirements: ["Product sense", "User research", "Data analysis"],
      sector: "E-commerce",
      remote: false,
      featured: true
    },
    {
      id: 5,
      company: "Paytm",
      logo: "P",
      role: "FinTech PM Intern",
      stipend: "₹38,000/month",
      duration: "3 months",
      location: "Noida",
      matchScore: 76,
      matchType: "Good Match",
      tags: ["FinTech", "Payments", "Financial Services"],
      description: "Work on innovative payment solutions and financial products for Indian market.",
      requirements: ["Finance/Tech background", "Problem solving", "Market research"],
      sector: "FinTech",
      remote: false,
      featured: true
    }
  ];

  // Sample additional internships for explore more section
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

  const InternshipCard = ({ internship, isRecommended = false, showFeedback = false }) => (
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
              <span className="text-blue-600 text-sm font-medium ml-2">
                {internship.matchScore}% match
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
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center">
            Apply Now
            <ExternalLink className="w-4 h-4 ml-1" />
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
  );

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Internships for You</h1>
            <p className="text-gray-600 mt-1">Discover opportunities that match your profile and career goals</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              <span>95% match rate this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-medium text-gray-900">Handpicked for You</h2>
              <p className="text-gray-600 text-sm">We've selected these internships based on your profile and preferences</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            Updated 2 hours ago
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendedInternships.slice(0, showMore ? 5 : 3).map((internship) => (
            <InternshipCard 
              key={internship.id} 
              internship={internship} 
              isRecommended={true}
              showFeedback={true}
            />
          ))}
        </div>
        
        {!showMore && (
          <div className="text-center mt-6">
            <button 
              onClick={() => setShowMore(true)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Show More Recommendations
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>

      {/* Explore More Section */}
      {showMore && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Explore More Opportunities</h2>
              <p className="text-gray-600 text-sm">Browse additional internships that might interest you</p>
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
            <h3 className="font-medium text-gray-900 mb-2">Help Us Improve Your Recommendations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your feedback helps us understand what you're looking for and improves our recommendations for you and other users.
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
          <h3 className="font-medium text-gray-900 mb-1">5</h3>
          <p className="text-gray-600 text-sm">Saved Internships</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">87%</h3>
          <p className="text-gray-600 text-sm">Average Match Score</p>
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;