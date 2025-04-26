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
    "sad": { movie: "Comedy", music: "ballad", book: "literary fiction" },
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
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [showMovieRecommendations, setShowMovieRecommendations] = useState(false);
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [showMusicRecommendations, setShowMusicRecommendations] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [showBookRecommendations, setShowBookRecommendations] = useState(false);
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showMovieRecommendations, showMusicRecommendations, showBookRecommendations]);

  const detectEmotion = (text) => {
    text = text.toLowerCase();
    for (const emotion in emotionToGenreMap) {
      const pattern = new RegExp(`\\b${emotion}\\b|\\b${emotion}ing\\b|\\b${emotion}ed\\b`);
      if (pattern.test(text)) {
        return emotion;
      }
    }
    const keywordToEmotion = {
      "joy": "happy", "joyful": "happy", "pleased": "happy", "delighted": "happy",
      "cheerful": "happy", "ecstatic": "happy", "contented": "content",
      "gleeful": "happy", "overjoyed": "happy", "proud": "happy",
      "inspired": "inspired", "motivated": "inspired", "confident": "happy",
      "grateful": "grateful", "thankful": "grateful", "appreciated": "grateful",
      "hope": "hopeful", "hopeful": "hopeful", "optimism": "optimistic",
      "upset": "sad", "down": "sad", "gloomy": "sad", "blue": "sad",
      "depressed": "depressed", "miserable": "sad", "devastated": "sad",
      "heartbroken": "sad", "melancholy": "sad", "sorrow": "sad", "grief": "sad",
      "grieve": "sad", "grieving": "sad", "loss": "sad", "bereaved": "sad",
      "mourning": "sad", "hopeless": "depressed", "despair": "depressed",
      "shame": "sad", "ashamed": "sad", "guilt": "sad", "regret": "sad",
      "bitter": "angry", "resentful": "angry",
      "furious": "angry", "irritated": "angry", "annoyed": "angry", "mad": "angry",
      "enraged": "angry", "irritable": "angry",
      "worried": "anxious", "nervous": "anxious", "tense": "anxious",
      "restless": "anxious", "panicked": "anxious", "fear": "anxious",
      "dread": "anxious", "anxiety": "anxious", "panic": "anxious",
      "insecure": "anxious", "uncertain": "anxious", "uncertainty": "anxious",
      "exhausted": "tired", "sleepy": "tired", "drained": "tired", "weary": "tired",
      "fatigued": "tired", "burnout": "tired",
      "alone": "lonely", "isolated": "lonely", "abandoned": "lonely",
      "loneliness": "lonely", "desolate": "lonely", "unloved": "lonely",
      "calm": "peaceful", "relaxed": "peaceful", "serene": "peaceful",
      "tranquil": "peaceful", "relief": "peaceful", "comfort": "peaceful",
      "enthusiastic": "excited", "eager": "excited", "thrilled": "excited",
      "energized": "excited",
      "breakup": "sad", "broke up": "sad", "break up": "sad", "heartbreak": "sad",
      "heartbroken": "sad", "split": "sad", "divorce": "sad", "separated": "sad",
      "rejection": "sad", "rejected": "sad", "abandon": "lonely",
      "abandoned": "lonely", "abandonment": "lonely", "betray": "sad",
      "betrayal": "sad", "cheated": "sad", "infidelity": "sad", "affair": "sad",
      "stress": "stressed", "stressed": "stressed", "pressure": "stressed",
      "overwhelm": "overwhelmed", "overwhelmed": "overwhelmed", "struggle": "stressed",
      "struggling": "stressed", "battle": "stressed", "challenge": "stressed",
      "trauma": "sad", "ptsd": "anxious", "crisis": "anxious", "addiction": "stressed",
      "self-esteem": "anxious", "insecurity": "anxious", "phobia": "anxious",
      "obsess": "anxious", "obsessed": "anxious"
    };
    for (const keyword in keywordToEmotion) {
      if (text.includes(keyword)) {
        return keywordToEmotion[keyword];
      }
    }
    return null;
  };

  const isEmotionRelated = (text) => {
    text = text.toLowerCase();
    const mentalHealthKeywords = [
      ...Object.keys(emotionToGenreMap),
      "joyful", "ecstatic", "contented", "gleeful", "miserable", "devastated",
      "heartbroken", "melancholy", "irritable", "enraged", "restless", "nervous",
      "panicked", "weary", "fatigued", "drained", "isolated", "desolate", "serene",
      "tranquil", "thankful", "appreciated", "energized", "motivated", "hopeless",
      "despair", "shame", "ashamed", "proud", "confident", "insecure", "jealous",
      "envious", "overjoyed", "bitter", "resentful", "grateful", "inspired",
      "feel", "feeling", "felt", "mood", "emotion", "emotional", "heart", "mind",
      "soul", "vibe", "energy", "state", "inner", "sentimental", "sensitive",
      "touched", "moved", "affected", "hurt", "pain", "ache", "worry", "fear",
      "dread", "anguish", "relief", "comfort", "ease", "sorrow", "grief", "regret",
      "guilt", "pride", "happiness", "sadness", "anger", "love", "hope", "calmness",
      "excitement", "anxiety", "loneliness", "frustration", "confusion", "boredom",
      "nostalgia", "curiosity", "empathy", "sympathy", "compassion",
      "mental", "health", "wellness", "wellbeing", "well-being", "therapy",
      "therapist", "counseling", "counsel", "counsellor", "psychology",
      "psychological", "psychiatrist", "psychiatric", "support", "help", "care",
      "cope", "coping", "manage", "managing", "struggle", "struggling", "battle",
      "challenge", "healing", "heal", "recovery", "recover", "trauma", "ptsd",
      "self-care", "selfcare", "mindfulness", "meditation", "relaxation", "balance",
      "burnout", "exhaustion", "depression", "depressed", "anxiety", "anxious",
      "panic", "attack", "crisis", "stress", "stressed", "overwhelm", "overwhelmed",
      "resilience", "resilient", "motivation", "motivated", "unmotivated",
      "self-esteem", "confidence", "insecurity", "phobia", "fearful", "obsess",
      "obsessed", "addiction", "grieving", "bereavement",
      "breakup", "broke up", "break up", "heartbreak", "heartbroken", "split",
      "divorce", "separated", "separation", "marriage", "wedding", "engaged",
      "engagement", "relationship", "partner", "spouse", "boyfriend", "girlfriend",
      "husband", "wife", "lover", "ex", "friend", "friendship", "best friend",
      "family", "parent", "mother", "father", "sibling", "brother", "sister",
      "child", "son", "daughter", "relative", "loss", "lose", "lost", "death",
      "died", "grieve", "grieving", "mourning", "bereaved", "rejection", "rejected",
      "abandon", "abandoned", "abandonment", "betray", "betrayal", "cheated",
      "trust", "distrust", "loneliness", "alone", "isolation", "isolated", "love",
      "loved", "loving", "unloved", "attachment", "connection", "bond", "closeness",
      "conflict", "fight", "argument", "disagreement", "reconcile", "forgive",
      "forgiveness", "infidelity", "affair",
      "job", "work", "career", "employment", "unemployed", "fired", "laid off",
      "boss", "manager", "colleague", "coworker", "team", "workplace", "office",
      "pressure", "deadline", "task", "project", "responsibility", "demand",
      "failure", "failed", "mistake", "error", "success", "achieve", "achievement",
      "goal", "dream", "aspiration", "ambition", "promotion", "demotion", "stress",
      "stressed", "busy", "overloaded", "time management", "balance", "juggle",
      "struggle", "struggling", "finance", "financial", "money", "debt", "broke",
      "budget", "savings", "school", "study", "exam", "test", "grade", "education",
      "college", "university", "future", "plan", "uncertain", "uncertainty"
    ];
    return mentalHealthKeywords.some((keyword) => text.includes(keyword));
  };

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
      console.log("Movie API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
      return { results: [] };
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchMusicRecommendations = async (genre) => {
    try {
      const clientId = "YOUR_JAMENDO_CLIENT_ID"; // Replace with your Jamendo client ID
      const response = await axios.get("https://api.jamendo.com/v3.0/tracks", {
        params: {
          client_id: clientId,
          format: "json",
          limit: 3,
          tags: genre,
          order: "popularity_total",
        },
      });
      console.log("Music API response:", response.data);
      return response.data.results || [];
    } catch (error) {
      console.error("Error fetching music recommendations:", error);
      return [];
    }
  };

  const fetchBookRecommendations = async (genre) => {
    try {
      const response = await axios.get("https://openlibrary.org/search.json", {
        params: {
          q: `subject:${genre}`,
          limit: 3,
          sort: "editions",
        },
      });
      console.log("Book API response:", response.data);
      return response.data.docs || [];
    } catch (error) {
      console.error("Error fetching book recommendations:", error);
      return [];
    }
  };

  const handleSendMessage = async (customQuestion = null) => {
    if (!userInput.trim() && !customQuestion) return;
    const messageText = customQuestion || userInput;
    setShowMovieRecommendations(false);
    setShowMusicRecommendations(false);
    setShowBookRecommendations(false);
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
    if (!customQuestion && !isEmotionRelated(messageText)) {
      const nonEmotionMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: "I’m here to support your mental wellness, so I can’t assist with that question. Instead, let’s focus on you—how are you feeling today? Maybe there’s something on your mind you’d like to share, or I can suggest some calming activities to lift your spirits! 😊",
        showButtons: false,
      };
      setMessages((prev) => [...prev, nonEmotionMessage]);
      setLoading(false);
      return;
    }
    const detectedEmotion = detectEmotion(messageText);
    if (detectedEmotion && !emotionDetected) {
      setEmotionDetected(true);
      setCurrentEmotion(detectedEmotion);
    }
    try {
      let prompt = "";
      if (emotionDetected || detectedEmotion) {
        prompt = `You are MindMosaic AI, a mental health assistant dedicated to improving the user's emotional wellness.
                  Previous conversation: ${JSON.stringify(messages)}
                  User message: ${messageText}
                  The user seems to be feeling ${currentEmotion || detectedEmotion}, possibly due to a life event or emotional state (e.g., breakup, stress, loss).
                  Provide a warm, empathetic response that acknowledges their feelings and any mentioned life events.
                  Offer gentle suggestions for activities (e.g., watching a movie, listening to music, reading a book, or self-care practices) that could support their well-being and align with their mood.
                  Keep the response concise, supportive, and uplifting, ending with an encouraging invitation to share more or try a suggested activity.`;
      } else {
        prompt = `You are MindMosaic AI, a mental health assistant focused on enhancing the user's emotional wellness.
                  Previous conversation: ${JSON.stringify(messages)}
                  User message: ${messageText}
                  Your goal is to understand the user's emotional state and promote their well-being.
                  Respond with a warm, empathetic message that encourages them to express their feelings or reflect on their mood.
                  Ask a gentle, conversational follow-up question to deepen the discussion, such as how they’re coping or what’s on their mind.
                  Keep the tone supportive and inviting, aiming to create a safe space for emotional exploration.`;
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
        showButtons: emotionDetected || detectedEmotion !== null,
      };
      setMessages((prev) => [...prev, aiMessage]);
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
        text: `I'm having trouble connecting right now, but I’m here for you. Try sharing how you’re feeling, and I can suggest some ways to find comfort or calm. 😊`,
        showButtons: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = async (type) => {
    setShowMovieRecommendations(false);
    setShowMusicRecommendations(false);
    setShowBookRecommendations(false);
    const emotion = currentEmotion || "neutral";
    const genre = emotionToGenreMap[emotion]?.[type] || "Action";
    if (type === "movie") {
      setLoadingMovies(true);
      try {
        const movieData = await fetchMovieRecommendations(genre);
        setMovieRecommendations(movieData.results || []);
        setShowMovieRecommendations(true);
        const movieMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `Based on your ${emotion} mood, I think you might enjoy these ${genre} movies:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, movieMessage]);
      } catch (error) {
        console.error("Error handling movie recommendation:", error);
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `I'd like to recommend some ${genre} movies based on your mood, but I'm having trouble accessing them right now. Would you like to try again later?`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoadingMovies(false);
      }
    } else if (type === "music") {
      setLoadingMusic(true);
      try {
        const musicData = await fetchMusicRecommendations(genre);
        setMusicRecommendations(musicData);
        setShowMusicRecommendations(true);
        const musicMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `Based on your ${emotion} mood, here are some ${genre} music recommendations:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, musicMessage]);
      } catch (error) {
        console.error("Error handling music recommendation:", error);
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `I'd like to recommend some ${genre} music based on your mood, but I'm having trouble accessing them right now. Would you like to try again later?`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoadingMusic(false);
      }
    } else if (type === "book") {
      setLoadingBooks(true);
      try {
        const bookData = await fetchBookRecommendations(genre);
        setBookRecommendations(bookData);
        setShowBookRecommendations(true);
        const bookMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `Based on your ${emotion} mood, here are some ${genre} book recommendations:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, bookMessage]);
      } catch (error) {
        console.error("Error handling book recommendation:", error);
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: `I'd like to recommend some ${genre} books based on your mood, but I'm having trouble accessing them right now. Would you like to try again later?`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoadingBooks(false);
      }
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
      <div className="w-full">
        <div
          className={`border rounded-lg p-4 mb-4 h-[550px] flex flex-col transition-all duration-300 ${
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
                          {(movie.image || movie.poster) ? (
                            <img 
                              src={movie.image || movie.poster} 
                              alt={movie.name || movie.title || "Movie poster"} 
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
                        <h3 className="font-bold text-sm">{movie.name || movie.title || "Unknown Title"}</h3>
                        <p className="text-xs mt-1">
                          {(movie.description || movie.overview)?.substring(0, 50) || "No description available"}
                          {(movie.description || movie.overview)?.length > 50 ? "..." : ""}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-xs ml-1">
                            {movie.rating || movie.vote_average || "N/A"}
                          </span>
                          <span className="text-xs ml-auto">
                            {movie.year || movie.release_date || "Unknown year"}
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
            {showMusicRecommendations && (
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
                  Music Recommendations Based on Your Mood
                </p>
                {loadingMusic ? (
                  <div className="flex items-center space-x-2 py-2">
                    <div
                      className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        darkMode ? "border-t-green-400" : "border-t-green-500"
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
                ) : musicRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {musicRecommendations.map((track, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded border ${
                          darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                        }`}
                      >
                        <div className="aspect-w-3 aspect-h-4 mb-2">
                          {track.image ? (
                            <img 
                              src={track.image} 
                              alt={track.name || "Track cover"} 
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
                        <h3 className="font-bold text-sm">{track.name || "Unknown Track"}</h3>
                        <p className="text-xs mt-1">{track.artist_name || "Unknown Artist"}</p>
                        <p className="text-xs">{track.album_name || "Unknown Album"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">
                    No music recommendations found. Try a different mood or category.
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowMusicRecommendations(false)}
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
            {showBookRecommendations && (
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
                  Book Recommendations Based on Your Mood
                </p>
                {loadingBooks ? (
                  <div className="flex items-center space-x-2 py-2">
                    <div
                      className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        darkMode ? "border-t-purple-400" : "border-t-purple-500"
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
                ) : bookRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {bookRecommendations.map((book, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded border ${
                          darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                        }`}
                      >
                        <div className="aspect-w-3 aspect-h-4 mb-2">
                          {book.cover_i ? (
                            <img 
                              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                              alt={book.title || "Book cover"} 
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
                        <h3 className="font-bold text-sm">{book.title || "Unknown Title"}</h3>
                        <p className="text-xs mt-1">{book.author_name?.join(", ") || "Unknown Author"}</p>
                        <p className="text-xs">{book.first_publish_year || "Unknown Year"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">
                    No book recommendations found. Try a different mood or category.
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowBookRecommendations(false)}
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