import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ChatContext = createContext();

export const useChat = (contactId) => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  const { getMessages, sendMessage, getConversations } = context;
  
  const messages = getMessages(contactId);
  const send = useCallback((text, senderId, attachment = null) => {
    sendMessage(contactId, text, senderId, attachment);
  }, [contactId, sendMessage]);

  return { messages, sendMessage: send, getConversations };
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    setChats(savedChats);

    const handleStorageChange = () => {
      const updatedChats = JSON.parse(localStorage.getItem('chats') || '{}');
      setChats(updatedChats);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveChats = (updatedChats) => {
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setChats(updatedChats);
    window.dispatchEvent(new Event('storage'));
  };

  const getMessages = useCallback((contactId) => {
    if (!user) return [];
    const conversationId = user.role === 'admin' ? contactId : user.id;
    return chats[conversationId] || [];
  }, [chats, user]);

  const sendMessage = useCallback((contactId, text, senderId, attachment = null) => {
    if (!user) return;
    
    const conversationId = user.role === 'admin' ? contactId : user.id;
    const newMessage = {
      id: `msg_${Date.now()}`,
      text,
      senderId,
      timestamp: new Date().toISOString(),
      attachment,
    };

    const updatedChats = { ...chats };
    if (!updatedChats[conversationId]) {
      updatedChats[conversationId] = [];
    }
    updatedChats[conversationId].push(newMessage);
    
    saveChats(updatedChats);
  }, [chats, user]);

  const getConversations = useCallback(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return Object.keys(chats).map(userId => {
      const conversationUser = users.find(u => u.id === userId);
      const lastMessage = chats[userId][chats[userId].length - 1];
      return {
        id: userId,
        name: conversationUser?.name || 'Pengguna Dihapus',
        avatar: conversationUser?.name?.charAt(0).toUpperCase() || '?',
        lastMessage: lastMessage?.text || (lastMessage?.attachment ? `File: ${lastMessage.attachment.name}` : 'Belum ada pesan'),
        timestamp: lastMessage?.timestamp,
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [chats]);

  const value = {
    getMessages,
    sendMessage,
    getConversations,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};