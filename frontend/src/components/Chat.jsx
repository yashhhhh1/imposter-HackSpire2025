import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = ({ darkMode }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const chatContainerRef = useRef(null);
  
  const emotionalCheckInQuestions = [
    "If you could paint your emotions today, what colors would you choose and why? 🎨",
    "What's the story of your heart today? Happy chapter, a twist, or maybe a peaceful pause? 📖",
    "If your feelings today were a song, what would the lyrics sound like? 🎶",
    "Imagine your mood as the weather—sunny, stormy, breezy, or a mix of all? Tell me the forecast! ☀️🌧️",
    "How is your soul doing today beneath all the routines and responsibilities? 🌿",
    "If today was a movie about your emotions, what would the title be and what genre? 🎬",
    "On a scale from 'cloud-watching calm' to 'rollercoaster wild,' where are you today—and what's making it that way? 🎢",
    "What's one word, one color, and one memory that could describe your mood today? 🌈",
    "If you could send me a postcard describing your inner world right now, what would it say? ✉️",
    "Are you carrying something heavy today or walking a little lighter? I'd love to hear about it. 🧳",
    "What emotions are sitting beside you today—are they old friends or unexpected visitors? 🪑",
    "How is your heart whispering (or shouting) to you today? 💬",
    "Imagine your emotions today as a garden—what's blooming, and what needs a little more sunlight? 🌻",
    "If you could write a short journal entry right now about today's feelings, what would it say? 📓",
    "What does your energy feel like today—like a sunrise, a cozy campfire, a fast river, or something else? 🔥",
    "Is there a moment today that perfectly captures your current mood? I'd love to hear the story. 🕰️",
    "Which three emotions would you invite to your table today, and what would you talk about? 🍽️",
    "Are you feeling more like an explorer, a dreamer, a fighter, or a healer today? 🌍",
    "If your day had a scent, a taste, and a sound—what would they be? 🌸🍫🎵",
    "How's the landscape inside you looking today—mountains to climb, rivers to cross, or cozy cabins to rest in? 🏔️"
  ];
  
  const emotionToGenreMap = {
    "happy": { movie: "Comedy", music: "pop", book: "humor" },
    "excited": { movie: "Adventure", music: "upbeat", book: "fantasy" },
    "peaceful": { movie: "Documentary", music: "ambient", book: "poetry" },
    "grateful": { movie: "Biography", music: "classical", book: "memoir" },
    "optimistic": { movie: "Family", music: "folk", book: "self-help" },
    "content": { movie: "Comedy", music: "acoustic", book: "travel" },
    "hopeful": { movie: "Fantasy", music: "indie", book: "spiritual" },
    "inspired": { movie: "Biography", music: "instrumental", book: "philosophy" },
    "loved": { movie: "Romance", music: "love songs", book: "romance" },
    
    "sad": { movie: "Drama", music: "ballad", book: "literary fiction" },
    "anxious": { movie: "Comedy", music: "lo-fi", book: "mindfulness" },
    "stressed": { movie: "Animation", music: "meditation", book: "self-care" },
    "angry": { movie: "Action", music: "rock", book: "thriller" },
    "depressed": { movie: "Drama", music: "hopeful", book: "uplifting" },
    "overwhelmed": { movie: "Animation", music: "calming", book: "short stories" },
    "lonely": { movie: "Drama", music: "singer-songwriter", book: "coming-of-age" },
    "frustrated": { movie: "Sci-Fi", music: "alternative", book: "adventure" },
    "tired": { movie: "Family", music: "gentle", book: "audiobook" },
    
    "reflective": { movie: "Drama", music: "jazz", book: "essays" },
    "nostalgic": { movie: "History", music: "oldies", book: "historical fiction" },
    "confused": { movie: "Mystery", music: "experimental", book: "fantasy" },
    "curious": { movie: "Documentary", music: "world", book: "non-fiction" },
    "bored": { movie: "Thriller", music: "new genres", book: "mystery" },
    "neutral": { movie: "Action", music: "playlists", book: "bestsellers" }
  };

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * emotionalCheckInQuestions.length);
    return emotionalCheckInQuestions[randomIndex];
  };

  const [messages, setMessages] = useState([
    {
      sender: "MindMosaic AI",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: getRandomQuestion(),
      showButtons: false,
    }
  ]);
  
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotionDetected, setEmotionDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral"); // Default emotion
  const [showMovieRecommendations, setShowMovieRecommendations] = useState(false);
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showMovieRecommendations]);

  // Function to detect emotions in text
  const detectEmotion = (text) => {
    text = text.toLowerCase();
    
    // Check for emotion keywords in the text
    for (const emotion in emotionToGenreMap) {
      const pattern = new RegExp(`\\b${emotion}\\b|\\b${emotion}ing\\b|\\b${emotion}ed\\b`);
      if (pattern.test(text)) {
        return emotion;
      }
    }
    
    // Additional keyword mappings to emotions
    const keywordToEmotion = {
      "joy": "happy", "pleased": "happy", "delighted": "happy", "cheerful": "happy",
      "worried": "anxious", "nervous": "anxious", "tense": "anxious",
      "upset": "sad", "down": "sad", "gloomy": "sad", "blue": "sad", "depressed": "sad",
      "furious": "angry", "irritated": "angry", "annoyed": "angry", "mad": "angry",
      "exhausted": "tired", "sleepy": "tired", "drained": "tired",
      "alone": "lonely", "isolated": "lonely", "abandoned": "lonely",
      "calm": "peaceful", "relaxed": "peaceful", "serene": "peaceful",
      "thankful": "grateful", "appreciative": "grateful",
      "enthusiastic": "excited", "eager": "excited", "thrilled": "excited"
    };
    
    for (const keyword in keywordToEmotion) {
      if (text.includes(keyword)) {
        return keywordToEmotion[keyword];
      }
    }
    
    return null;
  };

  // Function to fetch movie recommendations based on genre
  const fetchMovieRecommendations = async (genre) => {
    setLoadingMovies(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://imdb236.p.rapidapi.com/imdb/search',
        params: {
          type: 'movie',
          genre: genre,
          rows: '3',
          sortOrder: 'ASC',
          sortField: 'id'
        },
        headers: {
          'x-rapidapi-key': '064e5cdf15msha2b994f0da22a49p107ebajsnaea164ace7a2',
          'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        }
      };
      
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      return { results: [] };
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleSendMessage = async (customQuestion = null) => {
    if (!userInput.trim() && !customQuestion) return;

    const messageText = customQuestion || userInput;

    // Hide movie recommendations when sending a new message
    setShowMovieRecommendations(false);

    const newMessage = {
      sender: "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: messageText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setLoading(true);

    // Check for emotions in user's message
    const detectedEmotion = detectEmotion(messageText);
    if (detectedEmotion && !emotionDetected) {
      setEmotionDetected(true);
      setCurrentEmotion(detectedEmotion);
    }

    try {
      // Create an appropriate prompt based on conversation state
      let prompt = "";
      
      if (emotionDetected || detectedEmotion) {
        // If emotion already detected, focus on providing support and recommendations
        prompt = `You are MindMosaic AI, a mental health assistant.
                Previous conversation: ${JSON.stringify(messages)}
                User message: ${messageText}
                The user seems to be feeling ${currentEmotion || detectedEmotion}. 
                Provide a helpful, empathetic response that acknowledges their emotion. 
                Suggest that they might find comfort or enjoyment in books, movies, or music related to their mood.
                Keep your response brief and supportive, ending with a gentle encouragement.`;
      } else {
        // If emotion not yet detected, focus on gentle probing to understand their feelings
        prompt = `You are MindMosaic AI, a mental health assistant.
                Previous conversation: ${JSON.stringify(messages)}
                User message: ${messageText}
                Try to understand how the user is feeling emotionally. 
                Ask a gentle follow-up question focused on their emotional state.
                Be warm, empathetic, and conversational. Your goal is to help them express their feelings.`;
      }

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
                    text: prompt,
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

      const responseData = await response.json();
      console.log("Gemini API response:", responseData);

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

      const aiMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: botReply,
        // Show recommendation buttons only after emotion is detected
        showButtons: emotionDetected || detectedEmotion !== null,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // If we just detected an emotion, update the state
      if (detectedEmotion && !emotionDetected) {
        setEmotionDetected(true);
        setCurrentEmotion(detectedEmotion);
      }
      
    } catch (error) {
      console.error("Error fetching Gemini response:", error);

      const errorMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `I'm having trouble connecting right now. Please try again later. Error: ${error.message}`,
        showButtons: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = async (type) => {
    setShowMovieRecommendations(false);
    
    const emotion = currentEmotion || "neutral";
    const genre = emotionToGenreMap[emotion]?.[type] || "Action";
    
    if (type === "movie") {
      setLoadingMovies(true);
      
      try {
        // Fetch movie recommendations
        const movieData = await fetchMovieRecommendations(genre);
        setMovieRecommendations(movieData.results || []);
        setShowMovieRecommendations(true);
        
        // Send a message about the recommendations
        const question = `Based on your ${emotion} mood, I think you might enjoy these ${genre} movies:`;
        handleSendMessage(question);
      } catch (error) {
        console.error("Error handling movie recommendation:", error);
        handleSendMessage(`I'd like to recommend some ${genre} movies based on your mood, but I'm having trouble accessing them right now. Would you like to try again later?`);
      } finally {
        setLoadingMovies(false);
      }
    } else {
      let question;
      switch (type) {
        case "music":
          question = `Since you're feeling ${emotion}, ${emotionToGenreMap[emotion]?.music || "soothing"} music might resonate with you right now. Would you like some song or artist suggestions?`;
          break;
        case "book":
          question = `For your current ${emotion} state, ${emotionToGenreMap[emotion]?.book || "engaging"} books could be a good match. Would you like me to recommend some titles?`;
          break;
        default:
          return;
      }
      handleSendMessage(question);
    }
  };

  return (
    <div
      className={`p-6 max-w-8xl mx-auto h-full rounded-lg shadow-sm border transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-100"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Hi, Yash Patel
      </h1>

      {/* Chat Board */}
      <div className="w-full">
        <div
          className={`border rounded-lg p-4 mb-4 ${showMovieRecommendations ? 'h-[550px]' : 'h-[450px]'} flex flex-col transition-all duration-300 ${
            darkMode
              ? "bg-gray-900 border-gray-600"
              : "bg-gray-50 border-gray-600"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Chat Board
          </h2>
          
          <div
            ref={chatContainerRef}
            className="space-y-4 chat flex-grow overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border-2 ${
                  msg.sender === "You"
                    ? darkMode
                      ? "bg-gray-700 ml-8 text-right"
                      : "bg-gray-100 ml-8 text-right"
                    : darkMode
                    ? "bg-gray-600"
                    : "bg-gray-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {msg.sender} - {msg.time}
                </p>
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.sender === "MindMosaic AI" && msg.showButtons && (
                  <div className="mt-3 flex space-x-2 justify-start">
                    <button
                      onClick={() => handleRecommendationClick("movie")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      🎬 Movie
                    </button>
                    <button
                      onClick={() => handleRecommendationClick("music")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      🎵 Music
                    </button>
                    <button
                      onClick={() => handleRecommendationClick("book")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode
                          ? "bg-purple-500 hover:bg-purple-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      📚 Book
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div
                className={`rounded-lg p-3 border-2 flex items-center space-x-2 ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 border-2 rounded-full animate-spin ${
                    darkMode
                      ? "border-t-violet-400"
                      : "border-t-violet-500"
                  }`}
                ></div>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  MindMosaic AI - typing...
                </p>
              </div>
            )}
            
            {/* Movie Recommendations Section */}
            {showMovieRecommendations && (
              <div
                className={`rounded-lg p-3 border-2 ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <p
                  className={`text-sm mb-2 font-bold ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Movie Recommendations Based on Your Mood
                </p>
                
                {loadingMovies ? (
                  <div className="flex items-center space-x-2 py-2">
                    <div
                      className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        darkMode
                          ? "border-t-blue-400"
                          : "border-t-blue-500"
                      }`}
                    ></div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Loading recommendations...
                    </p>
                  </div>
                ) : movieRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {movieRecommendations.map((movie, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded border ${
                          darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                        }`}
                      >
                        <div className="aspect-w-3 aspect-h-4 mb-2">
                          {movie.image ? (
                            <img 
                              src={movie.image} 
                              alt={movie.name || "Movie poster"} 
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/placeholder/240/360";
                              }}
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{movie.name || "Unknown Title"}</h3>
                        <p className="text-xs mt-1">
                          {movie.description?.substring(0, 50) || "No description available"}
                          {movie.description?.length > 50 ? "..." : ""}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-xs ml-1">
                            {movie.rating || "N/A"}
                          </span>
                          <span className="text-xs ml-auto">
                            {movie.year || "Unknown year"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">
                    No recommendations found. Try a different mood or category.
                  </p>
                )}
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowMovieRecommendations(false)}
                    className={`px-3 py-1 rounded-full text-xs text-white ${
                      darkMode
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    Close Recommendations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Box */}
        <div
          className={`border rounded-lg p-2 ${
            darkMode
              ? "border-gray-600 bg-gray-700"
              : "border-gray-600 bg-white"
          }`}
        >
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message here..."
              className={`flex-1 bg-transparent border-none focus:outline-none ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
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
                  : darkMode
                  ? "bg-purple-500 hover:bg-purple-600"
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

