// components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const ProtectedRoute = ({ children, requiresIncompleteProfile = false, requiresCompleteProfile = false }) => {
  const [user, setUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Check user profile status
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          
          if (snap.exists()) {
            const userData = snap.data();
            setProfileStatus(userData.profileStatus);
          } else {
            setProfileStatus("incomplete");
          }
          
          setUser(currentUser);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileStatus("incomplete");
        }
      } else {
        setUser(null);
        setProfileStatus(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to signin
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If route requires incomplete profile (details page)
  if (requiresIncompleteProfile) {
    if (profileStatus === "complete") {
      // Profile is already complete, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    // Profile is incomplete, allow access to details page
    return children;
  }

  // If route requires complete profile (dashboard, other protected pages)
  if (requiresCompleteProfile) {
    if (profileStatus === "incomplete") {
      // Profile is incomplete, redirect to details page
      return <Navigate to="/details" replace />;
    }
    // Profile is complete, allow access
    return children;
  }

  // Default: just check if user is authenticated
  return children;
};

export default ProtectedRoute;