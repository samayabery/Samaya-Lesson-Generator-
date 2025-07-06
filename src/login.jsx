import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import { BookOpen } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [LoggedIn, setIsLoggedIn] = useState(true);
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up an authentication state observer
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
        navigate('/details');
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      toast.success("Signed up successfully!");
      navigate('/details');

    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("Signed in successfully!");
      navigate('/details');
    } catch (error) {
      console.error('Error signing in:', error.code, error.message);
      toast.error(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/details');

     
      toast.success("Signed in with Google successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-orange-100 w-96">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">iLesson</span>
          </div>
          <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
        </div>
      
        {!LoggedIn && 
        <>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h2>

          {!LoggedIn && (
            <button
              onClick={signInWithGoogle}
              className="w-full p-3 border-2 border-orange-200 font-medium text-orange-700 rounded-lg mb-4 hover:bg-orange-50 transition-colors"
            >
              Sign in with Google
            </button>
          )}

          <input
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          <input
            aria-label="Password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />

          {isSignIn ? (
            <>
              <button
                onClick={signIn}
                className="w-full p-3 mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
              >
                Sign In
              </button>
              <div className="text-center text-sm text-gray-600">
                New user?{" "}
                <button
                  onClick={() => setIsSignIn(false)}
                  className="text-orange-600 hover:text-orange-800 hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={signUp}
                className="w-full p-3 mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
              >
                Sign Up
              </button>
              <div className="text-center text-sm text-gray-600">
                Already Registered?{" "}
                <button
                  onClick={() => setIsSignIn(true)}
                  className="text-orange-600 hover:text-orange-800 hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </>
          )}
        </>}

        {LoggedIn && (
          <>
            <div className="text-center text-gray-700 mb-6">See you soon!</div>
            <button
              onClick={logOut}
              className="w-full p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-medium"
            >
              Logout
            </button>
          </>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;