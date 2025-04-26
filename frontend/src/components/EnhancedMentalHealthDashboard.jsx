import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Calendar, Clock, Activity, User, Briefcase, 
  Users, Heart, Coffee, Menu, X, ChevronRight,
  BarChart2, PieChart as PieChartIcon, Music, Moon,
  MonitorSmartphone, Dumbbell, Sun, Thermometer,
  CheckCircle, Settings, LogOut, BellRing, FileText,
  ArrowUp, ArrowDown, AlertTriangle, Award, Book
} from 'lucide-react';
import { db } from '../firebase/firebase.config'; // Import Firestore instance
import { doc, onSnapshot } from 'firebase/firestore'; // Firestore methods
import Chat from './Chat';

export default function EnhancedMentalHealthDashboard({ userId }) { // Assume userId is passed as a prop
  const [moodData, setMoodData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const [responses, setResponses] = useState({
    feeling: '',
    energy: '',
    stress: '',
    sleep: '',
    social: '',
    work: ''
  });

  // Fetch user data from Firestore onboardingAnswers collection
  useEffect(() => {
    if (!userId) {
      setError('User ID not provided');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const answerDocRef = doc(db, 'onboardingAnswers', userId);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      answerDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData({
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
          });
          console.log('User data:', data);
          setError(null);
        } else {
          setError('Onboarding answers not found');
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Failed to fetch onboarding answers');
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Update mood data when userData or timeRange changes
  useEffect(() => {
    setMoodData(generateMoodData(userData, selectedTimeRange));
  }, [userData, selectedTimeRange]);

  // Apply dark mode effect
  useEffect(() => {
    const body = document.querySelector('body');
    if (darkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Calculate wellbeing score
  const calculateWellbeingScore = (data) => {
    if (!data) return 7.2; // Default value
    let score = 0;
    
    if (data.mental_health === "Excellent") score += 2;
    else if (data.mental_health === "Good") score += 1.5;
    else if (data.mental_health === "Fair") score += 1;
    else if (data.mental_health === "Poor") score += 0.5;
    
    // Sleep quality
    if (data.sleep_quality === "Excellent") score += 2;
    else if (data.sleep_quality === "Good") score += 1.5;
    else if (data.sleep_quality === "Fair") score += 1;
    else if (data.sleep_quality === "Poor") score += 0.5;
    
    // Energy levels
    if (data.energy_levels === "Very High") score += 2;
    else if (data.energy_levels === "High") score += 1.5;
    else if (data.energy_levels === "Moderate") score += 1;
    else if (data.energy_levels === "Low") score += 0.5;
    
    // Stress levels (1-5 scale, inverted)
    if (data.stress_levels) score += (6 - data.stress_levels) * 0.4;
    
    // Social life
    if (data.social_life === "Very Active") score += 2;
    else if (data.social_life === "Somewhat Active") score += 1.5;
    else if (data.social_life === "Not Very Active") score += 1;
    else if (data.social_life === "Inactive") score += 0.5;
    
    // Self care
    if (data.self_care === "Daily") score += 1;
    else if (data.self_care === "A few times a week") score += 0.8;
    else if (data.self_care === "Weekly") score += 0.6;
    else if (data.self_care === "Rarely") score += 0.3;
    
    return Math.min(Math.round(score * 10) / 10, 10);
  };

  // Generate weekly/monthly mood data
  const generateMoodData = (userData, timeRange) => {
    if (!userData) return defaultMoodData(timeRange);
    
    const baseScore = calculateWellbeingScore(userData);
    
    if (timeRange === 'week') {
      return [
        { day: 'Mon', score: Math.min(Math.max(baseScore - 0.7, 1), 10), anxiety: 3.2 },
        { day: 'Tue', score: Math.min(Math.max(baseScore - 0.2, 1), 10), anxiety: 2.8 },
        { day: 'Wed', score: Math.min(Math.max(baseScore + 0.3, 1), 10), anxiety: 2.5 },
        { day: 'Thu', score: Math.min(Math.max(baseScore - 1.2, 1), 10), anxiety: 4.1 },
        { day: 'Fri', score: Math.min(Math.max(baseScore + 1.0, 1), 10), anxiety: 2.2 },
        { day: 'Sat', score: Math.min(Math.max(baseScore + 1.5, 1), 10), anxiety: 1.8 },
        { day: 'Sun', score: Math.min(Math.max(baseScore + 0.8, 1), 10), anxiety: 2.0 },
      ];
    } else {
      return [
        { week: 'Week 1', score: Math.min(Math.max(baseScore - 0.7, 1), 10), anxiety: 3.2 },
        { week: 'Week 2', score: Math.min(Math.max(baseScore - 0.4, 1), 10), anxiety: 2.9 },
        { week: 'Week 3', score: Math.min(Math.max(baseScore + 0.5, 1), 10), anxiety: 2.5 },
        { week: 'Week 4', score: Math.min(Math.max(baseScore + 0.2, 1), 10), anxiety: 2.3 },
      ];
    }
  };

  // Default mood data fallbacks
  const defaultMoodData = (timeRange) => {
    if (timeRange === 'week') {
      return [
        { day: 'Mon', score: 6.5, anxiety: 3.2 },
        { day: 'Tue', score: 7.2, anxiety: 2.8 },
        { day: 'Wed', score: 6.8, anxiety: 2.5 },
        { day: 'Thu', score: 5.5, anxiety: 4.1 },
        { day: 'Fri', score: 7.8, anxiety: 2.2 },
        { day: 'Sat', score: 8.5, anxiety: 1.8 },
        { day: 'Sun', score: 8.2, anxiety: 2.0 },
      ];
    } else {
      return [
        { week: 'Week 1', score: 6.2, anxiety: 3.5 },
        { week: 'Week 2', score: 6.8, anxiety: 3.1 },
        { week: 'Week 3', score: 7.4, anxiety: 2.7 },
        { week: 'Week 4', score: 7.2, anxiety: 2.6 },
      ];
    }
  };

  // Map user data to wellbeing factors
  const mapWellbeingFactors = (userData) => {
    if (!userData) return wellbeingFactorsDefault;
    
    return [
      { 
        name: 'Sleep', 
        value: userData.sleep_quality === "Excellent" ? 90 :
               userData.sleep_quality === "Good" ? 75 :
               userData.sleep_quality === "Fair" ? 60 : 40
      },
      { 
        name: 'Exercise', 
        value: userData.workout_routine === "Daily" ? 90 :
               userData.workout_routine === "3-5 times a week" ? 75 :
               userData.workout_routine === "Occasionally" ? 50 : 30
      },
      { 
        name: 'Social', 
        value: userData.social_life === "Very Active" ? 90 :
               userData.social_life === "Somewhat Active" ? 70 :
               userData.social_life === "Not Very Active" ? 50 : 30
      },
      { 
        name: 'Work', 
        value: userData.work_environment === "Very Supportive" ? 85 :
               userData.work_environment === "Somewhat Supportive" ? 65 :
               userData.work_environment === "Neutral" ? 50 : 30
      },
      { 
        name: 'Self-care', 
        value: userData.self_care === "Daily" ? 90 :
               userData.self_care === "A few times a week" ? 75 :
               userData.self_care === "Weekly" ? 60 : 40
      },
    ];
  };

  // Generate recommendations
  const generateRecommendations = (userData) => {
    if (!userData) return defaultRecommendations;
    
    const recommendations = [];
    
    // Sleep recommendations
    if (userData.sleep_quality === "Poor" || userData.sleep_quality === "Fair") {
      recommendations.push({
        title: "Improve Sleep Quality",
        content: "Try going to bed 30 minutes earlier and establish a relaxing bedtime routine without screens.",
        icon: <Moon size={18} />
      });
    }
    
    // Work stress recommendations
    if (userData.stress_levels > 3 || userData.work_environment !== "Very Supportive") {
      recommendations.push({
        title: "Reduce Work Stress",
        content: "Practice the 5-minute breathing exercise before starting work meetings and take regular breaks.",
        icon: <Briefcase size={18} />
      });
    }
    
    // Social recommendations
    if (userData.social_life !== "Very Active") {
      recommendations.push({
        title: "Social Connection",
        content: "Schedule a coffee date with a close friend this weekend to boost your mood and social connection.",
        icon: <Users size={18} />
      });
    }
    
    // Exercise recommendations
    if (userData.workout_routine !== "Daily" && userData.workout_routine !== "3-5 times a week") {
      recommendations.push({
        title: "Regular Exercise",
        content: "Try incorporating a 20-minute walk or light exercise into your daily routine.",
        icon: <Dumbbell size={18} />
      });
    }
    
    // Music therapy (based on music preferences)
    if (userData.music_mood === "Yes, regularly" && userData.music_genres?.length > 0) {
      const genres = userData.music_genres.join(", ");
      recommendations.push({
        title: "Music Therapy",
        content: `Create a relaxation playlist with your favorite ${genres} music for stress relief.`,
        icon: <Music size={18} />
      });
    }
    
    // If we don't have enough recommendations, add generic ones
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Digital Detox",
        content: "Try a 2-hour screen-free period before bedtime to improve sleep and mental clarity.",
        icon: <MonitorSmartphone size={18} />
      });
    }
    
    // Return only 3 recommendations
    return recommendations.slice(0, 3);
  };
  
  // Default wellbeing factors
  const wellbeingFactorsDefault = [
    { name: 'Sleep', value: 65 },
    { name: 'Exercise', value: 45 },
    { name: 'Social', value: 70 },
    { name: 'Work', value: 30 },
    { name: 'Self-care', value: 60 },
  ];
  
  // Default recommendations
  const defaultRecommendations = [
    {
      title: "Sleep Better",
      content: "Try going to bed 30 minutes earlier and establish a relaxing bedtime routine.",
      icon: <Moon size={18} />
    },
    {
      title: "Reduce Work Stress",
      content: "Practice the 5-minute breathing exercise before starting work meetings.",
      icon: <Briefcase size={18} />
    },
    {
      title: "Social Connection",
      content: "Schedule a coffee date with a close friend this weekend to boost your mood.",
      icon: <Users size={18} />
    }
  ];

  // Get self-care activities
  const getSelfCareActivities = (userData) => {
    if (!userData) return ["Meditation", "Exercise", "Reading"];
    
    const activities = [];
    
    if (userData.coping_mechanisms?.includes("Meditate")) {
      activities.push("Meditation");
    }
    
    if (userData.coping_mechanisms?.includes("Exercise")) {
      activities.push("Exercise");
    }
    
    if (userData.coping_mechanisms?.includes("Reading")) {
      activities.push("Reading");
    }
    
    if (userData.music_mood === "Yes, regularly") {
      activities.push("Music");
    }
    
    if (activities.length < 3) {
      const extras = ["Journaling", "Nature Walks", "Deep Breathing", "Yoga"];
      for (let i = 0; i < extras.length && activities.length < 3; i++) {
        activities.push(extras[i]);
      }
    }
    
    return activities.slice(0, 3);
  };

  // Check-in questions
  const checkInQuestions = [
    {
      question: "How have you been feeling emotionally today?",
      placeholder: "I've been feeling...",
      field: "feeling",
      options: ["Very Happy", "Content", "Neutral", "Sad", "Very Distressed"]
    },
    {
      question: "How would you rate your energy level today?",
      placeholder: "My energy is...",
      field: "energy",
      options: ["Very High", "High", "Moderate", "Low", "Very Low"]
    },
    {
      question: "What's your stress level like at work recently?",
      placeholder: "My work stress is...",
      field: "stress",
      options: ["None", "Minimal", "Moderate", "High", "Extreme"]
    },
    {
      question: "How has your sleep quality been this week?",
      placeholder: "My sleep has been...",
      field: "sleep",
      options: ["Excellent", "Good", "Fair", "Poor", "Very Poor"]
    },
    {
      question: "How connected do you feel to your social circle?",
      placeholder: "Socially, I feel...",
      field: "social",
      options: ["Very Connected", "Connected", "Somewhat Connected", "Isolated", "Very Isolated"]
    },
    {
      question: "How are you balancing work and personal life?",
      placeholder: "My work-life balance is...",
      field: "work",
      options: ["Excellent", "Good", "Fair", "Poor", "Terrible"]
    }
  ];

  // Handle response selection (radio buttons)
  const handleOptionSelect = (option) => {
    setResponses({
      ...responses,
      [checkInQuestions[currentQuestion].field]: option
    });
  };

  // Handle text response change
  const handleResponseChange = (e) => {
    setResponses({
      ...responses,
      [checkInQuestions[currentQuestion].field]: e.target.value
    });
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < checkInQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Process the check-in data
      processCheckInData();
      setCheckInCompleted(true);
      setActiveSection('dashboard');
    }
  };

  // Process check-in data
  const processCheckInData = () => {
    // This would analyze the text inputs using NLP and sentiment analysis
    // For demo purposes, we're just setting some sample data
    setMoodData({
      overall: 7.2,
      emotions: {
        happiness: 65,
        anxiety: 30,
        sadness: 15,
        calmness: 55,
        stress: 40
      },
      factors: {
        sleep: responses.sleep.length > 10 ? 60 : 40,
        work: responses.work.includes('good') ? 70 : 45,
        social: responses.social.includes('connected') ? 75 : 50
      }
    });
  };

  // Start new check-in
  const startNewCheckIn = () => {
    setCheckInCompleted(false);
    setCurrentQuestion(0);
    setResponses({
      feeling: '',
      energy: '',
      stress: '',
      sleep: '',
      social: '',
      work: ''
    });
    setActiveSection('check-in');
  };

  // Calculate various metrics
  const wellbeingScore = userData ? calculateWellbeingScore(userData) : 7.2;
  const moodDataForChart = moodData || defaultMoodData(selectedTimeRange);
  const wellbeingFactors = mapWellbeingFactors(userData);
  const recommendations = generateRecommendations(userData);
  const selfCareActivities = getSelfCareActivities(userData);

  // Colors
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
  const MOOD_COLORS = {
    score: '#8b5cf6',  // Purple for mood score
    anxiety: '#ef4444' // Red for anxiety
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: "Check-in Reminder", message: "Don't forget your daily check-in", time: "10 mins ago", read: false },
    { id: 2, title: "New Article", message: "5 ways to reduce workplace stress", time: "2 hours ago", read: false },
    { id: 3, title: "Weekly Report", message: "Your weekly wellness report is ready", time: "Yesterday", read: true }
  ];
  
  // Mock journal entries
  const journalEntries = [
    { date: "Apr 25", mood: 8.5, highlight: "Started meditation practice, feeling calm" },
    { date: "Apr 24", mood: 7.2, highlight: "Meeting went well, but felt tired" },
    { date: "Apr 23", mood: 6.5, highlight: "Stress at work, had a good walk" }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-20'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md transition-all duration-300 flex flex-col`}>
  <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center justify-between`}>
    <h2 className={`text-violet-500 font-semibold ${!showSidebar && 'hidden'}`}>MindMosaic</h2>
    <button 
      onClick={() => setShowSidebar(!showSidebar)} 
      className={`rounded-full p-2 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-violet-100 text-violet-600'}`}
    >
      {showSidebar ? <X size={18} /> : <Menu size={18} />}
    </button>
  </div>
  
  <div className="flex-1 py-4">
    <nav>
      <button 
        onClick={() => setActiveSection('dashboard')}
        className={`flex items-center w-full p-3 ${activeSection === 'dashboard' ? (darkMode ? 'bg-gray-700 text-violet-400' : 'bg-violet-100 text-violet-700') : (darkMode ? 'text-gray-300' : 'text-gray-600')} ${!showSidebar && 'justify-center'}`}
      >
        <Activity size={20} />
        {showSidebar && <span className="ml-3">Dashboard</span>}
      </button>
      
      <button 
        onClick={() => setActiveSection('check-in')}
        className={`flex items-center w-full p-3 ${activeSection === 'check-in' ? (darkMode ? 'bg-gray-700 text-violet-400' : 'bg-violet-100 text-violet-700') : (darkMode ? 'text-gray-300' : 'text-gray-600')} ${!showSidebar && 'justify-center'}`}
      >
        <Heart size={20} />
        {showSidebar && <span className="ml-3">Daily Check-in</span>}
      </button>
      
      
      <button 
        onClick={() => setActiveSection('MoodLifter Games')}
        className={`flex items-center w-full p-3 ${activeSection === 'MoodLifter Games' ? (darkMode ? 'bg-gray-700 text-violet-400' : 'bg-violet-100 text-violet-700') : (darkMode ? 'text-gray-300' : 'text-gray-600')} ${!showSidebar && 'justify-center'}`}
      >
        <Book size={20} /> {/* Consider replacing with <Gamepad size={20} /> for a gaming icon */}
        {showSidebar && <span className="ml-3">MoodLifter Games</span>}
      </button>
      
      <button 
        onClick={() => setActiveSection('profile')}
        className={`flex items-center w-full p-3 ${activeSection === 'profile' ? (darkMode ? 'bg-gray-700 text-violet-400' : 'bg-violet-100 text-violet-700') : (darkMode ? 'text-gray-300' : 'text-gray-600')} ${!showSidebar && 'justify-center'}`}
      >
        <User size={20} />
        {showSidebar && <span className="ml-3">Profile</span>}
      </button>
      
      {showSidebar && (
        <button 
          onClick={() => setActiveSection('settings')}
          className={`flex items-center w-full p-3 ${activeSection === 'settings' ? (darkMode ? 'bg-gray-700 text-violet-400' : 'bg-violet-100 text-violet-700') : (darkMode ? 'text-gray-300' : 'text-gray-600')}`}
        >
          <Settings size={20} />
          <span className="ml-3">Settings</span>
        </button>
      )}
    </nav>
  </div>
  
  <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
    <div className={`flex items-center ${!showSidebar && 'justify-center'}`}>
      <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-violet-900' : 'bg-violet-200'} flex items-center justify-center ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
        {userData?.gender === "Male" ? "M" : userData?.gender === "Female" ? "F" : "U"}
      </div>
      {showSidebar && (
        <div className="ml-3">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData?.profession || "User"}</p>
          <p className="text-xs text-gray-500">user@example.com</p>
        </div>
      )}
    </div>
  </div>
</div>

      
      {/* Top Bar */}
      <div className="flex-1 flex flex-col">
        <div className={`h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b flex items-center justify-between px-6`}>
          <div className="flex items-center">
            <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {activeSection === 'dashboard' && 'Mental Wellness Dashboard'}
              {activeSection === 'check-in' && 'Daily Mental Health Check-in'}
              {activeSection === 'insights' && 'Mental Health Insights'}
              {activeSection === 'journal' && 'Wellness Journal'}
              {activeSection === 'profile' && 'Your Profile'}
              {activeSection === 'settings' && 'Settings'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Date display */}
            <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Calendar size={18} className="mr-2" />
              <span className="text-sm">April 26, 2025</span>
            </div>
            
            {/* Dark mode toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} relative`}
              >
                <BellRing size={18} />
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-10`}>
                  <div className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex justify-between items-center`}>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Notifications</h3>
                    <span className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full px-2 py-1`}>
                      {notifications.filter(n => !n.read).length} new
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-3 ${!notification.read ? (darkMode ? 'bg-gray-700' : 'bg-violet-50') : ''} ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{notification.title}</h4>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</span>
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      
        {/* Main Content */}
        <div className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
          {activeSection === 'dashboard' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Welcome back, {userData?.profession || 'User'}!
                  </p>
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Your Mental Wellness Overview
                  </h2>
                </div>
                {!checkInCompleted && (
                  <button
                    onClick={() => setActiveSection('check-in')}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-500 text-white hover:bg-violet-600'} flex items-center`}
                  >
                    <Heart size={18} className="mr-2" />
                    Start Daily Check-in
                  </button>
                )}
              </div>

              {/* Wellbeing Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Wellbeing Score
                      </h3>
                      <p className={`text-4xl font-bold ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                        {wellbeingScore.toFixed(1)}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Based on your recent data
                      </p>
                    </div>
                    <Award size={40} className={`${darkMode ? 'text-violet-400' : 'text-violet-500'}`} />
                  </div>
                </div>

                {/* Mood Trend */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md col-span-2`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Mood Trend
                    </h3>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className={`text-sm p-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="week">Weekly</option>
                      <option value="month">Monthly</option>
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={moodDataForChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis
                        dataKey={selectedTimeRange === 'week' ? 'day' : 'week'}
                        stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          color: darkMode ? '#ffffff' : '#1f2937',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke={MOOD_COLORS.score}
                        strokeWidth={2}
                        name="Mood Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="anxiety"
                        stroke={MOOD_COLORS.anxiety}
                        strokeWidth={2}
                        name="Anxiety Level"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Wellbeing Factors and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Wellbeing Factors */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Wellbeing Factors
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={wellbeingFactors}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {wellbeingFactors.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          color: darkMode ? '#ffffff' : '#1f2937',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommendations */}
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Personalized Recommendations
                  </h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-violet-50'} flex items-start`}
                      >
                        <div className="mr-3">{rec.icon}</div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {rec.title}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {rec.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Self-Care Activities */}
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Your Self-Care Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selfCareActivities.map((activity, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-violet-100 text-violet-700'}`}
                    >
                      <Activity size={24} className="mx-auto mb-2" />
                      <p className="font-medium">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Mood & Anxiety Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={moodDataForChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis
                        dataKey={selectedTimeRange === 'week' ? 'day' : 'week'}
                        stroke={darkMode ? '#9ca3af' : '#6b7280'}
                      />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          color: darkMode ? '#ffffff' : '#1f2937',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke={MOOD_COLORS.score}
                        fill={MOOD_COLORS.score}
                        fillOpacity={0.3}
                        name="Mood Score"
                      />
                      <Area
                        type="monotone"
                        dataKey="anxiety"
                        stroke={MOOD_COLORS.anxiety}
                        fill={MOOD_COLORS.anxiety}
                        fillOpacity={0.3}
                        name="Anxiety Level"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Wellbeing Factors Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wellbeingFactors}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          color: darkMode ? '#ffffff' : '#1f2937',
                        }}
                      />
                      <Bar dataKey="value" fill={MOOD_COLORS.score} name="Factor Strength" />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Other sections remain the same */}
          {activeSection === 'check-in' && <Chat darkMode={darkMode} />}
{activeSection === 'MoodLifter Games' && (
           <h1>hi</h1>
)}

          {activeSection === 'profile' && (
            <div className="p-6 max-w-2xl mx-auto">
              <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Your Profile
              </h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="space-y-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profession</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {userData?.profession || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age Range</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {userData?.age || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {userData?.gender || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Coping Mechanisms
                    </p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {userData?.coping_mechanisms?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Favorite Music Genres
                    </p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {userData?.music_genres?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="p-6 max-w-2xl mx-auto">
              <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Settings
              </h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Dark Mode
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Switch between light and dark themes
                      </p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-violet-600 text-white' : 'bg-violet-500 text-white'}`}
                    >
                      {darkMode ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Log Out
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sign out of your account
                      </p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}