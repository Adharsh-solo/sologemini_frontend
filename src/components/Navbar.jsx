import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import md5 from 'md5';
import { fetchUser, logoutUser } from '../api/auth';

const Navbar = ({ isAuthenticated, setIsAuthenticated, onNewChat }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            const loadUser = async () => {
                try {
                    const userData = await fetchUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to load user info', error);
                }
            };
            loadUser();
        } else {
            setUser(null);
            setIsDropdownOpen(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const handleNewChat = () => {
        if (onNewChat) onNewChat();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const getGravatarUrl = (email) => {
        if (!email) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        const hash = md5(email.trim().toLowerCase());
        return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">SoloGemini</Link>
            </div>
            <div className="navbar-links">
                <button onClick={handleNewChat} className="new-chat-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Chat
                </button>
                {isAuthenticated ? (
                    <div className="profile-container" ref={dropdownRef}>
                        <button
                            className="profile-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Profile menu"
                        >
                            <img
                                src={getGravatarUrl(user?.email)}
                                alt="Profile"
                                className="profile-image"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <div className="dropdown-user-info">
                                        <p className="dropdown-username">{user?.username || 'User'}</p>
                                        <p className="dropdown-email">{user?.email || 'No email provided'}</p>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-menu">
                                    <Link to="/history" onClick={() => setIsDropdownOpen(false)} className="dropdown-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        Your Chats
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout-item">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="register-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
