import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthProvider";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const Chat = ({ darkMode, onCheckInComplete, userId }) => {
  const { user } = useContext(AuthContext);
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
    "How's the landscape inside you looking today—mountains to climb, rivers to cross, or cozy cabins to rest in? 🏔️",
  ];

  const emotionToGenreMap = {
    happy: { movie: "Comedy", music: "pop", book: "humor", emoji: "😊🎶" },
    excited: { movie: "Adventure", music: "upbeat", book: "fantasy", emoji: "🎉" },
    peaceful: { movie: "Documentary", music: "ambient", book: "poetry", emoji: "🌿" },
    grateful: { movie: "Biography", music: "classical", book: "memoir", emoji: "🙏" },
    optimistic: { movie: "Family", music: "folk", book: "self-help", emoji: "🌞" },
    content: { movie: "Comedy", music: "acoustic", book: "travel", emoji: "😊" },
    hopeful: { movie: "Fantasy", music: "indie", book: "inspirational", emoji: "🌈" },
    inspired: { movie: "Biography", music: "instrumental", book: "philosophy", emoji: "✨" },
    loved: { movie: "Romance", music: "love_songs", book: "romance", emoji: "💖" },
    sad: { movie: "Comedy", music: "ballad", book: "literary fiction", emoji: "😢" },
    anxious: { movie: "Comedy", music: "lo_fi", book: "self-help", emoji: "😟" },
    stressed: { movie: "Animation", music: "meditation", book: "self-help", emoji: "😓" },
    angry: { movie: "Action", music: "rock", book: "thriller", emoji: "😣" },
    depressed: { movie: "Drama", music: "hopeful", book: "inspirational", emoji: "😔" },
    overwhelmed: { movie: "Animation", music: "calming", book: "short stories", emoji: "😣" },
    lonely: { movie: "Drama", music: "singer_songwriter", book: "young adult", emoji: "😞" },
    frustrated: { movie: "Sci-Fi", music: "alternative", book: "adventure", emoji: "😣" },
    tired: { movie: "Family", music: "gentle", book: "fiction", emoji: "😴" },
    reflective: { movie: "Drama", music: "jazz", book: "essays", emoji: "🤔" },
    nostalgic: { movie: "History", music: "oldies", book: "historical fiction", emoji: "📼" },
    confused: { movie: "Mystery", music: "experimental", book: "fantasy", emoji: "😕" },
    curious: { movie: "Documentary", music: "world", book: "non-fiction", emoji: "🧐" },
    bored: { movie: "Thriller", music: "new_genres", book: "mystery", emoji: "😑" },
    neutral: { movie: "Action", music: "playlists", book: "bestsellers", emoji: "😶" },
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
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotionDetected, setEmotionDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [fixedGenre, setFixedGenre] = useState(null);
  const [showMovieRecommendations, setShowMovieRecommendations] = useState(false);
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [showMusicRecommendations, setShowMusicRecommendations] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState([]);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [showBookRecommendations, setShowBookRecommendations] = useState(false);
  const [bookRecommendations, setBookRecommendations] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [responses, setResponses] = useState({
    feeling: "",
    energy: "",
    stress: "",
    sleep: "",
    social: "",
    work: "",
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showMovieRecommendations, showMusicRecommendations, showBookRecommendations]);

  const detectEmotion = (text) => {
    text = text.toLowerCase();
    let detectedEmotions = [];
    for (const emotion in emotionToGenreMap) {
      const pattern = new RegExp(`\\b${emotion}\\b|\\b${emotion}ing\\b|\\b${emotion}ed\\b`);
      if (pattern.test(text)) {
        detectedEmotions.push({ emotion, confidence: 0.9 });
      }
    }
    const keywordToEmotion = {
      joy: { emotion: "happy", confidence: 0.85 },
      joyful: { emotion: "happy", confidence: 0.85 },
      pleased: { emotion: "happy", confidence: 0.8 },
      delighted: { emotion: "happy", confidence: 0.85 },
      cheerful: { emotion: "happy", confidence: 0.8 },
      ecstatic: { emotion: "happy", confidence: 0.9 },
      contented: { emotion: "content", confidence: 0.8 },
      gleeful: { emotion: "happy", confidence: 0.85 },
      overjoyed: { emotion: "happy", confidence: 0.9 },
      proud: { emotion: "happy", confidence: 0.8 },
      inspired: { emotion: "inspired", confidence: 0.85 },
      motivated: { emotion: "inspired", confidence: 0.8 },
      confident: { emotion: "happy", confidence: 0.75 },
      grateful: { emotion: "grateful", confidence: 0.85 },
      thankful: { emotion: "grateful", confidence: 0.85 },
      appreciated: { emotion: "grateful", confidence: 0.8 },
      hope: { emotion: "hopeful", confidence: 0.85 },
      hopeful: { emotion: "hopeful", confidence: 0.85 },
      optimism: { emotion: "optimistic", confidence: 0.85 },
      upset: { emotion: "sad", confidence: 0.8 },
      down: { emotion: "sad", confidence: 0.75 },
      gloomy: { emotion: "sad", confidence: 0.8 },
      blue: { emotion: "sad", confidence: 0.75 },
      depressed: { emotion: "depressed", confidence: 0.9 },
      miserable: { emotion: "sad", confidence: 0.85 },
      devastated: { emotion: "sad", confidence: 0.9 },
      heartbroken: { emotion: "sad", confidence: 0.9 },
      melancholy: { emotion: "sad", confidence: 0.85 },
      sorrow: { emotion: "sad", confidence: 0.85 },
      grief: { emotion: "sad", confidence: 0.9 },
      hopeless: { emotion: "depressed", confidence: 0.85 },
      despair: { emotion: "depressed", confidence: 0.85 },
      shame: { emotion: "sad", confidence: 0.8 },
      ashamed: { emotion: "sad", confidence: 0.8 },
      guilt: { emotion: "sad", confidence: 0.8 },
      regret: { emotion: "sad", confidence: 0.8 },
      bitter: { emotion: "angry", confidence: 0.8 },
      resentful: { emotion: "angry", confidence: 0.8 },
      furious: { emotion: "angry", confidence: 0.9 },
      irritated: { emotion: "angry", confidence: 0.75 },
      annoyed: { emotion: "angry", confidence: 0.75 },
      mad: { emotion: "angry", confidence: 0.8 },
      enraged: { emotion: "angry", confidence: 0.9 },
      worried: { emotion: "anxious", confidence: 0.8 },
      nervous: { emotion: "anxious", confidence: 0.8 },
      tense: { emotion: "anxious", confidence: 0.8 },
      restless: { emotion: "anxious", confidence: 0.75 },
      panicked: { emotion: "anxious", confidence: 0.85 },
      fear: { emotion: "anxious", confidence: 0.8 },
      dread: { emotion: "anxious", confidence: 0.8 },
      anxiety: { emotion: "anxious", confidence: 0.9 },
      panic: { emotion: "anxious", confidence: 0.85 },
      insecure: { emotion: "anxious", confidence: 0.8 },
      uncertain: { emotion: "anxious", confidence: 0.75 },
      exhausted: { emotion: "tired", confidence: 0.85 },
      sleepy: { emotion: "tired", confidence: 0.8 },
      drained: { emotion: "tired", confidence: 0.8 },
      weary: { emotion: "tired", confidence: 0.8 },
      fatigued: { emotion: "tired", confidence: 0.85 },
      burnout: { emotion: "tired", confidence: 0.85 },
      alone: { emotion: "lonely", confidence: 0.85 },
      isolated: { emotion: "lonely", confidence: 0.85 },
      abandoned: { emotion: "lonely", confidence: 0.85 },
      loneliness: { emotion: "lonely", confidence: 0.9 },
      desolate: { emotion: "lonely", confidence: 0.85 },
      unloved: { emotion: "lonely", confidence: 0.85 },
      calm: { emotion: "peaceful", confidence: 0.85 },
      relaxed: { emotion: "peaceful", confidence: 0.85 },
      serene: { emotion: "peaceful", confidence: 0.85 },
      tranquil: { emotion: "peaceful", confidence: 0.85 },
      relief: { emotion: "peaceful", confidence: 0.8 },
      comfort: { emotion: "peaceful", confidence: 0.8 },
      enthusiastic: { emotion: "excited", confidence: 0.85 },
      eager: { emotion: "excited", confidence: 0.85 },
      thrilled: { emotion: "excited", confidence: 0.85 },
      energized: { emotion: "excited", confidence: 0.85 },
      breakup: { emotion: "sad", confidence: 0.9 },
      heartbreak: { emotion: "sad", confidence: 0.9 },
      rejection: { emotion: "sad", confidence: 0.85 },
      betrayal: { emotion: "sad", confidence: 0.85 },
      stress: { emotion: "stressed", confidence: 0.9 },
      overwhelmed: { emotion: "overwhelmed", confidence: 0.9 },
      frustration: { emotion: "frustrated", confidence: 0.85 },
      nostalgic: { emotion: "nostalgic", confidence: 0.85 },
      curious: { emotion: "curious", confidence: 0.85 },
      boredom: { emotion: "bored", confidence: 0.85 },
    };
    for (const keyword in keywordToEmotion) {
      if (text.includes(keyword)) {
        detectedEmotions.push({
          emotion: keywordToEmotion[keyword].emotion,
          confidence: keywordToEmotion[keyword].confidence,
        });
      }
    }
    if (detectedEmotions.length > 0) {
      detectedEmotions.sort((a, b) => b.confidence - a.confidence);
      return detectedEmotions[0].emotion;
    }
    const positiveWords = ["good", "great", "awesome", "fantastic", "wonderful"];
    const negativeWords = ["bad", "terrible", "awful", "horrible", "sad"];
    if (positiveWords.some((word) => text.includes(word))) {
      return "happy";
    }
    if (negativeWords.some((word) => text.includes(word))) {
      return "sad";
    }
    return "neutral";
  };

  const isEmotionRelated = (text) => {
    text = text.toLowerCase();
    const mentalHealthKeywords = [
      ...Object.keys(emotionToGenreMap),
      "suggest",
      "help",
      "joyful",
      "ecstatic",
      "contented",
      "gleeful",
      "miserable",
      "devastated",
      "heartbroken",
      "melancholy",
      "irritable",
      "enraged",
      "restless",
      "nervous",
      "panicked",
      "weary",
      "fatigued",
      "drained",
      "isolated",
      "desolate",
      "serene",
      "tranquil",
      "thankful",
      "appreciated",
      "energized",
      "motivated",
      "hopeless",
      "despair",
      "shame",
      "ashamed",
      "proud",
      "confident",
      "insecure",
      "jealous",
      "envious",
      "overjoyed",
      "bitter",
      "resentful",
      "grateful",
      "inspired",
      "feel",
      "feeling",
      "felt",
      "mood",
      "emotion",
      "emotional",
      "heart",
      "mind",
      "soul",
      "vibe",
      "energy",
      "state",
      "inner",
      "sentimental",
      "sensitive",
      "touched",
      "moved",
      "affected",
      "hurt",
      "pain",
      "ache",
      "worry",
      "fear",
      "dread",
      "anguish",
      "relief",
      "comfort",
      "ease",
      "sorrow",
      "grief",
      "regret",
      "guilt",
      "pride",
      "happiness",
      "sadness",
      "anger",
      "love",
      "hope",
      "calmness",
      "excitement",
      "anxiety",
      "loneliness",
      "frustration",
      "confusion",
      "boredom",
      "nostalgia",
      "curiosity",
      "empathy",
      "sympathy",
      "compassion",
      "mental",
      "health",
      "wellness",
      "wellbeing",
      "well-being",
      "therapy",
      "therapist",
      "counseling",
      "counsel",
      "counsellor",
      "psychology",
      "psychological",
      "psychiatrist",
      "psychiatric",
      "support",
      "help",
      "care",
      "cope",
      "coping",
      "manage",
      "managing",
      "struggle",
      "struggling",
      "battle",
      "challenge",
      "healing",
      "heal",
      "recovery",
      "recover",
      "trauma",
      "ptsd",
      "self-care",
      "selfcare",
      "mindfulness",
      "meditation",
      "relaxation",
      "balance",
      "burnout",
      "exhaustion",
      "depression",
      "depressed",
      "anxiety",
      "anxious",
      "panic",
      "attack",
      "crisis",
      "stress",
      "stressed",
      "overwhelm",
      "overwhelmed",
      "resilience",
      "resilient",
      "motivation",
      "motivated",
      "unmotivated",
      "self-esteem",
      "confidence",
      "insecurity",
      "phobia",
      "fearful",
      "obsess",
      "obsessed",
      "addiction",
      "grieving",
      "bereavement",
      "breakup",
      "broke up",
      "break up",
      "heartbreak",
      "heartbroken",
      "split",
      "divorce",
      "separated",
      "separation",
      "marriage",
      "wedding",
      "engaged",
      "engagement",
      "relationship",
      "partner",
      "spouse",
      "boyfriend",
      "girlfriend",
      "husband",
      "wife",
      "lover",
      "ex",
      "friend",
      "friendship",
      "best friend",
      "family",
      "parent",
      "mother",
      "father",
      "sibling",
      "brother",
      "sister",
      "child",
      "son",
      "daughter",
      "relative",
      "loss",
      "lose",
      "lost",
      "death",
      "died",
      "grieve",
      "grieving",
      "mourning",
      "bereaved",
      "rejection",
      "rejected",
      "abandon",
      "abandoned",
      "abandonment",
      "betray",
      "betrayal",
      "cheated",
      "trust",
      "distrust",
      "loneliness",
      "alone",
      "isolation",
      "isolated",
      "love",
      "loved",
      "loving",
      "unloved",
      "attachment",
      "connection",
      "bond",
      "closeness",
      "conflict",
      "fight",
      "argument",
      "disagreement",
      "reconcile",
      "forgive",
      "forgiveness",
      "infidelity",
      "affair",
      "job",
      "work",
      "career",
      "employment",
      "unemployed",
      "fired",
      "laid off",
      "boss",
      "manager",
      "colleague",
      "coworker",
      "team",
      "workplace",
      "office",
      "pressure",
      "deadline",
      "task",
      "project",
      "responsibility",
      "demand",
      "failure",
      "failed",
      "mistake",
      "error",
      "success",
      "achieve",
      "achievement",
      "goal",
      "dream",
      "aspiration",
      "ambition",
      "promotion",
      "demotion",
      "stress",
      "stressed",
      "busy",
      "overloaded",
      "time management",
      "balance",
      "juggle",
      "struggle",
      "struggling",
      "finance",
      "financial",
      "money",
      "debt",
      "broke",
      "budget",
      "savings",
      "school",
      "study",
      "exam",
      "test",
      "grade",
      "education",
      "college",
      "university",
      "future",
      "plan",
      "uncertain",
      "uncertainty",
    ];
    return mentalHealthKeywords.some((keyword) => text.includes(keyword));
  };

  const fetchMovieRecommendations = async (genre) => {
    setLoadingMovies(true);
    try {
      const options = {
        method: "GET",
        url: "https://imdb236.p.rapidapi.com/imdb/search",
        params: {
          type: "movie",
          genre: genre,
          averageRatingFrom: "5",
          averageRatingTo: "10",
          rows: "3",
          sortField: "id",
        },
        headers: {
          "x-rapidapi-key": "064e5cdf15msha2b994f0da22a49p107ebajsnaea164ace7a2",
          "x-rapidapi-host": "imdb236.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      setError("Failed to fetch movie recommendations. Please try again.");
      return [];
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchMusicRecommendations = async (genre, emotion, retry = false) => {
    setLoadingMusic(true);
    try {
      const prompt = `
        You are a music recommendation expert assisting a user who is feeling ${emotion} ${emotionToGenreMap[emotion]?.emoji || "😶"}. Based on this emotion, the assigned music genre is "${genre.replace("_", "-")}".
        Provide exactly three real, well-known songs that match this mood and genre. For each song, include:
        - name: The song title (string)
        - artist: The artist name (string)
        - album: The album name, if known; otherwise, use an empty string (string)
        Return the response as a valid JSON array of objects, e.g.:
        [
          {"name": "Song Title", "artist": "Artist Name", "album": "Album Name"},
          {"name": "Song Title 2", "artist": "Artist Name 2", "album": ""},
          {"name": "Song Title 3", "artist": "Artist Name 3", "album": "Album Name 3"}
        ]
        Ensure the response is pure JSON without markdown (no \`\`\`json or other formatting).
        If the genre is niche (e.g., lo_fi, singer_songwriter), select popular, recognizable songs that align with the ${emotion} mood and "${genre.replace("_", "-")}" genre.
        The songs should be appropriate for emotional wellness and reflect the user's ${emotion} mood.
      `;
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
              temperature: 0.3,
              maxOutputTokens: 512,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      let musicData = [];
      if (
        responseData &&
        responseData.candidates &&
        responseData.candidates[0] &&
        responseData.candidates[0].content &&
        responseData.candidates[0].content.parts &&
        responseData.candidates[0].content.parts[0]
      ) {
        const text = responseData.candidates[0].content.parts[0].text;
        try {
          musicData = JSON.parse(text);
        } catch (directParseError) {
          const jsonMatch = text.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            musicData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No valid JSON array found in response");
          }
        }
        if (!Array.isArray(musicData) || musicData.length === 0) {
          throw new Error("Response is not a valid array or is empty");
        }
        musicData = musicData
          .slice(0, 3)
          .map((track) => ({
            name: track.name?.trim() || "Unknown Song",
            artist: track.artist?.trim() || "Unknown Artist",
            album: track.album?.trim() || "",
          }))
          .filter((track) => track.name && track.artist);
        if (musicData.length < 1 && !retry) {
          return fetchMusicRecommendations(genre, emotion, true);
        }
        if (musicData.length < 1) {
          throw new Error("Failed to retrieve valid music recommendations after retry");
        }
      } else {
        throw new Error("Invalid response structure from Gemini API");
      }
      return musicData;
    } catch (error) {
      setError("Failed to fetch music recommendations from Gemini. Please try again later.");
      return [];
    } finally {
      setLoadingMusic(false);
    }
  };

  const fetchBookRecommendations = async (genre, retry = false) => {
    setLoadingBooks(true);
    try {
      const randomSeed = Math.floor(Math.random() * 50);
      const queryGenre = retry ? "bestsellers" : genre;
      const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: {
          q: `subject:${queryGenre}`,
          maxResults: 10,
          startIndex: randomSeed,
          orderBy: "relevance",
          key: apiKey,
        },
      });
      const books = response.data.items
        ? response.data.items.slice(0, 3).map((item) => ({
            title: item.volumeInfo.title || "Unknown Title",
            author_name: item.volumeInfo.authors || ["Unknown Author"],
            first_publish_year: item.volumeInfo.publishedDate?.split("-")[0] || "Unknown Year",
            cover_i: item.volumeInfo.imageLinks?.thumbnail,
          }))
        : [];
      if (books.length === 0 && !retry) {
        return fetchBookRecommendations(genre, true);
      }
      return books;
    } catch (error) {
      setError("Failed to fetch book recommendations. Please try again later.");
      return [];
    } finally {
      setLoadingBooks(false);
    }
  };

  const saveChatSession = async () => {
    try {
      const sessionId = `${user.uid}_${Date.now()}`;
      const sessionDocRef = doc(db, "chatSessions", sessionId);
      await setDoc(sessionDocRef, {
        userId: user.uid,
        chatHistory: messages,
        detectedEmotion: currentEmotion,
        responses,
        timestamp: serverTimestamp(),
        recommendations: {
          movies: movieRecommendations,
          music: musicRecommendations,
          books: bookRecommendations,
        },
      });
    } catch (error) {
      setError("Failed to save your chat session. Please try again.");
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
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: messageText,
    };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setLoading(true);
    setMessageCount((prev) => prev + 1);
    if (!customQuestion && !isEmotionRelated(messageText)) {
      const nonEmotionMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "I’m here to support your mental wellness, so I can’t assist with that question. Instead, let’s focus on you—how are you feeling today? Maybe there’s something on your mind you’d like to share, or I can suggest some calming activities to lift your spirits! 😊",
        showButtons: false,
      };
      setMessages((prev) => [...prev, nonEmotionMessage]);
      setLoading(false);
      return;
    }
    const detectedEmotion = detectEmotion(messageText);
    if (detectedEmotion) {
      setCurrentEmotion(detectedEmotion);
      setFixedGenre(emotionToGenreMap[detectedEmotion]?.music || "pop");
      setEmotionDetected(true);
      setResponses((prev) => ({ ...prev, feeling: detectedEmotion }));
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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: botReply,
        showButtons: emotionDetected || detectedEmotion !== null,
      };
      setMessages((prev) => [...prev, aiMessage]);
      if ((detectedEmotion && !emotionDetected) || messageCount >= 2) {
        await saveChatSession();
        if (onCheckInComplete) {
          onCheckInComplete(responses);
        }
      }
    } catch (error) {
      const errorMessage = {
        sender: "MindMosaic AI",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    const genre = emotionToGenreMap[emotion]?.music || "pop";
    if (type === "movie") {
      setLoadingMovies(true);
      const movieGenre = emotionToGenreMap[emotion]?.movie || "Action";
      try {
        const movieData = await fetchMovieRecommendations(movieGenre);
        setMovieRecommendations(movieData);
        setShowMovieRecommendations(true);
        const movieMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Based on your ${emotion} mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, here are some ${movieGenre} movie recommendations:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, movieMessage]);
      } catch (error) {
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `I'd like to recommend some ${movieGenre} movies based on your mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, but I'm having trouble accessing them right now. Would you like to try again later?`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoadingMovies(false);
      }
    } else if (type === "music") {
      setLoadingMusic(true);
      try {
        const musicData = await fetchMusicRecommendations(genre, emotion);
        setMusicRecommendations(musicData);
        setShowMusicRecommendations(true);
        const musicMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Based on your ${emotion} mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, here are some ${genre.replace("_", "-")} music recommendations:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, musicMessage]);
      } catch (error) {
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `I'd like to recommend some ${genre.replace("_", "-")} music based on your mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, but I'm having trouble accessing them right now. Would you like to try again later?`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoadingMusic(false);
      }
    } else if (type === "book") {
      setLoadingBooks(true);
      const bookGenre = emotionToGenreMap[emotion]?.book || "bestsellers";
      try {
        const bookData = await fetchBookRecommendations(bookGenre);
        setBookRecommendations(bookData);
        setShowBookRecommendations(true);
        const bookMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Based on your ${emotion} mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, here are some ${bookGenre} book recommendations:`,
          showButtons: true,
        };
        setMessages((prev) => [...prev, bookMessage]);
      } catch (error) {
        const errorMessage = {
          sender: "MindMosaic AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `I'd like to recommend some ${bookGenre} books based on your mood ${emotionToGenreMap[emotion]?.emoji || "😶"}, but I'm having trouble accessing them right now. Would you like to try again later?`,
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
        darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800 border-gray-100"
      }`}
    >
      {error && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
          }`}
        >
          {error}
        </div>
      )}
      <h1
        className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}
      >
        Hi, {user.displayName}
      </h1>
      <div className="w-full">
        <div
          className={`border rounded-lg p-4 mb-4 h-[550px] flex flex-col transition-all duration-300 ${
            darkMode ? "bg-gray-900 border-gray-600" : "bg-gray-50 border-gray-600"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}
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
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                >
                  {msg.sender} - {msg.time}
                </p>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sender === "MindMosaic AI" && msg.showButtons && (
                  <div className="mt-3 flex space-x-2 justify-start">
                    <button
                      onClick={() => handleRecommendationClick("movie")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      🎬 Movie
                    </button>
                    <button
                      onClick={() => handleRecommendationClick("music")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      🎵 Music
                    </button>
                    <button
                      onClick={() => handleRecommendationClick("book")}
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        darkMode ? "bg-purple-500 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-700"
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
                    darkMode ? "border-t-violet-400" : "border-t-violet-500"
                  }`}
                ></div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
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
                <p className={`text-sm mb-2 font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Movie Recommendations Based on Your Mood
                </p>
                {loadingMovies ? (
                  <div className="flex items-center space-x-2 py-2">
                    <div
                      className={`w-4 h-4 border-2 rounded-full animate-spin ${
                        darkMode ? "border-t-blue-400" : "border-t-blue-500"
                      }`}
                    ></div>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Loading recommendations...
                    </p>
                  </div>
                ) : movieRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {movieRecommendations.map((movie, idx) => (
                      <div
                        key={movie.id || idx}
                        className={`p-2 rounded border ${
                          darkMode ? "bg-gray-700 border-gray-500" : "bg-white border-gray-300"
                        }`}
                      >
                        <div className="aspect-w-3 aspect-h-4 mb-2">
                          {movie.primaryImage ? (
                            <img
                              src={movie.primaryImage}
                              alt={movie.primaryTitle || "Movie poster"}
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/240x360";
                              }}
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{movie.primaryTitle || "Unknown Title"}</h3>
                        <p className="text-xs mt-1">
                          {movie.description?.substring(0, 50) || "No description available"}
                          {movie.description?.length > 50 ? "..." : ""}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-xs ml-1">{movie.averageRating || "N/A"}</span>
                          <span className="text-xs ml-auto">{movie.startYear || "Unknown year"}</span>
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
                      darkMode ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    Close Recommendations
                  </button>
                </div>
              </div>
            )}
            {showMusicRecommendations && (
              <div
                className={`rounded-lg p-3 border-2 ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
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
                      className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
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
                        <h3 className="font-bold text-sm">{track.name || "Unknown Track"}</h3>
                        <p className="text-xs mt-1">{track.artist || "Unknown Artist"}</p>
                        {track.album && <p className="text-xs">{track.album}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic">
                    Unable to load music recommendations. Please try again.
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowMusicRecommendations(false)}
                    className={`px-3 py-1 rounded-full text-xs text-white ${
                      darkMode ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    Close Recommendations
                  </button>
                </div>
              </div>
            )}
            {showBookRecommendations && (
              <div
                className={`rounded-lg p-3 border-2 ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}
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
                      className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
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
                              src={book.cover_i}
                              alt={book.title || "Book cover"}
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/240x360";
                              }}
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-300 rounded flex items-center justify-center text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm">{book.title || "Unknown Title"}</h3>
                        <p className="text-xs mt-1">
                          {book.author_name?.join(", ") || "Unknown Author"}
                        </p>
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
                      darkMode ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-400 hover:bg-gray-500"
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
          className={`border rounded-lg p-2 flex items-center ${
            darkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
          }`}
        >
          <input
            type="text"
            placeholder="Type your message here..."
            className={`flex-1 bg-transparent border-none focus:outline-none px-3 py-2 ${
              darkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800 placeholder-gray-500"
            }`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading}
            className={`ml-2 rounded-full p-3 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : darkMode
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-purple-600 hover:bg-purple-700"
            } transition-colors duration-200`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9 22 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;