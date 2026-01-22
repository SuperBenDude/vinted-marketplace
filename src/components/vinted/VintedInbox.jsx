import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor } from '../../context/EditorContext';
import { EditableField, EditableImage } from '../editor';
import VintedSettings from './VintedSettings';
import './VintedInbox.css';

function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

export default function VintedInbox({ conversations }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages');
  const [showSettings, setShowSettings] = useState(false);
  const { editMode, updateParticipant, updateProduct, deleteConversation, updateConversation } = useEditor();

  const handleConversationClick = (conversationId) => {
    if (!editMode) {
      // Mark as read when clicking
      updateConversation(conversationId, { unreadCount: 0 });
      navigate(`/vinted/conversation/${conversationId}`);
    }
  };

  const handleDelete = (e, conversationId) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const unreadCount = conversations.filter(c => c.unreadCount > 0).length;

  return (
    <div className="vinted-inbox">
      {/* Header */}
      <header className="vinted-inbox-header">
        <h1>Inbox</h1>
      </header>

      {/* Tabs */}
      <div className="vinted-tabs">
        <button
          className={`vinted-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages {conversations.length > 99 ? '99+' : conversations.length}
        </button>
        <button
          className={`vinted-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
          disabled
        >
          Notifications 99+
        </button>
      </div>

      {editMode && (
        <div className="vinted-edit-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Mode Active
        </div>
      )}

      {/* Conversation List */}
      <div className="vinted-conversation-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`vinted-conversation-item ${editMode ? 'edit-mode' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="vinted-avatar-wrapper">
              {conversation.participant.avatar ? (
                <EditableImage
                  src={conversation.participant.avatar}
                  alt={conversation.participant.name}
                  onSave={(newImage) => updateParticipant(conversation.id, { avatar: newImage })}
                  className="vinted-avatar"
                />
              ) : (
                conversation.participant.avatarColor ? (
                  <div className="vinted-avatar-placeholder has-color"
                       style={{ backgroundColor: conversation.participant.avatarColor }}>
                    <span className="vinted-avatar-initial">{getInitial(conversation.participant.name)}</span>
                  </div>
                ) : (
                  <img src="/default-avatar.png" alt="" className="vinted-default-avatar" />
                )
              )}
            </div>

            <div className="vinted-conversation-content">
              <div className="vinted-conversation-header">
                <span className="vinted-username">
                  <EditableField
                    value={conversation.participant.name}
                    onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
                  />
                </span>
                <span className="vinted-time">{formatTimeAgo(conversation.lastMessage.timestamp)}</span>
              </div>
              <div className="vinted-conversation-preview">
                {conversation.lastMessage.text}
              </div>
              {conversation.product && (
                <div className="vinted-product-thumb">
                  <EditableImage
                    src={conversation.product.image}
                    alt={conversation.product.title}
                    onSave={(newImage) => updateProduct(conversation.id, { image: newImage })}
                    className="vinted-product-image"
                  />
                </div>
              )}
            </div>

            {editMode && (
              <button
                className="vinted-delete-btn"
                onClick={(e) => handleDelete(e, conversation.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="vinted-bottom-nav">
        <button className="vinted-nav-item" onClick={() => navigate('/menu/vinted')}>
          <div className="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 10.5L12 4l9 6.5V21H15M9 21H3V10.5" strokeLinejoin="round" />
              <path d="M9 21V14h6v7" strokeLinejoin="round" />
            </svg>
          </div>
          <span>Home</span>
        </button>
        <button className="vinted-nav-item">
          <div className="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M15.5 15.5L21 21" strokeLinecap="round" />
            </svg>
          </div>
          <span>Search</span>
        </button>
        <button className="vinted-nav-item">
          <div className="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12h8" strokeLinecap="round" />
            </svg>
          </div>
          <span>Sell</span>
        </button>
        <button className="vinted-nav-item active">
          <div className="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            {unreadCount > 0 && (
              <div className="vinted-nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>
            )}
          </div>
          <span>Inbox</span>
        </button>
        <button className="vinted-nav-item" onClick={() => setShowSettings(true)}>
          <div className="nav-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-2c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v2" />
            </svg>
          </div>
          <span>Profile</span>
        </button>
      </nav>

      <VintedSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
