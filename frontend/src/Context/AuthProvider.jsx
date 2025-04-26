import React, { createContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { app } from '../firebase/firebase.config';
import axios from 'axios';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase.config'; // Adjust the import path as needed
// Create the AuthContext
export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add this with your other state declarations
const [userOnboardingComplete, setUserOnboardingComplete] = useState(false);
  
  // Email/Password signup
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
// Add these functions in your AuthProvider component
const checkOnboardingStatus = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().onboardingComplete) {
      setUserOnboardingComplete(true);
    } else {
      setUserOnboardingComplete(false);
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    setUserOnboardingComplete(false);
  }
};

const completeOnboarding = async (userData) => {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      ...userData,
      onboardingComplete: true
    }, { merge: true });
    setUserOnboardingComplete(true);
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error;
  }
};
  // Email/Password signin
  // In AuthProvider.js
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign in with GitHub
  const signInWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // Update user profile
  const updateUserProfile = (profileData) => {
    return updateProfile(auth.currentUser, profileData);
  };

  // Send password reset email
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Send email verification
  const verifyEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  // Logout
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('access-token');
    return signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        checkOnboardingStatus(currentUser.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);
  // Manage auth state and token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Get JWT token when user is authenticated
        const userInfo = { email: currentUser.email };
        
        axios.post('http://localhost:3000/jwt', userInfo)
          .then((response) => {
            if (response.data.token) {
              localStorage.setItem('access-token', response.data.token);
            }
          })
          .catch((error) => {
            console.error("JWT generation error:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If no user, just stop loading
        setLoading(false);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    login,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
    resetPassword,
    verifyEmail,
    userOnboardingComplete,
    setUserOnboardingComplete,
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;