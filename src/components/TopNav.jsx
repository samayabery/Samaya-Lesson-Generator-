import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FilePlus, LayoutList, LogOut } from "lucide-react";

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
    <nav className="bg-white border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex space-x-6">
            <Link to="/details" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md transition-colors">
              <FilePlus className="w-5 h-5" />
              <span className="font-medium">Input Form</span>
            </Link>
            <Link to="/lessons" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md transition-colors">
              <LayoutList className="w-5 h-5" />
              <span className="font-medium">Lesson Plans</span>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 px-3 py-2 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 