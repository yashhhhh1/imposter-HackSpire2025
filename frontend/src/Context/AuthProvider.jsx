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

// Create the AuthContext
export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Email/Password signup
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email/Password signin
  const login = (email, password) => {
    setLoading(true);
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
    logout
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;