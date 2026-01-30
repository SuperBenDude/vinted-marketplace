import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorProvider, useEditor } from './context/EditorContext';
import { EditorMenu } from './components/editor';
import InboxList from './components/InboxList';
import ConversationView from './components/ConversationView';
import AppMenu from './components/AppMenu';
import { VintedInbox, VintedConversation, VintedBalance } from './components/vinted';
import conversationsData from './data/conversations.json';
import vintedConversationsData from './data/vinted-conversations.json';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './App.css';

function AppContent({
  conversations,
  setConversations,
  handleSendMessage,
  vintedConversations,
  setVintedConversations,
  vintedBalance
}) {
  const { isEditorOpen, openEditor, closeEditor } = useEditor();

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isEditorOpen) {
          closeEditor();
        } else {
          openEditor();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, openEditor, closeEditor]);

  return (
    <>
      <div className="app-container">
        <div className="mobile-frame">
          <Routes>
            {/* Menu Routes */}
            <Route
              path="/menu/messenger"
              element={<AppMenu currentApp="messenger" />}
            />
            <Route
              path="/menu/vinted"
              element={<AppMenu currentApp="vinted" />}
            />

            {/* Marketplace Routes */}
            <Route
              path="/"
              element={<InboxList conversations={conversations} />}
            />
            <Route
              path="/conversation/:id"
              element={
                <ConversationView
                  conversations={conversations}
                  onSendMessage={handleSendMessage}
                />
              }
            />

            {/* Vinted Routes */}
            <Route
              path="/vinted"
              element={<VintedInbox conversations={vintedConversations} setConversations={setVintedConversations} />}
            />
            <Route
              path="/vinted/conversation/:id"
              element={
                <VintedConversation
                  conversations={vintedConversations}
                  onUpdateConversation={(id, updates) => {
                    setVintedConversations(prev =>
                      prev.map(c => c.id === id ? { ...c, ...updates } : c)
                    );
                  }}
                />
              }
            />
            <Route
              path="/vinted/balance"
              element={<VintedBalance balanceData={vintedBalance} />}
            />
          </Routes>
        </div>
      </div>
      <EditorMenu />
    </>
  );
}

function App() {
  // Marketplace state
  const [conversations, setConversations] = useState(conversationsData.conversations);
  const [currentUser, setCurrentUser] = useState(conversationsData.currentUser);

  // Vinted state - start empty, load from Firebase
  const [vintedConversations, setVintedConversations] = useState([]);
  const [vintedBalance, setVintedBalance] = useState(vintedConversationsData.balance);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  // Load from Firebase ONLY on initial load
  useEffect(() => {
    const docRef = doc(db, 'vinted', 'conversations');

    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().conversations || [];
        console.log('Initial load from Firebase:', data.length, 'conversations');
        setVintedConversations(data);
      } else {
        console.log('No Firebase data, using defaults');
        setVintedConversations(vintedConversationsData.conversations);
      }
      setIsLoading(false);
      // Delay initialization flag to prevent save effect from firing on load
      setTimeout(() => {
        hasInitialized.current = true;
        console.log('Firebase initialized, saves now enabled');
      }, 200);
    }).catch((error) => {
      console.error('Firebase initial load error:', error);
      setVintedConversations(vintedConversationsData.conversations);
      setIsLoading(false);
      setTimeout(() => {
        hasInitialized.current = true;
      }, 200);
    });
  }, []);

  // Save to Firebase whenever conversations change (after initialization)
  // Limit to 30 most recent conversations to stay under Firebase's 1MB document limit
  useEffect(() => {
    if (isLoading || !hasInitialized.current) {
      console.log('Save skipped - isLoading:', isLoading, 'hasInitialized:', hasInitialized.current);
      return;
    }

    const docRef = doc(db, 'vinted', 'conversations');
    // Only save the 30 most recent conversations to stay under 1MB limit
    const toSave = vintedConversations.slice(0, 30);
    console.log('Saving to Firebase:', toSave.length, 'of', vintedConversations.length, 'conversations');
    setDoc(docRef, { conversations: toSave })
      .then(() => console.log('Save complete'))
      .catch((err) => console.error('Firebase save error:', err));
  }, [vintedConversations, isLoading]);

  // Hot reload for JSON changes in development (marketplace only, not vinted)
  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('./data/conversations.json', (newModule) => {
        if (newModule) {
          setConversations(newModule.default.conversations);
        }
      });
      // NOTE: Removed vinted-conversations.json hot reload to prevent overwriting Firebase data
    }
  }, []);

  const handleSendMessage = useCallback((conversationId, text) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === conversationId) {
          const newMessage = {
            id: `m${conv.messages.length + 1}`,
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            status: 'sent'
          };

          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: {
              text,
              timestamp: newMessage.timestamp,
              isFromMe: true
            }
          };
        }
        return conv;
      })
    );

    // Simulate status update to delivered after 1s
    setTimeout(() => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.senderId === 'me' && lastMessage.status === 'sent') {
              lastMessage.status = 'delivered';
            }
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        })
      );
    }, 1000);

    // Simulate status update to read after 2s
    setTimeout(() => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.senderId === 'me' && lastMessage.status === 'delivered') {
              lastMessage.status = 'read';
            }
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        })
      );
    }, 2000);
  }, []);

  // Combined conversations for editor context (handles both apps)
  const allConversations = [...conversations, ...vintedConversations];
  const setAllConversations = (updater) => {
    const result = typeof updater === 'function' ? updater(allConversations) : updater;
    // Separate back into marketplace and vinted
    const marketplaceIds = conversations.map(c => c.id);
    const newMarketplace = result.filter(c => marketplaceIds.includes(c.id));
    const newVinted = result.filter(c => !marketplaceIds.includes(c.id));
    setConversations(newMarketplace);
    setVintedConversations(newVinted);
  };

  return (
    <BrowserRouter>
      <EditorProvider
        conversations={allConversations}
        setConversations={setAllConversations}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      >
        <AppContent
          conversations={conversations}
          setConversations={setConversations}
          handleSendMessage={handleSendMessage}
          vintedConversations={vintedConversations}
          setVintedConversations={setVintedConversations}
          vintedBalance={vintedBalance}
        />
      </EditorProvider>
    </BrowserRouter>
  );
}

export default App;
