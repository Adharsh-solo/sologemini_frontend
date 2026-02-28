import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';

import { sendChatMessage } from './api/gemini';
import './index.css';

function ChatApp({ history, setHistory, isAuthenticated }) {
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if there is history data passed from the navigation link
    if (location.state && location.state.selectedHistory) {
      setHistory(location.state.selectedHistory);

      // Remove the state so refreshing doesn't keep reloading it
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setHistory]);

  const handleSendMessage = async (text) => {
    // Guest Limit Logic
    if (!isAuthenticated) {
      const currentCount = parseInt(localStorage.getItem('guest_chat_count') || '0', 10);

      if (currentCount >= 3) {
        const userMessage = { role: 'user', parts: [{ text }] };
        const warningMessage = {
          role: 'model',
          parts: [{ text: 'You have reached the guest limit of 3 messages. Please login or register to continue chatting and to save your history!' }]
        };
        setHistory((prev) => [...prev, userMessage, warningMessage]);
        return;
      }

      localStorage.setItem('guest_chat_count', (currentCount + 1).toString());
    }

    const userMessage = { role: 'user', parts: [{ text }] };
    setHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(text, history);
      const aiMessage = { role: 'model', parts: [{ text: response.reply }] };
      setHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'model',
        parts: [{ text: 'Sorry, I encountered an error communicating with the server.' }]
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <ChatWindow messages={history} isTyping={isTyping} />
      <InputBar onSendMessage={handleSendMessage} disabled={isTyping} />
    </>
  );
}

function App() {
  const [history, setHistory] = useState([]);
  // Initialize synchronously to prevent flash of login screen
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} onNewChat={() => setHistory([])} />
        <Routes>
          <Route path="/" element={<ChatApp history={history} setHistory={setHistory} isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
          <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
