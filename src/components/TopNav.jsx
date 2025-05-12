import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white border-b shadow p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/details" className="text-blue-500 hover:text-blue-700">
          Input Form
        </Link>
        <Link to="/lessons" className="text-blue-500 hover:text-blue-700">
          Lesson Plans
        </Link>
      </div>
      <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
        Logout
      </button>
    </nav>
  );
} 