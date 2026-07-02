import React, { useState, useEffect, useRef } from 'react';
import api from '../services/axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaUserShield } from 'react-icons/fa';

const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5000';

const FloatingChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('nvcr_tk');
  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0); // Clear unread messages when opened
    }
  }, [messages, isOpen]);
  // Check for active chat on mount
  useEffect(() => {
    if (!token) return;
    const checkActiveChat = async () => {
      try {
        const response = await api.get('/support/my-chat', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = response.data;
        if (data.chat) {
          setChat(data.chat);
          setMessages(data.chat.messages || []);
          initSocket(data.chat._id);
        }
      } catch (error) {
        console.error('Error checking active support chat:', error);
      }
    };
    checkActiveChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token]);
  // Initialize Socket.io connection for chat
  const initSocket = (chatId) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setConnecting(true);
    const socket = io(socketUrl, {
      auth: { token },
      reconnection: true
    });
    socket.on('connect', () => {
      console.log('[Socket] Connected to support chat');
      setConnecting(false);
      socket.emit('joinSupportChat', chatId);
    });
    socket.on('supportMessage', (message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });
    socket.on('chatClaimed', (data) => {
      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          adminId: data.adminId,
          adminName: data.adminName,
          status: 'active'
        };
      });
    });
    socket.on('chatClosed', () => {
      setChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'closed'
        };
      });
    });
    socketRef.current = socket;
  };
  const startChat = async () => {
    try {
      setConnecting(true);
      const response = await api.post(
        '/support/start',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = response.data;
      setChat(data.chat);
      setMessages([]);
      initSocket(data.chat._id);
    } catch (error) {
      console.error('Error starting support chat:', error);
    } finally {
      setConnecting(false);
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !chat) return;
    const messageText = inputText.trim();
    setInputText('');
    try {
      await api.post(
        '/support/message',
        { text: messageText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error sending support message:', error);
    }
  };
  if (!token) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button (FAB) */}
      <button
        id="floating-chat-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)] cursor-pointer transition-transform duration-300 hover:scale-105 relative focus:outline-none"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-2xl" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse border-2 border-neutral-950">
            {unreadCount}
          </span>
        )}
      </button>
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="bg-white/5 px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                  <FaUserShield className="text-lg" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider text-white">Nova Support</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${connecting ? 'bg-yellow-500 animate-pulse' : chat ? 'bg-green-500' : 'bg-neutral-500'}`} />
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                      {connecting
                        ? 'Connecting...'
                        : chat
                          ? chat.status === 'open'
                            ? 'Waiting for Admin'
                            : `Active with ${chat.adminName}`
                          : 'Support Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {!chat ? (
                /* No Active Chat Session */
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-sm text-neutral-400 mb-6 font-medium leading-relaxed">
                    Have any complaints or need assistance? Click below to start a live support conversation with our administrator.
                  </p>
                  <button
                    onClick={startChat}
                    disabled={connecting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl transition-colors cursor-pointer"
                  >
                    {connecting ? 'Initializing...' : 'Start Live Support Chat'}
                  </button>
                </div>
              ) : (
                /* Chat Messages History */
                <>
                  {chat.status === 'open' && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                      <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                        Conversation Started
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                        An administrator will join shortly. Feel free to type details of your request.
                      </p>
                    </div>
                  )}
                  {messages.map((msg, index) => {
                    const isMe = msg.senderModel === 'User';
                    return (
                      <div
                        key={msg._id || index}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1 px-1">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isMe
                              ? 'bg-orange-500 text-white rounded-tr-none'
                              : 'bg-white/5 border border-white/10 text-neutral-200 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-neutral-600 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  {chat.status === 'closed' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                      <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
                        Conversation Closed
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                        This session has been marked resolved. You can start a new support conversation if needed.
                      </p>
                      <button
                        onClick={startChat}
                        className="mt-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] py-2 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Start New Chat
                      </button>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            {/* Input Form */}
            {chat && chat.status !== 'closed' && (
              <form
                onSubmit={sendMessage}
                className="p-4 bg-white/5 border-t border-white/10 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your support message..."
                  className="flex-grow bg-neutral-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-12 h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-xl flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FloatingChatSupport;





