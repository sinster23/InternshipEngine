import React, { useState, useEffect } from 'react';
import { 
  Briefcase,
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  TrendingUp,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  Award,
  Target,
  Building2
} from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const ATSScoreModal = ({ isOpen, onClose, application, atsScore }) => {
  if (!isOpen) return null;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">ATS Score Analysis</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {application.companyName} - {application.internshipTitle}
          </p>
        </div>

        <div className="p-6">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
                  {atsScore}
                </div>
                <div className="text-sm text-gray-600">/ 100</div>
              </div>
            </div>
            <h4 className={`text-xl font-semibold mb-2 ${getScoreColor(atsScore)}`}>
              {getScoreLabel(atsScore)}
            </h4>
            <p className="text-gray-600">
              Your resume is {atsScore >= 80 ? 'highly' : atsScore >= 60 ? 'moderately' : 'minimally'} optimized for this position
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-4 mb-6">
            <h5 className="font-medium text-gray-900">Score Breakdown</h5>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Keywords Match</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Skills Alignment</span>
                  <span className="text-sm font-medium text-gray-900">{atsScore >= 80 ? '92%' : atsScore >= 60 ? '68%' : '45%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${atsScore >= 80 ? 92 : atsScore >= 60 ? 68 : 45}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Experience Relevance</span>
                  <span className="text-sm font-medium text-gray-900">{atsScore >= 80 ? '88%' : atsScore >= 60 ? '72%' : '52%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${atsScore >= 80 ? 88 : atsScore >= 60 ? 72 : 52}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Format & Structure</span>
                  <span className="text-sm font-medium text-gray-900">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-600" />
              Recommendations
            </h5>
            <ul className="space-y-2">
              {atsScore < 80 && (
                <>
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Add more relevant keywords from the job description
                  </li>
                  <li className="flex items-start text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    Highlight specific projects related to {application.tags?.[0] || 'the role'}
                  </li>
                </>
              )}
              {atsScore < 60 && (
                <li className="flex items-start text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Consider adding relevant certifications or courses
                </li>
              )}
              {atsScore >= 80 && (
                <li className="flex items-start text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  Your resume is well-optimized! Keep it updated with recent achievements.
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Optimize Resume
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationsPage = ({setActiveTab}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatingATS, setCalculatingATS] = useState({});
  const [atsScores, setAtsScores] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showATSModal, setShowATSModal] = useState(false);

  // Fetch user's applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to view your applications");
        setLoading(false);
        return;
      }

      const applicationsRef = collection(db, 'applications');
      const q = query(
        applicationsRef, 
        where('userId', '==', user.uid),

      );
      
      const querySnapshot = await getDocs(q);
      const fetchedApplications = [];
      
      querySnapshot.forEach((doc) => {
        fetchedApplications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setApplications(fetchedApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate ATS Score (Demo)
  const calculateATSScore = async (applicationId, application) => {
    setCalculatingATS(prev => ({...prev, [applicationId]: true}));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate demo score based on match score if available
    const baseScore = application.matchScore || 70;
    const randomVariation = Math.floor(Math.random() * 20) - 10;
    const atsScore = Math.min(100, Math.max(40, baseScore + randomVariation));
    
    setAtsScores(prev => ({...prev, [applicationId]: atsScore}));
    setCalculatingATS(prev => ({...prev, [applicationId]: false}));
    
    // Show modal with results
    setSelectedApplication(application);
    setShowATSModal(true);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'applied': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied', icon: Clock },
      'reviewed': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Under Review', icon: Eye },
      'shortlisted': { bg: 'bg-green-100', text: 'text-green-800', label: 'Shortlisted', icon: CheckCircle },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Not Selected', icon: XCircle },
      'accepted': { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted', icon: Award }
    };

    const config = statusConfig[status] || statusConfig['applied'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Applications</h3>
          <p className="text-gray-600">Please wait while we fetch your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchApplications}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">Track and manage your internship applications</p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Review</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.reviewed}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.shortlisted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.applied}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none outline-none text-sm bg-transparent flex-1"
              />
            </div>
            
            <div className="h-6 border-l border-gray-200"></div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded px-3 py-1 bg-white"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="reviewed">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Not Selected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters'
              : "You haven't applied to any internships yet"}
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <button
              onClick={() => setActiveTab('internships')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Internships
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                    {application.companyName?.charAt(0) || 'C'}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {application.internshipTitle}
                    </h3>
                    <p className="text-gray-600 mb-2">{application.companyName}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getStatusBadge(application.status)}
                      {application.matchScore && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {application.matchScore}% Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {formatDate(application.appliedAt)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  {application.stipend}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  {application.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-600" />
                  {application.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                  {application.sector}
                </div>
              </div>

              {application.tags && application.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {application.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ATS Score Display */}
              {atsScores[application.id] && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">ATS Score:</span>
                      <span className={`ml-2 text-lg font-bold ${
                        atsScores[application.id] >= 80 ? 'text-green-600' :
                        atsScores[application.id] >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {atsScores[application.id]}/100
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowATSModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => calculateATSScore(application.id, application)}
                  disabled={calculatingATS[application.id]}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    atsScores[application.id]
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {calculatingATS[application.id] ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : atsScores[application.id] ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recalculate ATS Score
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Calculate ATS Score
                    </>
                  )}
                </button>
                
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </button>
                
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ATS Score Modal */}
      {showATSModal && selectedApplication && (
        <ATSScoreModal
          isOpen={showATSModal}
          onClose={() => {
            setShowATSModal(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          atsScore={atsScores[selectedApplication.id] || 75}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;