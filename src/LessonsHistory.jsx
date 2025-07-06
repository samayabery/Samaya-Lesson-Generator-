import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Download, Sparkles, BookOpen, Feather, Home, HelpCircle } from "lucide-react";

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
    const title = match ? match[1].trim() : `Adventures in Learning`;
    return { content, createdAt, title: `Lesson Plan ${idx + 1}: ${title}`, worksheet };
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
          bg: 'bg-gradient-to-br from-orange-500 to-red-500',
          textColor: 'text-white',
          icon: '🎯',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'OBJECTIVE': {
          bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          textColor: 'text-orange-800',
          icon: '🎯',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'CONCEPT COVERED': {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          textColor: 'text-amber-800',
          icon: '💡',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-100'
        },
        'ICEBREAKER': {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50',
          textColor: 'text-orange-800',
          icon: '🎉',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'SYNOPSIS': {
          bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          textColor: 'text-yellow-800',
          icon: '📖',
          borderColor: 'border-yellow-200',
          shadowColor: 'shadow-yellow-100'
        },
        'READ ALOUD': {
          bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
          textColor: 'text-orange-800',
          icon: '📚',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'EXPLICIT COMPREHENSION': {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          textColor: 'text-amber-800',
          icon: '❓',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-100'
        },
        'IMPLICIT COMPREHENSION': {
          bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
          textColor: 'text-yellow-800',
          icon: '🤔',
          borderColor: 'border-yellow-200',
          shadowColor: 'shadow-yellow-100'
        },
        'VOCABULARY': {
          bg: 'bg-gradient-to-br from-orange-50 to-red-50',
          textColor: 'text-orange-800',
          icon: '📝',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        },
        'GRAMMAR': {
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
          textColor: 'text-amber-800',
          icon: '⚡',
          borderColor: 'border-amber-200',
          shadowColor: 'shadow-amber-100'
        },
        'CREATIVE ASSIGNMENT': {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          textColor: 'text-yellow-800',
          icon: '🎨',
          borderColor: 'border-yellow-200',
          shadowColor: 'shadow-yellow-100'
        },
        'RELATED MATERIALS': {
          bg: 'bg-gradient-to-br from-orange-50 to-yellow-50',
          textColor: 'text-orange-800',
          icon: '📋',
          borderColor: 'border-orange-200',
          shadowColor: 'shadow-orange-100'
        }
      };

      const config = sectionConfig[sectionType] || sectionConfig['RELATED MATERIALS'];
      const isMainTitle = sectionType === 'SESSION TITLE';
      
      return (
        <div key={index} className={`mb-6 rounded-xl border ${config.borderColor} ${config.shadowColor} shadow-lg overflow-hidden transition-all duration-300`}>
          {/* Section Header */}
          <div className={`${isMainTitle ? config.bg : 'bg-white border-b ' + config.borderColor} p-4`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{config.icon}</span>
              <h3 className={`text-lg font-bold ${isMainTitle ? config.textColor : 'text-gray-900'}`}>
                {title}
              </h3>
            </div>
          </div>
          
          {/* Section Content */}
          <div className={`${config.bg} p-4`}>
            <div className="space-y-2">
              {content.map((line, idx) => renderContentLine(line, idx, sectionType, config))}
            </div>
          </div>
        </div>
      );
    };

    const renderContentLine = (line, index, sectionType, config) => {
      if (!line.trim()) return null;
      
      // Check for sub-headings (lines that start with capital letters and seem like headings)
      if (line.match(/^[A-Z][A-Z\s]+:/) || line.match(/^[A-Z][^.]*:$/)) {
        return (
          <div key={index} className="mt-4 mb-2">
            <h4 className={`font-bold text-base ${config.textColor}`}>
              {line.replace(/\*+/g, '').trim()}
            </h4>
          </div>
        );
      }
      
      // Regular content lines
      return (
        <div key={index} className={`text-sm ${config.textColor} leading-relaxed`}>
          {line.replace(/\*+/g, '').trim()}
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Loader2 className="animate-spin text-orange-500 mx-auto mb-4" size={48} />
            <p className="text-gray-700 font-medium">Processing your request...</p>
          </div>
        </div>
      )}
      
      {/* Home Button */}
      

      {/* Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center group"
          onClick={() => alert('Help functionality coming soon!')}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Generated Lessons</h1>
          <p className="text-lg text-gray-600">Your personalized lesson plans and resources</p>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No lessons generated yet. Create your first lesson!</p>
            <button 
              onClick={() => navigate('/details')}
              className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium"
            >
              Create Lesson Plan
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lesson List Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Plans</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {lessons.map((lesson, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                        selectedIndex === index
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-orange-300 shadow-lg'
                          : 'bg-gray-50 hover:bg-orange-50 border-gray-200 text-gray-700 hover:border-orange-200'
                      }`}
                    >
                      <div className="font-medium text-sm">{lesson.title}</div>
                      {lesson.createdAt && (
                        <div className={`text-xs mt-1 ${selectedIndex === index ? 'text-orange-100' : 'text-gray-500'}`}>
                          {lesson.createdAt.toLocaleDateString()}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-orange-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{lessons[selectedIndex]?.title}</h2>
                      {lessons[selectedIndex]?.createdAt && (
                        <p className="text-orange-100 text-sm mt-1">
                          Created: {lessons[selectedIndex].createdAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateWorksheet(selectedIndex)}
                        disabled={isGeneratingWorksheet}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isGeneratingWorksheet ? 'Generating...' : 'Generate Worksheet'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(selectedIndex)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-screen overflow-y-auto">
                  <div className="space-y-4">
                    {formatLessonContent(lessons[selectedIndex]?.content)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
