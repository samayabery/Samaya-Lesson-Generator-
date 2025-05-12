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
  const [pendingRevision, setPendingRevision] = useState(null);
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
      setPendingRevision({ content: data.choices[0].message.content });
    } catch (error) {
      console.error('Error requesting revision:', error);
      alert('Failed to get revised lesson.');
    }
  };

  const acceptRevision = async () => {
    if (!pendingRevision || !uid) return;
    try {
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, {
        lessons_generated: arrayUnion({ content: pendingRevision.content, createdAt: serverTimestamp() })
      });
      fetchLessons(uid);
      setPendingRevision(null);
      setShowFeedbackForm(false);
      setFeedbackText("");
    } catch (error) {
      console.error('Error saving accepted revision:', error);
      alert('Failed to save revision.');
    }
  };

  const rejectRevision = () => {
    setPendingRevision(null);
    setShowFeedbackForm(true);
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
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <button onClick={() => navigate('/lessons')} className="mb-4 text-blue-600 hover:underline">
        ← Back to Lesson Plans
      </button>
      {lesson ? (
        <div className="p-4 bg-white rounded shadow">
          <pre className="whitespace-pre-wrap mb-4">{lesson.content}</pre>
          {!pendingRevision ? (
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
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="text-lg font-semibold mb-2">Proposed Revision</h3>
              <pre className="whitespace-pre-wrap">{pendingRevision.content}</pre>
              <div className="flex gap-2 mt-2">
                <button onClick={acceptRevision} className="p-2 bg-blue-500 text-white rounded">
                  Accept
                </button>
                <button onClick={rejectRevision} className="p-2 bg-gray-500 text-white rounded">
                  Provide More Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Lesson not found.</p>
      )}
    </div>
  );
} 