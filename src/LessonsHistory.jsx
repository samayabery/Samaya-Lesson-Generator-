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
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-bold mb-4">Previous Lesson Plans</h2>
      {lessons.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-4">
          {lessons.map((l, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedIndex(idx); setShowFeedbackForm(false); setPendingRevision(null); setFeedbackText(""); }}
              className={`px-4 py-2 rounded ${selectedIndex === idx ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              {l.title} {l.createdAt ? `- ${l.createdAt.toLocaleDateString()}` : ''}
            </button>
          ))}
        </div>
      )}
      {lessons[selectedIndex] ? (
        <div className="p-4 bg-white rounded shadow">
          <pre className="whitespace-pre-wrap mb-4">{lessons[selectedIndex].content}</pre>
          {!pendingRevision ? (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="mt-2 p-2 bg-green-500 text-white rounded"
                >
                  Give Feedback
                </button>
                <button
                  onClick={() => handleDelete(selectedIndex)}
                  className="mt-2 p-2 bg-red-500 text-white rounded"
                >
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
                  <button
                    onClick={handleSubmitFeedback}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
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
        <p>No lessons generated yet.</p>
      )}
    </div>
  );
}
