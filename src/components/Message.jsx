import React from 'react';

const Message = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`message-wrapper ${isUser ? 'user' : 'model'}`}>
            <div className="message-bubble">
                {message.parts[0].text}
            </div>
        </div>
    );
};

export default Message;
