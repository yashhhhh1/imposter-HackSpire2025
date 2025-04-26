import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Activity,
  User,
  Briefcase,
  Users,
  Heart,
  Coffee,
  Menu,
  X,
  ChevronRight,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";

export default function MentalHealthDashboard() {
  const [moodData, setMoodData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({
    feeling: "",
    energy: "",
    stress: "",
    sleep: "",
    social: "",
    work: "",
  });

  // Sample data for charts
  const weeklyMoodData = [
    { day: "Mon", score: 6.5 },
    { day: "Tue", score: 7.2 },
    { day: "Wed", score: 6.8 },
    { day: "Thu", score: 5.5 },
    { day: "Fri", score: 7.8 },
    { day: "Sat", score: 8.5 },
    { day: "Sun", score: 8.2 },
  ];

  const wellbeingFactors = [
    { name: "Sleep", value: 65 },
    { name: "Exercise", value: 45 },
    { name: "Social", value: 70 },
    { name: "Work", value: 30 },
    { name: "Nutrition", value: 60 },
  ];

  const checkInQuestions = [
    {
      question: "How have you been feeling emotionally today?",
      placeholder: "I've been feeling...",
      field: "feeling",
    },
    {
      question: "How would you rate your energy level today?",
      placeholder: "My energy is...",
      field: "energy",
    },
    {
      question: "What's your stress level like at work recently?",
      placeholder: "My work stress is...",
      field: "stress",
    },
    {
      question: "How has your sleep quality been this week?",
      placeholder: "My sleep has been...",
      field: "sleep",
    },
    {
      question: "How connected do you feel to your social circle?",
      placeholder: "Socially, I feel...",
      field: "social",
    },
    {
      question: "How are you balancing work and personal life?",
      placeholder: "My work-life balance is...",
      field: "work",
    },
  ];

  const handleResponseChange = (e) => {
    setResponses({
      ...responses,
      [checkInQuestions[currentQuestion].field]: e.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < checkInQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Process the check-in data
      processCheckInData();
      setCheckInCompleted(true);
      setActiveSection("dashboard");
    }
  };

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
        stress: 40,
      },
      factors: {
        sleep: responses.sleep.length > 10 ? 60 : 40,
        work: responses.work.includes("good") ? 70 : 45,
        social: responses.social.includes("connected") ? 75 : 50,
      },
    });
  };

  const startNewCheckIn = () => {
    setCheckInCompleted(false);
    setCurrentQuestion(0);
    setResponses({
      feeling: "",
      energy: "",
      stress: "",
      sleep: "",
      social: "",
      work: "",
    });
    setActiveSection("check-in");
  };

  const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2
            className={`text-violet-700 font-semibold ${
              !showSidebar && "hidden"
            }`}
          >
            MindWell
          </h2>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-full p-2 hover:bg-violet-100 text-violet-600"
          >
            {showSidebar ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex-1 py-4">
          <nav>
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center w-full p-3 ${
                activeSection === "dashboard"
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600"
              } ${!showSidebar && "justify-center"}`}
            >
              <Activity size={20} />
              {showSidebar && <span className="ml-3">Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveSection("check-in")}
              className={`flex items-center w-full p-3 ${
                activeSection === "check-in"
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600"
              } ${!showSidebar && "justify-center"}`}
            >
              <Heart size={20} />
              {showSidebar && <span className="ml-3">Daily Check-in</span>}
            </button>

            <button
              onClick={() => setActiveSection("insights")}
              className={`flex items-center w-full p-3 ${
                activeSection === "insights"
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600"
              } ${!showSidebar && "justify-center"}`}
            >
              <BarChart2 size={20} />
              {showSidebar && <span className="ml-3">Insights</span>}
            </button>

            <button
              onClick={() => setActiveSection("profile")}
              className={`flex items-center w-full p-3 ${
                activeSection === "profile"
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-600"
              } ${!showSidebar && "justify-center"}`}
            >
              <User size={20} />
              {showSidebar && <span className="ml-3">Profile</span>}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t">
          <div
            className={`flex items-center ${!showSidebar && "justify-center"}`}
          >
            <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-700">
              U
            </div>
            {showSidebar && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">User Name</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeSection === "dashboard" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Mental Wellness Dashboard
              </h1>
              <button
                onClick={startNewCheckIn}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition-colors"
              >
                Start Daily Check-in
              </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mr-4">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overall Wellbeing</p>
                    <p className="text-2xl font-bold text-gray-800">7.2/10</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-violet-500 rounded-full"
                    style={{ width: "72%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-in Streak</p>
                    <p className="text-2xl font-bold text-gray-800">5 days</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                        i < 5
                          ? "bg-violet-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mr-4">
                    <Coffee size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Self-care Activities
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      3 this week
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                    Meditation
                  </span>
                  <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                    Exercise
                  </span>
                  <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                    Reading
                  </span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weekly Mood Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyMoodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Wellbeing Factors
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={wellbeingFactors}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {wellbeingFactors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                  <h4 className="font-medium text-violet-800 mb-2">
                    Sleep Better
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Try going to bed 30 minutes earlier and establish a relaxing
                    bedtime routine.
                  </p>
                </div>
                <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                  <h4 className="font-medium text-violet-800 mb-2">
                    Reduce Work Stress
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Practice the 5-minute breathing exercise before starting
                    work meetings.
                  </p>
                </div>
                <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                  <h4 className="font-medium text-violet-800 mb-2">
                    Social Connection
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Schedule a coffee date with a close friend this weekend to
                    boost your mood.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "check-in" && (
          <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Daily Mental Health Check-in
            </h1>

            {!checkInCompleted ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-6">
                  <div className="flex mb-4">
                    {checkInQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 ${
                          index <= currentQuestion
                            ? "bg-violet-500"
                            : "bg-gray-200"
                        } ${index > 0 ? "ml-1" : ""}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {checkInQuestions.length}
                  </p>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {checkInQuestions[currentQuestion].question}
                </h2>

                <textarea
                  value={responses[checkInQuestions[currentQuestion].field]}
                  onChange={handleResponseChange}
                  placeholder={checkInQuestions[currentQuestion].placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 focus:outline-none focus:ring-2 focus:ring-violet-500"
                ></textarea>

                <div className="flex justify-between">
                  <button
                    onClick={() =>
                      currentQuestion > 0 &&
                      setCurrentQuestion(currentQuestion - 1)
                    }
                    className={`px-4 py-2 rounded-lg ${
                      currentQuestion > 0
                        ? "bg-gray-200 text-gray-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition-colors flex items-center"
                  >
                    {currentQuestion < checkInQuestions.length - 1 ? (
                      <>
                        Next <ChevronRight size={16} className="ml-1" />
                      </>
                    ) : (
                      "Complete Check-in"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 mx-auto mb-4">
                  <Heart size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Check-in Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for sharing. Your responses help us provide better
                  insights.
                </p>
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow hover:bg-violet-700 transition-colors"
                >
                  View Your Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {activeSection === "insights" && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Mental Health Insights
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Emotion Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { name: "Happiness", value: 65 },
                      { name: "Anxiety", value: 30 },
                      { name: "Sadness", value: 15 },
                      { name: "Calmness", value: 55 },
                      { name: "Stress", value: 40 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Monthly Trend Analysis
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={[
                      { week: "Week 1", wellbeing: 6.2, stress: 7.1 },
                      { week: "Week 2", wellbeing: 6.8, stress: 6.5 },
                      { week: "Week 3", wellbeing: 7.4, stress: 5.2 },
                      { week: "Week 4", wellbeing: 7.2, stress: 5.8 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wellbeing"
                      name="Wellbeing"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      name="Stress Level"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Wellbeing Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Briefcase size={18} className="mr-2 text-violet-600" />
                    Work-Life Balance
                  </h4>
                  <div className="h-2 bg-gray-200 rounded-full mb-1">
                    <div
                      className="h-2 bg-violet-500 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    45/100 - Needs improvement
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Users size={18} className="mr-2 text-violet-600" />
                    Social Connection
                  </h4>
                  <div className="h-2 bg-gray-200 rounded-full mb-1">
                    <div
                      className="h-2 bg-violet-500 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">70/100 - Good</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Activity size={18} className="mr-2 text-violet-600" />
                    Physical Wellbeing
                  </h4>
                  <div className="h-2 bg-gray-200 rounded-full mb-1">
                    <div
                      className="h-2 bg-violet-500 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">60/100 - Moderate</p>
                </div>
              </div>

              <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                <h4 className="font-medium text-violet-800 mb-2">
                  Personalized Insight
                </h4>
                <p className="text-gray-600">
                  Based on your check-ins, you've shown improvement in your
                  overall mood and social connection, but work stress continues
                  to be a key factor affecting your wellbeing. Consider
                  implementing the recommended stress management techniques.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resources & Recommendations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                  <h4 className="font-medium text-violet-800 mb-2">
                    Meditation Series
                  </h4>
                  <p className="text-gray-600 mb-3">
                    A 7-day guided series focused on work stress reduction.
                  </p>
                  <button className="text-sm text-violet-700 font-medium hover:text-violet-800">
                    Start Series →
                  </button>
                </div>

                <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                  <h4 className="font-medium text-violet-800 mb-2">
                    Article: Sleep Hygiene
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Learn how to improve your sleep quality with these
                    science-backed techniques.
                  </p>
                  <button className="text-sm text-violet-700 font-medium hover:text-violet-800">
                    Read Article →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Your Profile
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                <div className="w-24 h-24 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                  U
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    User Name
                  </h2>
                  <p className="text-gray-500">user@example.com</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Member since April 2025
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Range
                    </label>
                    <p className="text-gray-800">25-34</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <p className="text-gray-800">Software Developer</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Goal
                    </label>
                    <p className="text-gray-800">Reduce stress & anxiety</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Frequency
                    </label>
                    <p className="text-gray-800">Daily</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Daily Check-in Reminder
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive a notification to complete your daily check-in.
                    </p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-violet-500 relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Weekly Progress Reports
                    </h4>
                    <p className="text-sm text-gray-500">
                      Receive an email summary of your weekly mental wellbeing.
                    </p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-violet-500 relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Data Sharing for Research
                    </h4>
                    <p className="text-sm text-gray-500">
                      Share anonymized data to help improve mental health
                      research.
                    </p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-gray-300 relative">
                    <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
