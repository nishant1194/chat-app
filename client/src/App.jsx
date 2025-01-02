 import { useEffect, useState } from 'react'
import './App.css'
import ProfileModal from './components/Profile'
import HomePage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { authUser,checkAuth, onlineUsers } = useAuthStore(); 

  useEffect(() => {
    checkAuth();
    console.log({ authUser });
  }, [checkAuth]);
 
  return (
   <>
    <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
         <Route path="/profile" element={authUser ? <ProfileModal /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
   </>
   )
}

export default App
