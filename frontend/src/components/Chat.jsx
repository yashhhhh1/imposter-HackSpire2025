import { useState, useRef, useEffect } from "react";

const Chat = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      sender: "MindMosaic AI",
      time: "10:30 AM",
      text: "How are you feeling today? Your mood seems to be improving based on recent check-ins.",
      showButtons: true, // Add buttons to the initial AI message
    },
    {
      sender: "You",
      time: "10:32 AM",
      text: "I'm feeling better today! Got a good night's sleep for once.",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (customQuestion = null) => {
    // If no input and no custom question, return
    if (!userInput.trim() && !customQuestion) return;
    
    // If this is a custom question (from buttons), replace user input
    const messageText = customQuestion || userInput;

    const newMessage = {
      sender: "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: messageText,
    };

    // Update UI immediately with user message
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setLoading(true);

    try {
      // Call Gemini API with fetch
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are MindMosaic AI, a mental health assistant.
                          Previous conversation: ${JSON.stringify(messages)}
                          User message: ${messageText}
        
                          Provide a helpful, empathetic response to assist with mental health.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      // Convert fetch response to JSON
      const responseData = await response.json();
      
      // Log the full response for debugging
      console.log("Gemini API response:", responseData);

      // Extract the response text correctly
      let botReply = "Sorry, I couldn't understand.";

      if (
        responseData &&
        responseData.candidates &&
        responseData.candidates[0] &&
        responseData.candidates[0].content &&
        responseData.candidates[0].content.parts &&
        responseData.candidates[0].content.parts[0]
      ) {
        botReply = responseData.candidates[0].content.parts[0].text;
      }

      // Add AI response to messages
      const aiMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: botReply,
        showButtons: true, // Show recommendation buttons for every AI response
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);

      // Add error message to chat
      const errorMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `I'm having trouble connecting right now. Please try again later. Error: ${error.message}`,
        showButtons: false, // Don't show buttons on error messages
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle recommendation button clicks
  const handleRecommendationClick = (type) => {
    let question;
    switch (type) {
      case 'movie':
        question = "Can you recommend a movie that might help with my current mood?";
        break;
      case 'music':
        question = "What music would you recommend to improve my mood right now?";
        break;
      case 'book':
        question = "Could you suggest a book that might help with my mental wellbeing?";
        break;
      default:
        return;
    }
    
    handleSendMessage(question);
  };

  return (
    <div className="p-6 max-w-8xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hi, Yash Patel</h1>

      {/* Chat Board */}
      <div className="w-full">
        <div className="border border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 h-[450px] flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chat Board</h2>
          <div
            ref={chatContainerRef}
            className="space-y-4 chat flex-grow overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border-2 ${
                  msg.sender === "You"
                    ? "bg-gray-100 ml-8 text-right"
                    : "bg-amber-50"
                }`}
              >
                <p className="text-sm text-gray-400">
                  {msg.sender} - {msg.time}
                </p>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {/* Recommendation buttons - only shown on AI messages */}
                {msg.sender === "MindMosaic AI" && msg.showButtons && (
                  <div className="mt-3 flex space-x-2 justify-start">
                    <button 
                      onClick={() => handleRecommendationClick('movie')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      🎬 Movie
                    </button>
                    <button 
                      onClick={() => handleRecommendationClick('music')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      🎵 Music
                    </button>
                    <button 
                      onClick={() => handleRecommendationClick('book')}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      📚 Book
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-amber-50 rounded-lg p-3 border-2">
                <p className="text-sm text-gray-400">
                  MindMosaic AI - typing...
                </p>
                <p>...</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Box */}
        <div className="border border-gray-600 rounded-lg p-2">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading}
              className={`ml-2 rounded-full p-2 ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;