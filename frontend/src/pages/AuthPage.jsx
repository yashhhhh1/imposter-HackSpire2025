import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthProvider"; // Adjust path as needed
import { useNavigate, useLocation } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    user,
    createUser,
    login,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
    resetPassword,
    verifyEmail,
  } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // navigate(from, { replace: true });
      navigate("/onboarding-check", { replace: true });
    }
  }, [user, navigate, from]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        console.log("Attempting login with:", email);
        await login(email, password);
      } else {
        // Registration flow
        const userCredential = await createUser(email, password);
        await updateUserProfile({ displayName: name });
        await verifyEmail();
        alert("Account created successfully! Please verify your email before logging in.");
        setIsLogin(true); // Switch to login mode after registration
        return; // Don't navigate yet, wait for email verification
      }
    } catch (error) {
      console.error("Auth Error:", error.code, error.message);
      
      // Better error messages for the user
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError("Incorrect email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      alert("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      setError(error.message || "Failed to send reset email. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setError("");
    setIsSubmitting(true);
    
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'github') {
        await signInWithGithub();
      }
      // Navigation happens automatically via useEffect when user state changes
    } catch (err) {
      console.error(`${provider} Sign-In Error:`, err.message);
      setError(`${provider} sign-in failed. Please try again.`);
      setIsSubmitting(false);
    }
  };

  // Render forgot password form
  if (showForgotPassword) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-xl border border-violet-100">
          <h2 className="text-center text-3xl font-bold text-gray-800">Reset Password</h2>
          
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-red-600 border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
              required
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-violet-500 px-4 py-2 text-white transition-all duration-200 hover:bg-violet-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-violet-600 hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular login/signup form
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-xl border border-violet-100">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>
        
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-red-600 border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            required
          />  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            required
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-violet-500 px-4 py-2 text-white transition-all duration-200 hover:bg-violet-600 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        
        <div className="flex justify-between text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-violet-600 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
          
          {isLogin && (
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-violet-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 flex-shrink text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="space-y-4">
          {/* Google Sign-In */}
          <button
            onClick={() => handleSocialSignIn('google')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <span>Sign in with Google</span>
          </button>

          {/* GitHub Sign-In */}
          <button
            onClick={() => handleSocialSignIn('github')}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;