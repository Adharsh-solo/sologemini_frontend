import React, { useState } from 'react';

const InputBar = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="input-wrapper">
            <form className="input-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input-bar"
                    placeholder="Ask SoloGemini anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={disabled || !input.trim()}
                    aria-label="Send message"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" fill="currentColor" />
                    </svg>
                </button>
            </form>
            <div className="footer-text">SoloGemini may display inaccurate info, so double-check its responses.</div>
        </div>
    );
};

export default InputBar;
