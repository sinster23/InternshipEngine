// components/AuthRedirectRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const AuthRedirectRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Check if we have cached profile status
          const cachedStatus = sessionStorage.getItem(`profile_status_${currentUser.uid}`);
          
          if (cachedStatus) {
            setProfileStatus(cachedStatus);
            setUser(currentUser);
            setLoading(false);
            return;
          }

          // If no cache, fetch from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          
          let status = "incomplete";
          if (snap.exists()) {
            const userData = snap.data();
            status = userData.profileStatus || "incomplete";
          }
          
          // Cache the status
          sessionStorage.setItem(`profile_status_${currentUser.uid}`, status);
          
          setProfileStatus(status);
          setUser(currentUser);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileStatus("incomplete");
          setUser(currentUser);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect based on profile status
  if (user) {
    if (profileStatus === "complete") {
      // User has complete profile, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    } else {
      // User has incomplete profile, redirect to details
      return <Navigate to="/details" replace />;
    }
  }

  // If not authenticated, allow access to auth pages
  return children;
};

export default AuthRedirectRoute;