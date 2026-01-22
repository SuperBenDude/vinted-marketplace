import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableField, EditableImage } from './editor';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputBar from './InputBar';
import './ConversationView.css';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function formatMessageDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toUpperCase();
  return `${day} ${time}`;
}

export default function ConversationView({ conversations, onSendMessage }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const {
    editMode,
    updateParticipant,
    updateProduct,
    addMessage
  } = useEditor();

  const [showAddMessage, setShowAddMessage] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageSender, setNewMessageSender] = useState('me');

  const conversation = conversations.find((c) => c.id === id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="conversation-not-found">
        <p>Conversation not found</p>
        <button onClick={() => navigate('/')}>Go back</button>
      </div>
    );
  }

  const { participant, product, messages, isTyping } = conversation;

  const shouldShowAvatar = (index) => {
    if (index === messages.length - 1) return true;
    const currentMessage = messages[index];
    const nextMessage = messages[index + 1];
    return currentMessage.senderId !== nextMessage.senderId;
  };

  const isLastInGroup = (index) => {
    if (index === messages.length - 1) return true;
    const currentMessage = messages[index];
    const nextMessage = messages[index + 1];
    return currentMessage.senderId !== nextMessage.senderId;
  };

  const handleSendMessage = (text) => {
    onSendMessage(conversation.id, text);
  };

  const handleAddMessage = () => {
    if (newMessageText.trim()) {
      addMessage(conversation.id, {
        text: newMessageText.trim(),
        senderId: newMessageSender,
        status: 'read'
      });
      setNewMessageText('');
      setShowAddMessage(false);
    }
  };

  // Get first message timestamp for date display
  const firstMessageDate = messages.length > 0 ? formatMessageDate(messages[0].timestamp) : '';

  return (
    <div className="conversation-container">
      {/* Header */}
      <header className="conversation-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0866ff" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="header-product-thumb">
          <EditableImage
            src={product.image}
            alt=""
            onSave={(newImage) => updateProduct(conversation.id, { image: newImage })}
            className="header-thumb-img-wrapper"
          />
        </div>

        <div className="header-info">
          <span className="header-title-text">
            <span className="header-name">
              <EditableField
                value={participant.name}
                onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
              />
            </span>
            <span className="header-separator"> · </span>
            <span className="header-product">
              <EditableField
                value={truncateText(product.title, 15)}
                onSave={(newTitle) => updateProduct(conversation.id, { title: newTitle })}
              />
            </span>
          </span>
        </div>
      </header>

      {editMode && (
        <div className="edit-mode-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Mode Active - Click elements to edit
        </div>
      )}

      {/* Scrollable Content */}
      <div className="messages-scroll-container">
        {/* Product Card */}
        <div className="product-hero">
          <div className="product-hero-image-wrapper">
            <EditableImage
              src={product.image}
              alt={product.title}
              onSave={(newImage) => updateProduct(conversation.id, { image: newImage })}
              className="product-hero-image-editable"
            />
          </div>
          <h2 className="product-hero-title">
            <EditableField
              value={participant.name}
              onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
            />
            {' · '}
            <EditableField
              value={truncateText(product.title, 25)}
              onSave={(newTitle) => updateProduct(conversation.id, { title: newTitle })}
            />
          </h2>
          <p className="product-hero-subtitle">{participant.name} changed the group photo.</p>
          <p className="product-hero-started">
            {participant.name} started this chat. <button className="view-profile-link">View buyer profile</button>
          </p>
          <p className="meta-disclaimer">
            To help identify and reduce scams and fraud, Meta may use technology to review Marketplace messages.
          </p>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={message.id}>
              {index === 0 && (
                <div className="message-date-divider">
                  {firstMessageDate}
                </div>
              )}
              <MessageBubble
                message={message}
                isFromMe={message.senderId === 'me'}
                showAvatar={shouldShowAvatar(index) && message.senderId !== 'me'}
                avatar={participant.avatar}
                isLastInGroup={isLastInGroup(index)}
                isLastMessage={index === messages.length - 1}
                conversationId={conversation.id}
              />
            </div>
          ))}

          {isTyping && (
            <TypingIndicator avatar={participant.avatar} />
          )}

          {/* Add Message Button in Edit Mode */}
          {editMode && (
            <div className="add-message-section">
              {showAddMessage ? (
                <div className="add-message-form">
                  <select
                    value={newMessageSender}
                    onChange={(e) => setNewMessageSender(e.target.value)}
                    className="sender-select"
                  >
                    <option value="me">You (sent)</option>
                    <option value={participant.id}>{participant.name} (received)</option>
                  </select>
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Enter message text..."
                    className="message-text-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                  />
                  <div className="add-message-actions">
                    <button onClick={() => setShowAddMessage(false)} className="cancel-add-btn">
                      Cancel
                    </button>
                    <button onClick={handleAddMessage} className="confirm-add-btn">
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="add-message-btn"
                  onClick={() => setShowAddMessage(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Message
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <InputBar onSendMessage={handleSendMessage} />
    </div>
  );
}
