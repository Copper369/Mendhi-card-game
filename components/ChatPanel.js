import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';

export default function ChatPanel({ socket, roomId }) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { chatMessages } = useGameStore();
  const messagesEndRef = useRef(null);
  const lastReadCount = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Update unread count when new messages arrive and chat is closed
  useEffect(() => {
    if (!isOpen && chatMessages.length > lastReadCount.current) {
      const newMessages = chatMessages.length - lastReadCount.current;
      setUnreadCount(prev => prev + newMessages);
    }
  }, [chatMessages, isOpen]);

  // Reset unread count and update last read when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      lastReadCount.current = chatMessages.length;
    }
  }, [isOpen, chatMessages.length]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit('chat_message', { roomId, message });
    setMessage('');
  };

  // Chat icon button (always visible)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 sm:p-4 shadow-2xl transition transform hover:scale-110 z-50"
        title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Open chat'}
      >
        <div className="relative">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full min-w-5 h-5 sm:min-w-6 sm:h-6 px-1 flex items-center justify-center animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </button>
    );
  }

  // Full chat panel (when open)
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-lg shadow-2xl flex flex-col w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 h-[400px] sm:h-96 z-50 border-2 border-green-600 animate-slideUp">
      <div className="bg-green-700 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold">Chat</h2>
          <span className="text-[10px] sm:text-xs bg-green-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            {chatMessages.length}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition"
          title="Close chat"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-xs sm:text-sm">No messages yet</p>
            <p className="text-[10px] sm:text-xs">Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className="bg-white rounded-lg p-1.5 sm:p-2 shadow animate-slideIn">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <div className="font-semibold text-xs sm:text-sm text-green-700">{msg.playerName}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-800">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-2 sm:p-3 border-t bg-white rounded-b-lg">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-xs sm:text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Send message"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
