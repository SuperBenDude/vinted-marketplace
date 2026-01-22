import { createContext, useContext, useState, useCallback } from 'react';

const EditorContext = createContext(null);

export function EditorProvider({ children, conversations, setConversations, currentUser, setCurrentUser }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const openEditor = useCallback(() => setIsEditorOpen(true), []);
  const closeEditor = useCallback(() => setIsEditorOpen(false), []);
  const toggleEditMode = useCallback(() => setEditMode(prev => !prev), []);

  // Update a specific conversation
  const updateConversation = useCallback((conversationId, updates) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, ...updates } : conv
    ));
  }, [setConversations]);

  // Update participant in a conversation
  const updateParticipant = useCallback((conversationId, updates) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, participant: { ...conv.participant, ...updates } }
        : conv
    ));
  }, [setConversations]);

  // Update product in a conversation
  const updateProduct = useCallback((conversationId, updates) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, product: { ...conv.product, ...updates } }
        : conv
    ));
  }, [setConversations]);

  // Update a specific message
  const updateMessage = useCallback((conversationId, messageId, updates) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        // Also update lastMessage if this is the last message
        const lastMsg = updatedMessages[updatedMessages.length - 1];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: {
            ...conv.lastMessage,
            text: lastMsg.text,
            timestamp: lastMsg.timestamp
          }
        };
      }
      return conv;
    }));
  }, [setConversations]);

  // Add a new message to a conversation
  const addMessage = useCallback((conversationId, message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMessage = {
          id: `m${conv.messages.length + 1}_${Date.now()}`,
          senderId: message.senderId || 'me',
          text: message.text,
          timestamp: message.timestamp || new Date().toISOString(),
          status: message.status || 'read'
        };
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: {
            text: newMessage.text,
            timestamp: newMessage.timestamp,
            isFromMe: newMessage.senderId === 'me',
            status: newMessage.status
          }
        };
      }
      return conv;
    }));
  }, [setConversations]);

  // Delete a message
  const deleteMessage = useCallback((conversationId, messageId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = conv.messages.filter(msg => msg.id !== messageId);
        const lastMsg = updatedMessages[updatedMessages.length - 1];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: lastMsg ? {
            text: lastMsg.text,
            timestamp: lastMsg.timestamp,
            isFromMe: lastMsg.senderId === 'me',
            status: lastMsg.status
          } : { text: '', timestamp: '', isFromMe: false }
        };
      }
      return conv;
    }));
  }, [setConversations]);

  // Add a new conversation
  const addConversation = useCallback((conversation) => {
    const newConversation = {
      id: `conv_${Date.now()}`,
      participant: {
        id: `user_${Date.now()}`,
        name: conversation.participantName || 'New User',
        avatar: conversation.participantAvatar || 'https://i.pravatar.cc/150?img=1',
        isOnline: false
      },
      product: {
        id: `prod_${Date.now()}`,
        title: conversation.productTitle || 'New Product',
        price: conversation.productPrice || 0,
        currency: 'GBP',
        image: conversation.productImage || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        status: 'available'
      },
      messages: [],
      lastMessage: {
        text: '',
        timestamp: new Date().toISOString(),
        isFromMe: false
      },
      unreadCount: 0,
      isTyping: false
    };
    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  }, [setConversations]);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  }, [setConversations]);

  // Export all data as JSON
  const exportData = useCallback(() => {
    const data = {
      currentUser,
      conversations
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketplace-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [conversations, currentUser]);

  // Import data from JSON
  const importData = useCallback((jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.conversations) {
        setConversations(data.conversations);
      }
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, [setConversations, setCurrentUser]);

  const value = {
    isEditorOpen,
    editMode,
    openEditor,
    closeEditor,
    toggleEditMode,
    conversations,
    setConversations,
    currentUser,
    updateConversation,
    updateParticipant,
    updateProduct,
    updateMessage,
    addMessage,
    deleteMessage,
    addConversation,
    deleteConversation,
    exportData,
    importData,
    setCurrentUser
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
