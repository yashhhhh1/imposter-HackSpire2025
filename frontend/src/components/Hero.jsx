import React from "react";
import { Heart } from "lucide-react";

const Hero = () => {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 text-center px-4 py-8"> */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 text-center px-4 py-8">
        
        <div className="max-w-4xl mx-auto">
          {/* Heart Icon and Welcome Text */}
          <div className="flex items-center justify-center gap-2 text-[#a391f5]  mb-6">
            <Heart className="h-8 w-8" />
            <span className="text-lg font-medium">Welcome to MindMosaic</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your AI-Powered Mental Wellness Companion
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12">
            In a world that rarely pauses, you deserve a moment to check in with
            yourself. Let's explore your inner world – together.
          </p>

          {/* CTA Button */}
          <button className="bg-[#a391f5] hover:bg-[#9279f3] text-white font-medium py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            Start Your Journey
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;
