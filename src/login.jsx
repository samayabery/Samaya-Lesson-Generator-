import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase"
import { createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      
            {!LoggedIn && 
            <>
              <h2 className="text-2xl font-semibold mb-16 text-center text-black">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h2>

        {!LoggedIn && (
          <button
            onClick={signInWithGoogle}
            className="p-2 border-2 border-black font-medium text-black rounded w-full mb-4"
          >
            Sign in with Google
          </button>
        )}

        <input
          aria-label="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          aria-label="Password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {isSignIn ? (
          <>
            <button
              onClick={signIn}
              className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Sign in
            </button>
            <div className="text-center text-sm">
              New user?{" "}
              <button
              
                className="text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={signUp}
              className="w-full p-2 mb-4 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
            <div className="text-center text-sm">
              Already Registered?{" "}
              <button
                
                className="text-blue-500 hover:underline"
              >
                Sign in
              </button>
            </div>
          </>
        )}</>}

        {LoggedIn && (
          <>
          <div className="text-center"> See you soon</div>
          <button
            onClick={logOut}
            className="w-full p-2 mt-6 bg-black text-white rounded hover:bg-gray-800 transition-colors"
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