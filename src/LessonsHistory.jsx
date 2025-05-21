import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LessonsHistory() {
  const [uid, setUid] = useState(null);
  const [rawLessons, setRawLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [pendingRevision, setPendingRevision] = useState(null);
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

  useEffect(() => {
    const normalized = rawLessons.map((item, idx) => parseLesson(item, idx));
    setLessons(normalized);
    if (normalized.length > 0) setSelectedIndex(0);
  }, [rawLessons]);

  const parseLesson = (item, idx) => {
    let content;
    let createdAt = null;
    if (typeof item === 'string') {
      content = item;
    } else {
      content = item.content;
      createdAt = item.createdAt?.toDate() || null;
    }
    const match = content.match(/SESSION TITLE:\s*(.+)/i);
    const title = match ? match[1].trim() : `Lesson ${idx + 1}`;
    return { content, createdAt, title };
  };

  const fetchLessons = async (userId) => {
    try {
      const docRef = doc(db, 'InputDetails', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setRawLessons(snap.data().lessons_generated || []);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleSubmitFeedback = async () => {
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
    } catch (error) {
      console.error('Error requesting revision:', error);
      alert('Failed to get revised lesson.');
    }
  };

  const acceptRevision = async () => {
    if (!pendingRevision) return;
    try {
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, {
        lessons_generated: arrayUnion({ content: pendingRevision.content, createdAt: serverTimestamp() })
      });
      setRawLessons(prev => [...prev, { content: pendingRevision.content, createdAt: { toDate: () => new Date() } }]);
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

  const handleDelete = async (idx) => {
    const toDelete = rawLessons[idx];
    try {
      const docRef = doc(db, 'InputDetails', uid);
      await updateDoc(docRef, { lessons_generated: arrayRemove(toDelete) });
      fetchLessons(uid);
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-center text-4xl font-extrabold text-indigo-600 mb-8">Lesson History</h2>
        {lessons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {lessons.map((l, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedIndex(idx); setShowFeedbackForm(false); setPendingRevision(null); setFeedbackText(""); }}
                className={`px-6 py-2 rounded-full font-medium transition ${selectedIndex===idx? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {l.title}{l.createdAt? ` - ${l.createdAt.toLocaleDateString()}` : ''}
              </button>
            ))}
          </div>
        )}
        {lessons[selectedIndex] ? (
          <div className="p-6 bg-indigo-50 rounded-xl shadow-inner">
            <pre className="whitespace-pre-wrap mb-6 text-gray-800 leading-relaxed">{lessons[selectedIndex].content}</pre>
            {!pendingRevision ? (
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => handleDelete(selectedIndex)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete Plan
                </button>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Give Feedback
                </button>
              </div>
            ) : (
              <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-indigo-700">Proposed Revision</h3>
                <pre className="whitespace-pre-wrap mb-4 text-gray-800">{pendingRevision.content}</pre>
                <div className="flex gap-4">
                  <button onClick={acceptRevision} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Accept
                  </button>
                  <button onClick={rejectRevision} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    More Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No lessons generated yet.</p>
        )}
      </div>
    </div>
  );
}
