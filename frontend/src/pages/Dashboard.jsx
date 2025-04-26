import { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, Clock, Activity, User, Briefcase, 
  Users, Heart, Coffee, Menu, X, ChevronRight,
  BarChart2, PieChart as PieChartIcon
} from 'lucide-react';

export default function MentalHealthDashboard() {
  const [moodData, setMoodData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({
    feeling: '',
    energy: '',
    stress: '',
    sleep: '',
    social: '',
    work: ''
  });

  // Sample data for charts
  const weeklyMoodData = [
    { day: 'Mon', score: 6.5 },
    { day: 'Tue', score: 7.2 },
    { day: 'Wed', score: 6.8 },
    { day: 'Thu', score: 5.5 },
    { day: 'Fri', score: 7.8 },
    { day: 'Sat', score: 8.5 },
    { day: 'Sun', score: 8.2 },
  ];

  const wellbeingFactors = [
    { name: 'Sleep', value: 65 },
    { name: 'Exercise', value: 45 },
    { name: 'Social', value: 70 },
    { name: 'Work', value: 30 },
    { name: 'Nutrition', value: 60 },
  ];

  const checkInQuestions = [
    {
      question: "How have you been feeling emotionally today?",
      placeholder: "I've been feeling...",
      field: "feeling"
    },
    {
      question: "How would you rate your energy level today?",
      placeholder: "My energy is...",
      field: "energy"
    },
    {
      question: "What's your stress level like at work recently?",
      placeholder: "My work stress is...",
      field: "stress"
    },
    {
      question: "How has your sleep quality been this week?",
      placeholder: "My sleep has been...",
      field: "sleep"
    },
    {
      question: "How connected do you feel to your social circle?",
      placeholder: "Socially, I feel...",
      field: "social"
    },
    {
      question: "How are you balancing work and personal life?",
      placeholder: "My work-life balance is...",
      field: "work"
    }
  ];

  const handleResponseChange = (e) => {
    setResponses({
      ...responses,
      [checkInQuestions[currentQuestion].field]: e.target.value
    });
  };

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

  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

  return (
    <div>
      {/* <h1>Dashboard</h1> */}
      <EnhancedMentalHealthDashboard userId={user.uid} />
      {/* qkj */}

      
    </div>
  );
}