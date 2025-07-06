import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { FilePlus, LayoutList, LogOut, BookOpen, Home } from "lucide-react";

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
    <nav className="bg-white border-b border-orange-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">iLesson</span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link to="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-800 px-3 py-2 rounded-lg transition-colors hover:bg-orange-50">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/details" className="flex items-center gap-2 text-orange-600 hover:text-orange-800 px-3 py-2 rounded-lg transition-colors hover:bg-orange-50">
              <FilePlus className="w-5 h-5" />
              <span className="font-medium">Input Form</span>
            </Link>
            <Link to="/lessons" className="flex items-center gap-2 text-orange-600 hover:text-orange-800 px-3 py-2 rounded-lg transition-colors hover:bg-orange-50">
              <LayoutList className="w-5 h-5" />
              <span className="font-medium">Lesson Plans</span>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 px-3 py-2 rounded-lg transition-colors hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 