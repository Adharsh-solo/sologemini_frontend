import React, { useEffect, useRef } from 'react';
import Message from './Message';

const ChatWindow = ({ messages, isTyping }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="chat-window">
            {messages.map((msg, idx) => (
                <Message key={idx} message={msg} />
            ))}

            {isTyping && (
                <div className="message-wrapper model">
                    <div className="message-bubble">
                        <div className="typing-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
