import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../src/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../src/firebase";

// Function to check user profile completeness
const checkUserProfileStatus = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      return { profileComplete: false, profileExists: false };
    }
    
    const userData = snap.data();
    const profileComplete = userData.profileStatus === "complete";
    
    return { 
      profileComplete, 
      profileExists: true, 
      profileData: userData 
    };
  } catch (error) {
    console.error("Error checking profile status:", error);
    return { profileComplete: false, profileExists: false, error: error.message };
  }
};

// Enhanced sign-in function with profile status check
export const signInUser = async (email, password) => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check profile status
    const profileStatus = await checkUserProfileStatus(user.uid);

    // Return success response with redirect information
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      },
      profileComplete: profileStatus.profileComplete,
      redirectTo: profileStatus.profileComplete ? "dashboard" : "details",
      message: "Sign in successful",
    };
  } catch (error) {
    // Handle specific Firebase auth errors
    let errorMessage = "An error occurred during sign in";

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address format";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email address";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/invalid-credential":
        errorMessage = "Invalid email or password";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      default:
        errorMessage = error.message || "Sign in failed";
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

export const signUpUser = async (email, password, displayName = "") => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create initial user profile with incomplete status
    await ensureUserProfile(user);

    // Send email verification
    try {
      await sendEmailVerification(user);
    } catch (emailError) {
      console.warn("Email verification failed:", emailError);
      // Don't fail the entire registration if email verification fails
    }

    // Return success response
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName.trim(),
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      },
      profileComplete: false,
      redirectTo: "details", // Always redirect new users to details page
      message:
        "Account created successfully! Please check your email for verification.",
    };
  } catch (error) {
    // Handle specific Firebase auth errors
    let errorMessage = "An error occurred during sign up";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "An account with this email already exists";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Email/password accounts are not enabled";
        break;
      case "auth/weak-password":
        errorMessage =
          "Password is too weak. Please choose a stronger password";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many requests. Please try again later";
        break;
      default:
        errorMessage = error.message || "Sign up failed";
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code,
    };
  }
};

// Enhanced user profile creation function
const ensureUserProfile = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Create minimal user profile document
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      profileStatus: "incomplete",
    });

    return { exists: false };
  }

  return { exists: true, data: snap.data() };
};

/**
 * Google Sign-In with profile status check
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Ensure Firestore profile exists
    const profileCheck = await ensureUserProfile(user);
    
    // Check profile status for existing users
    const profileStatus = await checkUserProfileStatus(user.uid);

    return {
      success: true,
      newUser: !profileCheck.exists,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      },
      profileComplete: profileStatus.profileComplete,
      redirectTo: profileStatus.profileComplete ? "dashboard" : "details",
      message: "Google sign-in successful",
    };
  } catch (error) {
    return handleAuthError(error, "Google");
  }
};

/**
 * Apple Sign-In with profile status check
 */
export const signInWithApple = async () => {
  try {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Ensure Firestore profile exists
    const profileCheck = await ensureUserProfile(user);
    
    // Check profile status for existing users
    const profileStatus = await checkUserProfileStatus(user.uid);

    return {
      success: true,
      newUser: !profileCheck.exists,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
      },
      profileComplete: profileStatus.profileComplete,
      redirectTo: profileStatus.profileComplete ? "dashboard" : "details",
      message: "Apple sign-in successful",
    };
  } catch (error) {
    return handleAuthError(error, "Apple");
  }
};

/**
 * Function to mark user profile as complete
 * Call this after user completes the details page
 */
export const markProfileComplete = async (uid, additionalData = {}) => {
  try {
    const userRef = doc(db, "users", uid);
    
    await setDoc(userRef, {
      ...additionalData,
      profileStatus: "complete",
      profileCompletedAt: serverTimestamp(),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Error handler to keep code DRY
 */
const handleAuthError = (error, providerName) => {
  let errorMessage = `${providerName} sign-in failed`;

  switch (error.code) {
    case "auth/popup-closed-by-user":
      errorMessage = "Sign-in was cancelled";
      break;
    case "auth/popup-blocked":
      errorMessage = "Popup was blocked by browser";
      break;
    case "auth/account-exists-with-different-credential":
      errorMessage =
        "An account already exists with a different sign-in method. Try using email/password.";
      break;
    default:
      errorMessage = error.message || `${providerName} sign-in failed`;
  }

  return {
    success: false,
    error: errorMessage,
    code: error.code,
  };
};

export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const strength = Object.values(requirements).filter(Boolean).length;

  return {
    requirements,
    strength,
    isStrong: strength >= 4,
    message: strength < 2 ? "Weak" : strength < 4 ? "Medium" : "Strong",
  };
};

// Email validator
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? "" : "Please enter a valid email address",
  };
};