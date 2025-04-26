import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
// import Dashboard from "./pages/Dashboard";
import Ai from "./components/Ai";
import ErrorPage from "./pages/Error";
import Navbar from "./components/Navbar";
import PrivateRoute from "./PrivateRouter/PrivateRouter";
import AuthProvider from "./Context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthPage />} />
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