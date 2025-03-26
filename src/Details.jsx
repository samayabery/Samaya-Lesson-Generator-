import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import { useState, useEffect } from "react";
import { GraduationCap, BookOpen, FileText, FilePlus, Pencil, Mic, Clock, Layers, LayoutList, Text } from "lucide-react";

export default function LessonPlanForm() {
  const [formData, setFormData] = useState({
    grade: "",
    reading: 3,
    writing: 3,
    listening: 3,
    speaking: 3,
    duration: "",
    lessons: "",
    contentType: "Fiction",
    theme: "",
    interactivity: 3,
    objectives: "",
    assessment: null,
  });

  const [uid, setUid] = useState ()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        fetchUserDetails(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "InputDetails", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setFormData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching details: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!uid) {
      alert("You must be logged in to submit details.");
      return;
    }

    try {
      const dataToStore = { ...formData, assessment: formData.assessment.name || "" };
      await setDoc(doc(db, "InputDetails", uid), dataToStore, { merge: true });
      alert("Lesson Plan Saved Successfully!");
    } catch (error) {
      console.error("Error saving lesson plan: ", error);
      alert("Failed to save lesson plan");
    }
  };

  console.log(formData)

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-bold mb-4">Lesson Plan Generator</h2>
      
      <div className="mb-4">
        <label className="block flex items-center gap-2"><BookOpen size={18} /> Grade being taught:</label>
        <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full p-2 mt-1 border rounded">
          {["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade"].map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["reading", "writing", "listening", "speaking"].map((skill) => (
          <div key={skill} className="mb-4">
            <label className="block flex items-center gap-2">{skill === "reading" ? <BookOpen size={18} /> : skill === "writing" ? <Pencil size={18} /> : skill === "listening" ? <FileText size={18} /> : <Mic size={18} />} {`Level of proficiency in ${skill}:`}</label>
            <input type="range" min="1" max="5" value={formData[skill]} onChange={(e) => setFormData({ ...formData, [skill]: Number(e.target.value) })} className="w-full" />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block flex items-center gap-2"><Clock size={18} /> Duration of lesson (in minutes):</label>
        <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 mt-1 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block flex items-center gap-2"><Layers size={18} /> Number of lessons to generate:</label>
        <input type="number" onChange={(e) => setFormData({ ...formData, lessons: e.target.value })} className="w-full p-2 mt-1 border rounded" />
      </div>
      
      <div className="mb-4">
        <label className="block flex items-center gap-2"><LayoutList size={18} /> Content type:</label>
        <select onChange={(e) => setFormData({ ...formData, contentType: e.target.value })} className="w-full p-2 mt-1 border rounded">
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block flex items-center gap-2"><Text size={18} /> Specify Theme:</label>
        <select onChange={(e) => setFormData({ ...formData, theme: e.target.value })} className="w-full p-2 mt-1 border rounded">
          <option value="Friendship, Family, and Community">Friendship, Family, and Community</option>
          <option value="Identity and Belonging">Identity and Belonging</option>
          <option value="Exploration and Curiosity">Exploration and Curiosity</option>
          <option value="Problem-Solving and Decision-Making">Problem-Solving and Decision-Making</option>
          <option value="Creative and Expressive Thinking">Creative and Expressive Thinking</option>
          <option value="Health, Sustainability, and Global Awareness">Health, Sustainability, and Global Awareness</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block flex items-center gap-2"><FileText size={18} /> Interactivity Scale (1-5):</label>
        <input type="range" min="1" max="5" value={formData.interactivity} onChange={(e) => setFormData({ ...formData, interactivity: Number(e.target.value) })} className="w-full" />
      </div>
      
      <div className="mb-4">
        <label className="block flex items-center gap-2"><FilePlus size={18} /> Specific Teaching Objectives:</label>
        <textarea onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} className="w-full p-2 mt-1 border rounded h-24"></textarea>
      </div>

      <div className="mb-4">
        <label className="block flex items-center gap-2"><FilePlus size={18} /> Attach Assessment Criteria:</label>
        <input type="file" onChange={(e) => setFormData({ ...formData, assessment: e.target.files[0] })} className="w-full p-2 mt-1 border rounded" />
      </div>

      <button onClick={handleSubmit} className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">Generate Lesson Plan</button>
    </div>
  );
}