import React, { useState, useEffect } from 'react';
import { fetchHistory } from '../api/gemini';
import { useNavigate } from 'react-router-dom';

function History() {
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchHistory();
                setHistoryItems(data);
            } catch (err) {
                setError('Failed to load history.');
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [navigate]);

    const handleHistoryClick = (item) => {
        const formattedHistory = [
            { role: 'user', parts: [{ text: item.user_message }] },
            { role: 'model', parts: [{ text: item.ai_response }] }
        ];
        navigate('/', { state: { selectedHistory: formattedHistory } });
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <h2>Your Conversation History</h2>
            </div>

            {isLoading ? (
                <div className="history-loading">Loading conversations...</div>
            ) : error ? (
                <div className="history-error">{error}</div>
            ) : historyItems.length === 0 ? (
                <div className="history-empty">No conversations yet. Start chatting to save your history!</div>
            ) : (
                <div className="history-list">
                    {historyItems.map((item) => (
                        <div
                            key={item.id}
                            className="history-item clickable"
                            onClick={() => handleHistoryClick(item)}
                        >
                            <div className="history-date">
                                {new Date(item.created_at).toLocaleString()}
                            </div>
                            <div className="history-content">
                                <div className="history-user-msg">
                                    <strong>You:</strong> {item.user_message}
                                </div>
                                <div className="history-ai-msg">
                                    <strong>SoloGemini:</strong> {item.ai_response}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default History;
