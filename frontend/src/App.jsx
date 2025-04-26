import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthProvider";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
// import Dashboard from "./pages/Dashboard";
import Ai from "./components/Ai";
import ErrorPage from "./pages/Error";
import Navbar from "./components/Navbar";
import PrivateRoute from "./PrivateRouter/PrivateRouter";
import AuthProvider from "./Context/AuthProvider";
import OnboardingQuestions from "./components/OnboardingQuestions";

// Create a protected onboarding route component
const OnboardingRoute = ({ children }) => {
  const { user, userOnboardingComplete } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (userOnboardingComplete) {
    return <Navigate to="/ai" />; // Assuming AI is your dashboard
  }
  return children;
};

// Create a decision route component for redirecting after login
const OnboardingCheck = () => {
  const { user, userOnboardingComplete } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userOnboardingComplete) {
    return <Navigate to="/ai" />; // Redirect to dashboard/AI if onboarding is complete
  } else {
    return <Navigate to="/onboarding" />; // Redirect to onboarding if not complete
  }
};

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* <div className="container mx-auto"> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthPage />} />
        <Route 
          path="/onboarding" 
          element={
            <OnboardingRoute>
              <OnboardingQuestions />
            </OnboardingRoute>
          } 
        />
        <Route path="/onboarding-check" element={<OnboardingCheck />} />
        <Route 
          path="/ai" 
          element={
            <PrivateRoute>
              <Ai />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;