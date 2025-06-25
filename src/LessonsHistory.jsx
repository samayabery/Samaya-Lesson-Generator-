import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Download, Sparkles, BookOpen, Feather } from "lucide-react";

export default function LessonsHistory() {
  const [uid, setUid] = useState(null);
  const [rawLessons, setRawLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [pendingRevision, setPendingRevision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingWorksheet, setIsGeneratingWorksheet] = useState(false);
  const [error, setError] = useState(null);
  const [worksheets, setWorksheets] = useState({});
  const navigate = useNavigate();

  // Story and poem suggestions
  const storyPoetryLibrary = {
    stories: [
      { title: "The Very Hungry Caterpillar", author: "Eric Carle", theme: "Growth & Change", level: "1-3" },
      { title: "Where the Wild Things Are", author: "Maurice Sendak", theme: "Imagination", level: "2-4" },
      { title: "The Giving Tree", author: "Shel Silverstein", theme: "Friendship", level: "3-5" },
      { title: "Corduroy", author: "Don Freeman", theme: "Friendship", level: "2-4" },
      { title: "The Rainbow Fish", author: "Marcus Pfister", theme: "Sharing", level: "2-4" },
      { title: "Brown Bear, Brown Bear", author: "Bill Martin Jr.", theme: "Colors & Animals", level: "1-2" },
      { title: "Chicka Chicka Boom Boom", author: "Bill Martin Jr.", theme: "Alphabet", level: "1-3" },
      { title: "The Cat in the Hat", author: "Dr. Seuss", theme: "Fun & Mischief", level: "2-4" },
    ],
    poems: [
      { title: "Twinkle, Twinkle, Little Star", type: "Classic Nursery Rhyme", theme: "Wonder", level: "1-2" },
      { title: "Hickory Dickory Dock", type: "Nursery Rhyme", theme: "Time", level: "1-2" },
      { title: "The Itsy Bitsy Spider", type: "Action Rhyme", theme: "Perseverance", level: "1-3" },
      { title: "Humpty Dumpty", type: "Nursery Rhyme", theme: "Consequences", level: "1-3" },
      { title: "If I Were Not Upon the Stage", type: "Silly Poem", theme: "Imagination", level: "3-5" },
      { title: "The Owl and the Pussycat", type: "Nonsense Poem", theme: "Adventure", level: "3-5" },
      { title: "Rain, Rain, Go Away", type: "Weather Rhyme", theme: "Weather", level: "1-2" },
      { title: "Five Little Ducks", type: "Counting Rhyme", theme: "Numbers", level: "1-3" },
    ]
  };

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchLessons(user.uid);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const normalized = rawLessons.map((item, idx) => parseLesson(item, idx));
    setLessons(normalized);
    if (normalized.length > 0) setSelectedIndex(0);
  }, [rawLessons]);

  const parseLesson = (item, idx) => {
    let content;
    let createdAt = null;
    let worksheet = null;
    if (typeof item === 'string') {
      content = item;
    } else {
      content = item.content;
      createdAt = item.createdAt?.toDate() || null;
      worksheet = item.worksheet || null;
    }
    const match = content.match(/SESSION TITLE:\s*(.+)/i);
    const title = match ? match[1].trim() : `Lesson ${idx + 1}`;
    return { content, createdAt, title, worksheet };
  };

  const fetchLessons = async (userId) => {
    try {
      const docRef = doc(db, 'InputDetails', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setRawLessons(data.lessons_generated || []);
        setWorksheets(data.worksheets || {});
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  // Enhanced content formatting with elegant design and sophisticated layout
  const formatLessonContent = (content) => {
    if (!content) return "";
    
    const lines = content.split('\n');
    let formattedContent = [];
    let currentSection = '';
    let sectionContent = [];
    
    const renderSection = (sectionType, title, content, index) => {
      const sectionConfig = {
        'SESSION TITLE': {
          bg: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
          textColor: 'text-white',
          icon: '🎯',
          borderColor: 'border-indigo-200',
          shadowColor: 'shadow-indigo-100'
        },
        'OBJECTIVE': {
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
          textColor: 'text-emerald-800',
          icon: '🎯',
          borderColor: 'border-emerald-200',
          shadowColor: 'shadow-emerald-100'
        },
        'CONCEPT COVERED': {
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          textColor: 'text-amber-800',
          icon: '💡',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-100'
        },
        'ICEBREAKER': {
          bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
          textColor: 'text-rose-800',
          icon: '🎉',
          borderColor: 'border-rose-200',
          shadowColor: 'shadow-rose-100'
        },
        'SYNOPSIS': {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          textColor: 'text-blue-800',
          icon: '📖',
          borderColor: 'border-blue-200',
          shadowColor: 'shadow-blue-100'
        },
        'READ ALOUD': {
          bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
          textColor: 'text-purple-800',
          icon: '📚',
          borderColor: 'border-purple-200',
          shadowColor: 'shadow-purple-100'
        },
        'EXPLICIT COMPREHENSION': {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          textColor: 'text-yellow-800',
          icon: '❓',
          borderColor: 'border-yellow-200',
          shadowColor: 'shadow-yellow-100'
        },
        'IMPLICIT COMPREHENSION': {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50',
          textColor: 'text-orange-800',
          icon: '🤔',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'VOCABULARY': {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          textColor: 'text-green-800',
          icon: '📝',
          borderColor: 'border-green-200',
          shadowColor: 'shadow-green-100'
        },
        'GRAMMAR': {
          bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
          textColor: 'text-indigo-800',
          icon: '⚡',
          borderColor: 'border-indigo-200',
          shadowColor: 'shadow-indigo-100'
        },
        'CREATIVE ASSIGNMENT': {
          bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
          textColor: 'text-pink-800',
          icon: '🎨',
          borderColor: 'border-pink-200',
          shadowColor: 'shadow-pink-100'
        },
        'RELATED MATERIALS': {
          bg: 'bg-gradient-to-br from-slate-50 to-gray-50',
          textColor: 'text-slate-800',
          icon: '📋',
          borderColor: 'border-slate-200',
          shadowColor: 'shadow-slate-100'
        }
      };

      const config = sectionConfig[sectionType] || sectionConfig['RELATED MATERIALS'];
      const isMainTitle = sectionType === 'SESSION TITLE';
      
      return (
        <div key={index} className={`mb-8 rounded-2xl border ${config.borderColor} ${config.shadowColor} shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300`}>
          {/* Section Header */}
          <div className={`${isMainTitle ? config.bg : 'bg-white border-b ' + config.borderColor} p-6`}>
            <div className="flex items-center space-x-3">
              <div className={`${isMainTitle ? 'bg-white/20' : config.bg} rounded-full w-12 h-12 flex items-center justify-center text-2xl`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${isMainTitle ? 'text-white' : config.textColor} tracking-wide`}>
                  {title}
                </h3>
                {isMainTitle && (
                  <p className="text-white/80 text-sm mt-1">Session Overview</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Section Content */}
          <div className={`${config.bg} p-6`}>
            <div className="space-y-4">
              {content.map((line, lineIndex) => renderContentLine(line, lineIndex, sectionType, config))}
            </div>
          </div>
        </div>
      );
    };

    const renderContentLine = (line, index, sectionType, config) => {
      if (!line.trim()) return <div key={index} className="h-2"></div>;
      
      // Questions and Answers
      if (line.startsWith('Q.') || line.startsWith('A.') || line.match(/^Q\d+\./)) {
        return (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-l-4 border-yellow-400 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 rounded-full w-8 h-8 flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0 mt-0.5">
                {line.startsWith('Q') ? 'Q' : 'A'}
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">{line}</p>
            </div>
          </div>
        );
      }
      
      // Poetry content
      if (line.toLowerCase().includes('poem') || line.toLowerCase().includes('verse') || line.toLowerCase().includes('rhyme')) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-xl p-5 border border-purple-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <Feather className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <p className="text-purple-800 font-medium italic leading-relaxed">{line}</p>
            </div>
          </div>
        );
      }
      
      // Story content (longer narrative text)
      if ((sectionType === 'SYNOPSIS' || sectionType === 'READ ALOUD') && line.trim().length > 50) {
        return (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-blue-200/50 shadow-sm">
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 leading-relaxed text-justify">{line}</p>
            </div>
          </div>
        );
      }
      
      // List items
      if (line.startsWith('*') || line.startsWith('-') || line.startsWith('•')) {
        return (
          <div key={index} className="flex items-start space-x-3 ml-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-2 h-2 mt-2.5 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{line.substring(1).trim()}</p>
          </div>
        );
      }
      
      // Regular content
      return (
        <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <p className="text-gray-800 leading-relaxed">{line}</p>
        </div>
      );
    };
    
    // Process content line by line
    lines.forEach((line, index) => {
      const sectionMatch = line.match(/^(SESSION TITLE|SESSION NUMBER|SESSION DURATION|DATE|OBJECTIVE|CONCEPT COVERED|LESSON FLOW|ICEBREAKER|SYNOPSIS|READ ALOUD|EXPLICIT COMPREHENSION|IMPLICIT COMPREHENSION|TASKS|VOCABULARY|GRAMMAR|CREATIVE ASSIGNMENT|RELATED MATERIALS):/i);
      
      if (sectionMatch) {
        // Render previous section if exists
        if (currentSection && sectionContent.length > 0) {
          formattedContent.push(renderSection(currentSection, currentSection, sectionContent, formattedContent.length));
        }
        
        // Start new section
        currentSection = sectionMatch[1].toUpperCase();
        sectionContent = [line];
      } else if (currentSection) {
        sectionContent.push(line);
      } else {
        // Content before any section headers
        formattedContent.push(
          <div key={index} className="mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <p className="text-gray-800 leading-relaxed">{line}</p>
          </div>
        );
      }
    });
    
    // Render final section
    if (currentSection && sectionContent.length > 0) {
      formattedContent.push(renderSection(currentSection, currentSection, sectionContent, formattedContent.length));
    }
    
    return formattedContent;
  };

  const generateWorksheet = async (lessonIndex) => {
    setIsGeneratingWorksheet(true);
    setError(null);
    
    const lesson = lessons[lessonIndex];
    const prompt = `
Create a printable worksheet for the following lesson plan. The worksheet should be age-appropriate and match the FLN levels mentioned in the lesson.

Lesson Content:
${lesson.content}

Please create a worksheet that includes:
1. A title matching the lesson theme
2. 3-5 vocabulary exercises (word matching, fill-in-the-blanks, etc.)
3. 2-3 comprehension questions
4. One creative activity (drawing space, word search, etc.)
5. Clear instructions for each section

Format the worksheet in a printable layout with clear sections and appropriate spacing.
`;

    try {
      const apiKey = import.meta.env.VITE_GPT_KEY;
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ 
          model: 'gpt-4-turbo', 
          messages: [{ role: 'user', content: prompt }] 
        })
      });
      
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const worksheetContent = data.choices[0].message.content;
      
      // Save worksheet to Firebase
      const docRef = doc(db, 'InputDetails', uid);
      const worksheetKey = `lesson_${lessonIndex}`;
      
      await updateDoc(docRef, {
        [`worksheets.${worksheetKey}`]: {
          content: worksheetContent,
          createdAt: new Date(),
          lessonTitle: lesson.title
        }
      });
      
      // Update local state
      setWorksheets(prev => ({
        ...prev,
        [worksheetKey]: {
          content: worksheetContent,
          createdAt: new Date(),
          lessonTitle: lesson.title
        }
      }));
      
      setIsGeneratingWorksheet(false);
    } catch (error) {
      console.error('Error generating worksheet:', error);
      setError(error.message || 'Failed to generate worksheet.');
      setIsGeneratingWorksheet(false);
    }
  };

  const downloadWorksheet = (lessonIndex) => {
    const worksheetKey = `lesson_${lessonIndex}`;
    const worksheet = worksheets[worksheetKey];
    
    if (!worksheet) return;
    
    const blob = new Blob([worksheet.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Worksheet_${worksheet.lessonTitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmitFeedback = async () => {
    setIsLoading(true);
    setError(null);
    const original = lessons[selectedIndex].content;
    const prompt = `
Revise the following lesson plan based on the user feedback.

Original Lesson Plan:
${original}

Feedback:
${feedbackText}
    `;
    try {
      const apiKey = import.meta.env.VITE_GPT_KEY;
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: 'gpt-4-turbo', messages: [{ role: 'user', content: prompt }] })
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const revised = data.choices[0].message.content;
      setPendingRevision({ content: revised });
      setIsLoading(false);
    } catch (error) {
      console.error('Error requesting revision:', error);
      setError(error.message || 'Failed to get revised lesson.');
      setIsLoading(false);
    }
  };

  const acceptRevision = async () => {
    if (!pendingRevision) return;
    try {
      setIsLoading(true);
      setError(null);
      const docRef = doc(db, 'InputDetails', uid);
      
      // Create a new Date object for the timestamp instead of using serverTimestamp()
      const timestamp = new Date();
      
      await updateDoc(docRef, {
        lessons_generated: arrayUnion({ 
          content: pendingRevision.content, 
          createdAt: timestamp 
        })
      });
      
      setRawLessons(prev => [...prev, { 
        content: pendingRevision.content, 
        createdAt: { toDate: () => timestamp } 
      }]);
      
      setPendingRevision(null);
      setShowFeedbackForm(false);
      setFeedbackText("");
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving accepted revision:', error);
      setError(error.message || 'Failed to save revision.');
      setIsLoading(false);
    }
  };

  const rejectRevision = () => {
    setPendingRevision(null);
    setShowFeedbackForm(true);
    setError(null);
  };

  const handleDelete = async (idx) => {
    const toDelete = rawLessons[idx];
    try {
      setIsLoading(true);
      setError(null);
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, { lessons_generated: arrayRemove(toDelete) });
      fetchLessons(uid);
      setSelectedIndex(prev => Math.max(0, prev - 1));
      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setError(error.message || 'Failed to delete lesson.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-6">
      {(isLoading || isGeneratingWorksheet) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center bg-white rounded-lg p-8 shadow-2xl">
            <Loader2 className="animate-spin text-indigo-500 mx-auto" size={64} />
            <p className="mt-4 text-gray-700 font-medium">
              {isGeneratingWorksheet ? 'Generating worksheet...' : 'Generating revised lesson plan...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <h2 className="text-center text-4xl font-extrabold mb-2 flex items-center justify-center">
            <BookOpen className="mr-4" size={40} />
            Lesson History
          </h2>
          <p className="text-center text-indigo-100">Interactive lesson plans with enhanced formatting</p>
        </div>
        
        <div className="p-8">
          {/* Lesson Tabs */}
          {lessons.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {lessons.map((l, idx) => (
                <button
                  key={idx}
                  onClick={() => { 
                    setSelectedIndex(idx); 
                    setShowFeedbackForm(false); 
                    setPendingRevision(null); 
                    setFeedbackText(""); 
                  }}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedIndex === idx
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {l.title}
                    {l.createdAt && (
                      <span className="ml-2 text-xs opacity-75">
                        {l.createdAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Main Content */}
          {lessons[selectedIndex] ? (
            <div className="space-y-6">
              {/* Story & Poem Suggestions */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-pink-700 flex items-center">
                    <BookOpen className="mr-2" size={24} />
                    Story & Poem Library
                  </h3>
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {showSuggestions ? 'Hide' : 'Show'} Suggestions
                  </button>
                </div>
                
                {showSuggestions && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Stories */}
                    <div className="bg-white rounded-xl p-4 border border-pink-100">
                      <h4 className="font-bold text-pink-600 mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Recommended Stories
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {storyPoetryLibrary.stories.map((story, idx) => (
                          <div key={idx} className="p-3 bg-pink-25 rounded-lg border border-pink-100 hover:bg-pink-50 transition">
                            <div className="font-semibold text-pink-800 text-sm">{story.title}</div>
                            <div className="text-pink-600 text-xs">by {story.author}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                                Level {story.level}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                {story.theme}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Poems */}
                    <div className="bg-white rounded-xl p-4 border border-pink-100">
                      <h4 className="font-bold text-pink-600 mb-3 flex items-center">
                        <Feather className="w-5 h-5 mr-2" />
                        Recommended Poems & Rhymes
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {storyPoetryLibrary.poems.map((poem, idx) => (
                          <div key={idx} className="p-3 bg-purple-25 rounded-lg border border-purple-100 hover:bg-purple-50 transition">
                            <div className="font-semibold text-purple-800 text-sm">{poem.title}</div>
                            <div className="text-purple-600 text-xs">{poem.type}</div>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                Level {poem.level}
                              </span>
                              <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                                {poem.theme}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                  <p className="text-sm text-pink-700 text-center">
                    💡 <strong>Tip:</strong> Use these curated stories and poems as inspiration for your lessons. 
                    They're organized by reading level and theme to match your students' needs!
                  </p>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                {/* Lesson Header Banner */}
                <div className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 p-8 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold tracking-wide">Lesson Plan</h2>
                          <p className="text-white/80 text-lg mt-1">
                            {lessons[selectedIndex].title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                          <p className="text-white/90 text-sm font-medium">
                            {lessons[selectedIndex].createdAt 
                              ? lessons[selectedIndex].createdAt.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'Draft Session'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                </div>
                
                {/* Lesson Content Body */}
                <div className="p-8 bg-gradient-to-br from-white via-gray-50/30 to-slate-50/50">
                  {/* Lesson Structure Overview */}
                  <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2 mr-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      Lesson Structure
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: '🎯', label: 'Objectives', color: 'from-emerald-400 to-teal-400' },
                        { icon: '📖', label: 'Content', color: 'from-blue-400 to-cyan-400' },
                        { icon: '🎨', label: 'Activities', color: 'from-pink-400 to-rose-400' },
                        { icon: '📝', label: 'Assessment', color: 'from-orange-400 to-amber-400' }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-4 bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-100/50 hover:shadow-md transition-all duration-200">
                          <div className={`bg-gradient-to-r ${item.color} rounded-full w-12 h-12 flex items-center justify-center text-xl mx-auto mb-2 shadow-sm`}>
                            {item.icon}
                          </div>
                          <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="max-w-none">
                    {formatLessonContent(lessons[selectedIndex].content)}
                  </div>
                  
                  {/* Session Summary Footer */}
                  <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 rounded-full p-3">
                          <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-indigo-800">Session Complete</h4>
                          <p className="text-indigo-600 text-sm">Ready for implementation</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-indigo-600">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Structured</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Age-Appropriate</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>Engaging</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Worksheet Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                  <FileText className="mr-2" size={24} />
                  Worksheet for this Lesson
                </h3>
                
                {worksheets[`lesson_${selectedIndex}`] ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-600 mb-2">Available Worksheet</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Generated on: {new Date(worksheets[`lesson_${selectedIndex}`].createdAt).toLocaleDateString()}
                      </p>
                      
                      {/* Worksheet Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                        <h5 className="font-medium text-gray-700 mb-2">Preview:</h5>
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">
                          {worksheets[`lesson_${selectedIndex}`].content.substring(0, 200)}...
                        </pre>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => downloadWorksheet(selectedIndex)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Worksheet
                        </button>
                        <button
                          onClick={() => generateWorksheet(selectedIndex)}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          disabled={isGeneratingWorksheet}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {isGeneratingWorksheet ? 'Generating...' : 'Regenerate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-700 mb-2">Create a Custom Worksheet</h4>
                    <p className="text-green-600 mb-6 max-w-md mx-auto">
                      Generate a personalized worksheet that perfectly matches this lesson plan and your students' FLN levels
                    </p>
                    <button
                      onClick={() => generateWorksheet(selectedIndex)}
                      className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition mx-auto transform hover:scale-105 shadow-lg"
                      disabled={isGeneratingWorksheet}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isGeneratingWorksheet ? 'Creating Worksheet...' : 'Generate Worksheet'}
                    </button>
                  </div>
                )}
                
                {/* Worksheet Features */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-green-600 font-semibold text-sm">📝</div>
                    <div className="text-xs text-green-700">Vocabulary Exercises</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-green-600 font-semibold text-sm">🧩</div>
                    <div className="text-xs text-green-700">Comprehension Questions</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-green-600 font-semibold text-sm">🎨</div>
                    <div className="text-xs text-green-700">Creative Activities</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-green-600 font-semibold text-sm">📊</div>
                    <div className="text-xs text-green-700">FLN Level Matched</div>
                  </div>
                </div>
              </div>
              
              {/* Feedback Form */}
              {showFeedbackForm && !pendingRevision && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
                    <Feather className="mr-2" size={24} />
                    Provide Your Feedback
                  </h3>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 h-32 mb-4 resize-none"
                    placeholder="What changes would you like to make to this lesson plan? Be specific about improvements..."
                  ></textarea>
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      {error}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button 
                      onClick={handleSubmitFeedback} 
                      className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                      disabled={!feedbackText.trim() || isLoading}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </button>
                    <button 
                      onClick={() => {setShowFeedbackForm(false); setError(null);}} 
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {/* Revision Preview */}
              {pendingRevision && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    <Sparkles className="mr-2" size={24} />
                    Proposed Revision
                  </h3>
                  <div className="bg-white rounded-xl p-6 mb-4 border border-blue-100">
                    <div className="prose max-w-none">
                      {formatLessonContent(pendingRevision.content)}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={acceptRevision} 
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Accept Revision
                    </button>
                    <button 
                      onClick={rejectRevision} 
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                      Request More Changes
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              {!pendingRevision && !showFeedbackForm && (
                <div className="flex gap-4 justify-end bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <button
                    onClick={() => handleDelete(selectedIndex)}
                    className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105"
                  >
                    <span className="mr-2">🗑️</span>
                    Delete Plan
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition transform hover:scale-105"
                  >
                    <Feather className="w-4 h-4 mr-2" />
                    Give Feedback
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-500 mb-4">No lessons generated yet</p>
              <p className="text-gray-400">Create your first lesson to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
