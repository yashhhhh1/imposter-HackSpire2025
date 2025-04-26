import { useState, useEffect } from "react";
import { Brain, Briefcase, Users, DumbbellIcon, Coffee, Leaf, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
export default function OnboardingQuestions() {
  // Categories for the questions
  const categories = [
    { id: "intro", name: "Welcome", icon: <Brain className="w-6 h-6" /> },
    // { id: "profession", name: "Professional Life", icon: <Briefcase className="w-6 h-6" /> },
    // { id: "social", name: "Social Connections", icon: <Users className="w-6 h-6" /> },
    // { id: "lifestyle", name: "Lifestyle Habits", icon: <DumbbellIcon className="w-6 h-6" /> },
    // { id: "wellbeing", name: "Mental Wellbeing", icon: <Leaf className="w-6 h-6" /> },
    // { id: "conclusion", name: "Final Thoughts", icon: <Coffee className="w-6 h-6" /> },
  ];

  // Questions organized by category
  const questions = {
    intro: [
      {
        id: "gender",
        question: "What is your gender?",
        type: "select",
        options: ["Male", "Female", "Non-binary", "Prefer not to say"],
      },
      {
        id: "age",
        question: "Which age group do you belong to?",
        type: "select",
        options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
      }
    ],
  };

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animationState, setAnimationState] = useState("idle"); // "idle", "exiting", "entering"
  const [isCompleted, setIsCompleted] = useState(false);
  
  const currentCategory = categories[currentCategoryIndex];
  const categoryQuestions = questions[currentCategory.id];
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const totalQuestions = Object.values(questions).flat().length;
  const completedQuestions = Object.keys(answers).length;
  
  // Calculate how far through the questionnaire the user is
  const getProgress = () => {
    let count = 0;
    for (let i = 0; i < currentCategoryIndex; i++) {
      count += questions[categories[i].id].length;
    }
    count += currentQuestionIndex;
    return (count / totalQuestions) * 100;
  };

  // Handle answer changes
  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  // Navigate to next question with animation
  const navigateNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      animateTransition(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      });
    } else if (currentCategoryIndex < categories.length - 1) {
      animateTransition(() => {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setCurrentQuestionIndex(0);
      });
    } else {
      // Survey completed
      animateTransition(() => {
        setIsCompleted(true);
      });
    }
  };

  // Navigate to previous question with animation
  const navigatePrev = () => {
    if (currentQuestionIndex > 0) {
      animateTransition(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      });
    } else if (currentCategoryIndex > 0) {
      animateTransition(() => {
        setCurrentCategoryIndex(currentCategoryIndex - 1);
        const prevCategoryQuestions = questions[categories[currentCategoryIndex - 1].id];
        setCurrentQuestionIndex(prevCategoryQuestions.length - 1);
      });
    }
  };

  // Animation sequence for transitioning between questions
  const animateTransition = (callback) => {
    setAnimationState("exiting");
    
    setTimeout(() => {
      callback();
      setAnimationState("entering");
      
      setTimeout(() => {
        setAnimationState("idle");
      }, 500);
    }, 500);
  };

  // Check if we can proceed to the next question
  const canProceed = () => {
    if (currentQuestion.type === "textarea" || currentQuestion.type === "text") {
      return true; // Allow proceeding without answers for text inputs
    }
    
    if (currentQuestion.type === "multiselect") {
      return answers[currentQuestion.id] && answers[currentQuestion.id].length > 0;
    }
    
    return answers[currentQuestion.id] !== undefined;
  };

  // Automatic progression after selecting an option for select type questions
  useEffect(() => {
    if (
      animationState === "idle" && 
      answers[currentQuestion?.id] !== undefined && 
      (currentQuestion?.type === "select" || currentQuestion?.type === "slider")
    ) {
      const timer = setTimeout(() => {
        navigateNext();
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [answers, currentQuestion?.id, animationState]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && canProceed() && animationState === "idle") {
        navigateNext();
      } else if (e.key === "Backspace" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        navigatePrev();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, animationState]);

  // Render question input based on type
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "text":
        return (
          <div className="mt-6 w-full max-w-lg">
            <input
              type="text"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder || "Type your answer here..."}
              className="w-full p-4 bg-transparent border-b-2 border-violet-300 text-gray-800 text-xl focus:outline-none focus:border-violet-600 transition-all"
              autoFocus
            />
            <button 
              onClick={navigateNext}
              className="mt-6 px-6 py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all"
            >
              Continue
            </button>
          </div>
        );
        
      case "textarea":
        return (
          <div className="mt-6 w-full max-w-lg">
            <textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentQuestion.placeholder || "Type your answer here..."}
              className="w-full p-4 min-h-32 bg-white bg-opacity-50 border-2 border-violet-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:border-violet-600 transition-all"
              autoFocus
            />
            <button 
              onClick={navigateNext}
              className="mt-6 px-6 py-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all"
            >
              Continue
            </button>
          </div>
        );
        
      case "select":
        return (
          <div className="mt-8 w-full max-w-lg">
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-full p-4 text-left rounded-lg transition-all transform hover:scale-105 ${
                    answers[currentQuestion.id] === option
                      ? "bg-violet-600 text-white"
                      : "bg-white bg-opacity-70 text-gray-800 hover:bg-violet-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
        
      case "multiselect":
        const selectedOptions = answers[currentQuestion.id] || [];
        return (
          <div className="mt-8 w-full max-w-lg">
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const newSelectedOptions = selectedOptions.includes(option)
                      ? selectedOptions.filter(item => item !== option)
                      : [...selectedOptions, option];
                    handleAnswerChange(newSelectedOptions);
                  }}
                  className={`w-full p-4 text-left rounded-lg transition-all transform hover:scale-105 ${
                    selectedOptions.includes(option)
                      ? "bg-violet-600 text-white"
                      : "bg-white bg-opacity-70 text-gray-800 hover:bg-violet-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button 
              onClick={navigateNext}
              disabled={!canProceed()}
              className={`mt-6 px-6 py-3 rounded-full transition-all ${
                canProceed()
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        );
        
      case "slider":
        return (
          <div className="mt-8 w-full max-w-lg">
            <div className="mb-8">
              <input
                type="range"
                min={currentQuestion.min || 1}
                max={currentQuestion.max || 10}
                value={answers[currentQuestion.id] || (currentQuestion.min || 1)}
                onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                className="w-full h-2 bg-violet-200 rounded-full appearance-none cursor-pointer accent-violet-600"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{currentQuestion.labels && currentQuestion.labels[0]}</span>
                <span className="font-bold text-violet-600 text-xl">{answers[currentQuestion.id] || (currentQuestion.min || 1)}</span>
                <span>{currentQuestion.labels && currentQuestion.labels[1]}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render the completion screen
  const renderCompletionScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-4xl font-bold text-violet-800 mb-4">Thank you!</h2>
        <p className="text-xl text-gray-700 mb-8 text-center">
          Your responses have been recorded.
        </p>
        <p className="text-gray-600 text-center max-w-md">
          We appreciate your time and honesty. Your insights will help us better understand your mental wellness journey.
        </p>
        <Link to="/dashboard" className="mt-8">
          <button 
            className="mt-10 px-8 py-4 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all"
          >
            Let's Go
          </button>
        </Link>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-white to-violet-100">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-300 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center">
          <Brain className="w-8 h-8 text-violet-600 mr-2" />
          <h1 className="text-2xl font-bold text-violet-800">MindMosaic</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">{currentCategory.name}</div>
          <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
            {currentCategory.icon}
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-20">
        <div 
          className="h-full bg-violet-600 transition-all duration-500 ease-out"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 px-4">
        {!isCompleted ? (
          <div className="w-full max-w-2xl mx-auto">
            {/* Question */}
            <div className={`transition-all duration-500 transform ${
              animationState === "idle" ? "translate-y-0 opacity-100" :
              animationState === "exiting" ? "-translate-y-16 opacity-0" :
              animationState === "entering" ? "translate-y-0 opacity-100 scale-100" : ""
            }`}>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>
              
              {/* Question input */}
              {renderQuestionInput()}
              
              {/* Navigation */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={navigatePrev}
                  disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-full transition-all ${
                    currentCategoryIndex === 0 && currentQuestionIndex === 0
                      ? "opacity-0 pointer-events-none"
                      : "text-violet-600 hover:bg-violet-100"
                  }`}
                >
                  ← Back
                </button>
                
                <div className="text-sm text-gray-500">
                  {completedQuestions + 1}/{totalQuestions}
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderCompletionScreen()
        )}
      </main>
      
      {/* Footer */}
      <footer className="p-6 text-center z-10">
        <div className="text-xs text-gray-500 flex items-center justify-center">
          <AlertCircle className="w-3 h-3 mr-1 text-violet-500" />
          If you need immediate support, please contact a mental health professional
        </div>
      </footer>
    </div>
  );
}