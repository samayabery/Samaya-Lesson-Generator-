import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function LessonDetail() {
  const { index } = useParams();
  const [uid, setUid] = useState(null);
  const [rawLessons, setRawLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const navigate = useNavigate();

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

  const fetchLessons = async (userId) => {
    try {
      const docRef = doc(db, "InputDetails", userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const arr = snap.data().lessons_generated || [];
        setRawLessons(arr);
        const item = arr[parseInt(index, 10)];
        if (item) {
          const content = typeof item === "string" ? item : item.content;
          const createdAt = item.createdAt?.toDate?.() || null;
          setLesson({ content, createdAt });
        }
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!lesson) return;
    setIsLoading(true);
    const prompt = `Revise the following lesson plan based on the user feedback.\n\nOriginal Lesson Plan:\n${lesson.content}\n\nFeedback:\n${feedbackText}`;
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
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, { lessons_generated: arrayUnion({ content: revised, createdAt: serverTimestamp() }) });
      setIsLoading(false);
      navigate('/lessons');
    } catch (error) {
      console.error('Error generating revised lesson:', error);
      setIsLoading(false);
      alert('Failed to regenerate lesson.');
    }
  };

  const handleDelete = async () => {
    if (!uid) return;
    try {
      const toDelete = rawLessons[parseInt(index, 10)];
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, { lessons_generated: arrayRemove(toDelete) });
      navigate('/lessons');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson.');
    }
  };

  return (
    <>
    {isLoading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin h-16 w-16 border-4 border-t-4 border-indigo-500 rounded-full"></div>
      </div>
    )}
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <button onClick={() => navigate('/lessons')} className="mb-4 text-blue-600 hover:underline">
        ← Back to Lesson Plans
      </button>
      {lesson ? (
        <div className="p-4 bg-white rounded shadow">
          <pre className="whitespace-pre-wrap mb-4">{lesson.content}</pre>
          {!isLoading && (
            <>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setShowFeedbackForm(true)} className="p-2 bg-green-500 text-white rounded">
                  Give Feedback
                </button>
                <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">
                  Delete Plan
                </button>
              </div>
              {showFeedbackForm && (
                <div className="mt-4">
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    className="w-full p-2 border rounded h-24"
                    placeholder="Enter feedback"
                  />
                  <button onClick={handleSubmitFeedback} className="mt-2 p-2 bg-blue-500 text-white rounded">
                    Submit Feedback
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <p>Lesson not found.</p>
      )}
    </div>
    </>
  );
} 