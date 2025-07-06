import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, FileText, FilePlus, Pencil, Mic, Clock, Layers, LayoutList, Text, Info, Loader2, Home, HelpCircle } from "lucide-react";

export default function LessonPlanForm() {
  const apiKey = import.meta.env.VITE_GPT_KEY;
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const [formData, setFormData] = useState({
    grade: "2nd Grade", // Default value to prevent empty selection
    reading: 3,
    writing: 3,
    listening: 3,
    speaking: 3,
    duration: "",
    lessons: "",
    contentType: "Fiction",
    theme: "Friendship, Family, and Community", // Default value to prevent empty selection
    interactivity: 3,
    objectives: "",
    assessment: null,
  });

  const [uid, setUid] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [generatedLessons, setGeneratedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const navigate = useNavigate();

  // Save GPT response to Firestore
  async function saveGptResponse(userId, gptResponseContent) {
    try {
      const userDocRef = doc(db, "InputDetails", userId);
      
      // Check if document exists first
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userDocRef, {
          lessons_generated: [gptResponseContent]
        });
      } else {
        // Update if document exists
        await updateDoc(userDocRef, {
          lessons_generated: arrayUnion(gptResponseContent)
        });
      }

      console.log("GPT response saved successfully!");
      navigate('/lessons', { state: { selected: previousCount } });
      
    } catch (error) {
      console.error("Error saving GPT response: ", error);
      alert("Failed to save lesson plan to database.");
    }
  }

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchUserDetails(user.uid);
      } else {
        setUid(null);
        // Redirect to login if not authenticated
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch user details from Firestore
  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "InputDetails", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        // Only update form fields that exist in the data
        const updatedData = {};
        Object.keys(formData).forEach(key => {
          if (data[key] !== undefined) {
            updatedData[key] = data[key];
          }
        });
        
        if (Object.keys(updatedData).length > 0) {
          setFormData(prevData => ({...prevData, ...updatedData}));
        }
        
        // Set the generated lessons if they exist
        if (data.lessons_generated && Array.isArray(data.lessons_generated)) {
          setGeneratedLessons(data.lessons_generated);
          setPreviousCount(data.lessons_generated.length);
        }
      }
    } catch (error) {
      console.error("Error fetching details: ", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Form validation
    if (!formData.grade || !formData.duration || !formData.lessons || !formData.theme) {
      alert("Please fill out all required fields (Grade, Duration, Number of Lessons, and Theme)");
      return;
    }
    
    if (!uid) {
      alert("You must be logged in to submit details.");
      navigate('/login');
      return;
    }

    // Create prompt for GPT
    const prompt = `
    You are an expert educationist trained in early literacy, child development, curriculum design, and inclusive pedagogy. You design high-caliber, level-appropriate, and emotionally engaging lesson plans for Grades 3–5 students in Indian government schools.
Your goal is to generate a resource-conscious, foundational literacy-based lesson plan based on:
A selected theme (e.g., friendship, self-confidence, kindness)


FLN student levels (1–5) across reading, writing, listening, and speaking


A list of age-appropriate written pieces provided by the user (see below)


Use the FLN Rubric to match the tasks and materials to the learner's developmental stage. Design a joyful and inclusive experience with multisensory activities, simple language, and accessible formats. Always aim to gently scaffold the student one level higher through guidance and encouragement.

📚 CURATED TEXTS LIST
(You will choose the most suitable one based on theme + FLN levels)
[INSERT CURATED LIST OF STORYBOOKS, POEMS, PICTURE BOOKS HERE]

📊 FLN ENGLISH ASSESSMENT RUBRIC (FOR GPT REFERENCE)
Use the following levels to determine the child's current literacy ability. All learning activities, language complexity, and worksheets must match these levels — while gently supporting growth to the next level.
LEVEL 1 – BEGINNER
Cannot consistently recognize or write English letters.


Needs full support and pre-literacy exposure.


Activities should focus on oral interaction, picture recognition, pre-writing strokes, and letter sounds.


LEVEL 2 – LETTER LEVEL
Can recognize, name, pronounce, and write at least 5–10 letters of the alphabet.


Can find letters in a word and write them in dictation.


Suitable tasks:


Letter tracing


Matching letters to pictures or words


Basic phonics games


LEVEL 3 – WORD LEVEL
Can read, write, and understand simple, familiar words (at least 5–10).


Can connect words to meaning or images.


Suitable tasks:


Word-picture match


Word-level dictation


Simple word fill-in-the-blanks


Basic word searches with 4–6 words


LEVEL 4 – SENTENCE LEVEL
Can read and write simple, complete sentences.


Can describe 3–5 sentence-long stories using pictures.


Suitable tasks:


Sentence tracing or completion


Picture-based sentence writing


Short comprehension with 1–2 sentence answers


LEVEL 5 – PARAGRAPH LEVEL
Can read 30+ words per minute with correct pronunciation.


Can summarize, explain, and write coherent short paragraphs.


Suitable tasks:


Short paragraph reading and retelling


Paragraph-based Q&A


Picture-description writing (4–5 sentences)


Open-ended prompts for paragraph writing
Design all lesson components to match these levels. Use the learner's current level to build confidence and offer light scaffolding toward the next stage.

📌 EXEMPLAR LESSON PLAN FOR STYLE, DEPTH & STRUCTURE
EXEMPLAR LESSON PLAN: THE GIVING TREE by SHEL SILVERSTEIN
SESSION NUMBER: 1
SESSION TITLE: A FRIENDSHIP LIKE NO OTHER—Today's book is a simply written, beautifully illustrated story about a unique friendship between a tree and a boy. 
SESSION DURATION: 1 HOUR
DATE: XYZ
OBJECTIVE: To encourage verbal and written expression, this session is designed to read a short story-book, and use a range of activities to assess comprehension and articulation.  
CONCEPT COVERED: FRIENDSHIP 
LESSON FLOW 
ICE BREAKER: A simple activity is used to create a comfortable atmosphere (students clap their hands or touch their heads, shoulders, knees and toes or just dance).
SYNOPSES OF WRITTEN PIECE: This is a beautiful story of a special friendship between a boy and a tree, and their journey through life.
READ ALOUD: By the session facilitator (Teacher or Volunteer)
EXPLICIT COMPREHENSION (For Listening, Understanding and Articulation through short questions based on FACTS - that which we know to be true)
Q. What is the relationship between the Tree and the Boy?
TREE: The young boy loves the tree - he makes a crown with the leaves, he climbs the trunk and swings from the branches, eats the apples, plays hide and seek and sleeps in her shade.
But as the boy grows up, he doesn't want to play. Instead, he wants money to buy things. 
Does the tree have money? No, but it has apples which the boy sells to get money. 
Does the tree have a house? No, but he gives he gives the boy branches to make a house.Does he have a boat? No, but he gives the boy his trunk to make a boat. 
And when the boy is old and returns to the tree, the tree has nothing left to give, so what does he do? He gives him his stump to sit on as hes tired and needs a quiet place to sit and rest.
The tree is happy to give all that she has to the boy as she loves the boy, This shows that the tree is ALTRUISTIC, as she gives without expecting anything in return)
IMPLICIT COMPREHENSION (For Listening, Understanding and Articulating through  discussion prompts on a central theme of the book, for expression of their OPINION - what they think of something, their viewpoint)
Q. Does the boy give the tree anything in return? Do you think the boy is SELFISH? If Yes or No, then WHY?
The young boy enjoys the tree but he doesnt harm it. He loves and respects her as she makes him happy.  
As a grown man, he becomes more greedy, and the relationship becomes more one-sided and destructive (he takes her apples, branches and trunk and when she has nothing to give, he goes away, leaving her feeling lonely).
And as an old man, when he is tired and doesn't need much more than a quiet place to sit and rest, he comes back to the tree, and is content to just sit on her stump - he appreciates the tree and all that she has given him, and the tree is happy once again!
TASKS
VOCABULARY BUILDING 
WORD BLAST - draw a huge apple on the board and divide it into two - TREE on one side and BOY on the other -discuss the character traits of both and have the students come up to write the words on the board - concept covered - ADJECTIVES (describing words)
TREE-Generous, Kind, Loving, Selfless, Sympathetic, Big-Hearted, Wise, Happy, Content, Lonely, Sad etc.  
BOY-Playful, Young, Happy Energetic, Enthusiastic, Impatient, Greedy, Selfish, Sad, Lonely etc.
SENTENCE MAKING - each student can be encouraged to make 5 sentences from the word blast to describe their friends.
CREATIVE ASSIGNMENT (Can be done at home) 
Title: Dear Tree, Thank You!
Activity: Students write a short letter (3 to 5 lines) or draw a picture thanking the tree for all that it gives them. They can include what they would give to the tree in return as a good friend. 
Encourage them to use some of the adjectives they learned in the "Word Blast" activity, reinforcing the idea of friendship and kindness. 

🛠️ FORMAT FOR LESSON OUTPUT (FOLLOW EXACTLY)
Structure the lesson plan using the format below. Ensure all instructions and materials are context-sensitive, using low-cost or handmade tools. Always prioritize simplicity, joy, participation, and literacy growth.
SESSION NUMBER:  
SESSION TITLE:  
SESSION DURATION:  
DATE:  
OBJECTIVE:  
CONCEPT COVERED:  
LESSON FLOW: 
* ICEBREAKER  
(Short game or discussion that activates prior knowledge or introduces the theme)

* SYNOPSIS OF WRITTEN PIECE  
(4–5 sentence summary of the chosen text using child-friendly language)

* READ ALOUD  
(Teacher-led, expressive reading with questions and gestures; include suggestions for shared reading if applicable)

* EXPLICIT COMPREHENSION  
(3–5 factual questions based on the story, with expected answers)

* TASKS (Choose 2–3 based on learner FLN levels; scaffold carefully)  
    * VOCABULARY  
    - 4–5 words from the text  
    - Child-friendly meanings  
    - Fun method for learning (flashcards, gestures, pictures, etc.)

    * GRAMMAR  
    - One grammar concept appropriate for the level (e.g., adjectives, action words)  
    - Include full activity (fill-ins, matching, etc.)

    * IMPLICIT COMPREHENSION  
    - Discussion questions linking story theme to real life  
    - Encourage all opinions, multiple languages if needed

    * WRITTEN TASK  
    - Tailor to writing level (e.g., tracing letters, fill-in-the-blank, sentence starters, guided paragraph writing)

    * CREATIVE ASSIGNMENT  
    - Drawing, speech, drama, or role-play based on the story/theme  
    - Suggest flexible, low-cost formats (paper folding, newspaper collages, etc.)

* RELATED MATERIALS  
- Flashcards, cut-outs, word/picture cards  
- Worksheets (CREATE 1–2 BASED ON FLN LEVELS – e.g., word search, fill-in-the-blank, letter tracing, sentence match)  
- Use only paper, pencil, crayons, and recycled items (no digital devices)


🧠 THINK LIKE THIS:
Design for a government school classrooms with limited materials


Keep instructions precise, culturally relevant, joyful


Support students AND teachers with clarity and structure


Use printable worksheet formats wherever possible


Ensure FLN levels shape every decision: complexity of story, word choice, writing expectations


    Educator Input Provided: \n${JSON.stringify(formData, null, 2)}`;
  
    try {
      // Save form data to Firestore first
      const dataToStore = { 
        ...formData, 
        assessment: formData.assessment?.name || "" 
      };
      
      await setDoc(doc(db, "InputDetails", uid), dataToStore, { merge: true });
      console.log("Firebase data saved successfully");
      
      // Then make the GPT API call
      try {
        setIsLoading(true);
        
        if (!apiKey) {
          throw new Error("API key is missing. Please check your environment variables.");
        }
        
        const response = await fetch(apiUrl, {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error: ${response.status} - ${response.statusText}. ${errorData}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        console.log("GPT Response received");
        
        // Save the current count of lessons before adding the new one
        setPreviousCount(generatedLessons.length);
        
        // Save the response to Firestore
        await saveGptResponse(uid, content);
        
        // Update local state with the new lesson
        setGeneratedLessons(prev => [...prev, content]);
        setGeneratedPlan(content);
        setIsLoading(false);
        
      } catch (error) {
        setIsLoading(false);
        console.error("Error submitting data to GPT:", error);
        alert(`Failed to get a response from GPT: ${error.message}`);
      }
  
    } catch (error) {
      console.error("Error saving lesson plan to Firebase: ", error);
      alert(`Failed to save lesson plan: ${error.message}`);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader2 className="animate-spin text-orange-500 mx-auto" size={64} />
            <p className="mt-4 text-white font-medium">Generating your lesson plan...</p>
          </div>
        </div>
      )}
      
     

      {/* Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center group"
          onClick={() => alert('Help functionality coming soon!')}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl p-10 bg-white rounded-2xl shadow-2xl border border-yellow-100">
          <h2 className="text-center text-5xl font-bold text-gray-900 mb-8">Lesson Plan Generator</h2>
          
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <label className="block flex items-center gap-2 font-medium text-gray-700"><BookOpen size={18} /> Grade being taught:</label>
            <select 
              value={formData.grade} 
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              {[ '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Assessment Rubric Info */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">FLN ENGLISH ASSESSMENT RUBRIC</h3>
            <div className="relative inline-block group">
              <Info className="w-6 h-6 text-orange-500 hover:text-orange-600 cursor-pointer" />
              <div className="absolute top-full right-0 mt-2 hidden group-hover:block z-50 w-[600px] max-h-[600px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-sm text-gray-800">
                <div className="mb-6">
                  <h4 className="font-semibold mb-1 text-gray-900">LEVEL 1: Beginner</h4>
                  <p className="text-gray-700">Student remains at the Beginner level until Letter-level tasks are completed.</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-1 text-gray-900">LEVEL 2: Letter Level</h4>
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">
                    <li>Read 5 or more letters out of 10 with correct pronunciation.</li>
                    <li>Identify letters from a group and write them properly.</li>
                    <li>Identify letters within a word and write them properly.</li>
                    <li>Read letters written by self.</li>
                    <li>Write 5 or more letters out of 10 in a dictation.</li>
                  </ul>
                  <p className="text-gray-700">If all tasks are completed, student is at the Letter level; otherwise, remains at Beginner level.</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-1 text-gray-900">LEVEL 3: Word Level</h4>
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">
                    <li>Read 5 or more words out of 10 with correct pronunciation.</li>
                    <li>Identify these words from a group.</li>
                    <li>Write these words correctly.</li>
                    <li>Understand and explain their meanings.</li>
                    <li>Read written words correctly.</li>
                    <li>Identify and speak 3–5 words after seeing a picture.</li>
                    <li>Dictate 5 words correctly.</li>
                  </ul>
                  <p className="text-gray-700">If all tasks are completed, student is at the Word level; otherwise, remains at Letter level.</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-1 text-gray-900">LEVEL 4: Sentence Level</h4>
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">
                    <li>Read sentences with correct pronunciation.</li>
                    <li>Write and read sentences again.</li>
                    <li>Articulate 3–5 sentences after seeing a picture.</li>
                    <li>Dictate 5 sentences correctly.</li>
                  </ul>
                  <p className="text-gray-700">If all tasks are completed, student is at the Sentence level; otherwise, remains at Word level.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">LEVEL 5: Short Paragraph Level</h4>
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">
                    <li>Read passages at 30 wpm with correct pronunciation.</li>
                    <li>Explain passages in own words.</li>
                    <li>Write and read 3 out of 5 dictated sentences correctly.</li>
                    <li>Speak and write sentences describing a picture.</li>
                  </ul>
                  <p className="text-gray-700">If all tasks are completed, student is at Paragraph level; otherwise, remains at Sentence level.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-1 gap-6 max-w-[600px]">
            <div className="mb-4">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><BookOpen size={18} /> Level of proficiency in reading:</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={formData.reading} 
                onChange={(e) => setFormData({ ...formData, reading: Number(e.target.value) })} 
                className="w-full accent-orange-500" 
              />
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><Pencil size={18} /> Level of proficiency in writing:</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={formData.writing} 
                onChange={(e) => setFormData({ ...formData, writing: Number(e.target.value) })} 
                className="w-full accent-orange-500" 
              />
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><FileText size={18} /> Level of proficiency in listening:</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={formData.listening} 
                onChange={(e) => setFormData({ ...formData, listening: Number(e.target.value) })} 
                className="w-full accent-orange-500" 
              />
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><Mic size={18} /> Level of proficiency in speaking:</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={formData.speaking} 
                onChange={(e) => setFormData({ ...formData, speaking: Number(e.target.value) })} 
                className="w-full accent-orange-500" 
              />
              <div className="flex justify-between text-xs mt-1 text-gray-600">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div className="mb-4 max-w-[600px]">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><Clock size={18} /> Duration of lesson (in minutes):</label>
              <input 
                type="number" 
                value={formData.duration} 
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                min="1"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
              />
            </div>

            <div className="mb-4 max-w-[600px]">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><Layers size={18} /> Number of lessons to generate:</label>
              <input 
                type="number" 
                value={formData.lessons}
                onChange={(e) => setFormData({ ...formData, lessons: e.target.value })} 
                min="1"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
              />
            </div>
            
            <div className="mb-4 max-w-[600px]">
              <label className="block flex items-center gap-2 font-medium text-gray-700"><LayoutList size={18} /> Content type:</label>
              <select 
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })} 
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-fiction">Non-fiction</option>
              </select>
            </div>
          </div>
            
          <div className="mb-8 max-w-[600px]">
            <label className="block flex items-center gap-2 font-medium text-gray-700"><Text size={18} /> Specify Theme:</label>
            <select 
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })} 
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="Friendship, Family, and Community">Friendship, Family, and Community</option>
              <option value="Identity and Belonging">Identity and Belonging</option>
              <option value="Exploration and Curiosity">Exploration and Curiosity</option>
              <option value="Problem-Solving and Decision-Making">Problem-Solving and Decision-Making</option>
              <option value="Creative and Expressive Thinking">Creative and Expressive Thinking</option>
              <option value="Health, Sustainability, and Global Awareness">Health, Sustainability, and Global Awareness</option>
            </select>
          </div>
            
          <div className="mb-8 max-w-[600px]">
            <label className="block flex items-center gap-2 font-medium text-gray-700"><FileText size={18} /> Interactivity Scale (1-5):</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={formData.interactivity} 
              onChange={(e) => setFormData({ ...formData, interactivity: Number(e.target.value) })} 
              className="w-full accent-orange-500" 
            />
            <div className="flex justify-between text-xs mt-1 text-gray-600">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
            
          <div className="mb-8 max-w-[600px]">
            <label className="block flex items-center gap-2 font-medium text-gray-700"><FilePlus size={18} /> Specific Teaching Objectives:</label>
            <textarea 
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} 
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all h-24"
            ></textarea>
          </div>

          <div className="mb-8 max-w-[600px]">
            <label className="block flex items-center gap-2 font-medium text-gray-700"><FilePlus size={18} /> Attach Assessment Criteria:</label>
            <input 
              type="file" 
              onChange={(e) => setFormData({ ...formData, assessment: e.target.files ? e.target.files[0] : null })} 
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" 
            />
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className={`w-full py-4 ${isLoading ? 'bg-orange-400' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'} text-white text-lg font-semibold rounded-lg transition-all shadow-lg`}
          >
            {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
          </button>

          {generatedPlan && (
            <div className="mt-10 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-lg border border-yellow-100">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Generated Lesson Plan</h3>
              <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">{generatedPlan}</pre>
              <button
                onClick={() => navigate('/lessons')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg font-medium"
              >
                View Lesson History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}