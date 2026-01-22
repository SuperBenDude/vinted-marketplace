import { useNavigate } from 'react-router-dom';
import { useEditor } from '../context/EditorContext';
import { EditableField, EditableImage } from './editor';
import './InboxList.css';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const currentYear = now.getFullYear();

  if (year === currentYear) {
    return `${day} ${month}`;
  }
  return `${day} ${month} ${year}`;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function InboxList({ conversations }) {
  const navigate = useNavigate();
  const { editMode, updateParticipant, updateProduct, deleteConversation } = useEditor();

  const handleConversationClick = (conversationId) => {
    if (!editMode) {
      navigate(`/conversation/${conversationId}`);
    }
  };

  const handleDelete = (e, conversationId) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  const renderStatusIcon = (conversation, index) => {
    if (conversation.lastMessage.isFromMe) {
      return (
        <div className="status-check-circle">
          <svg viewBox="0 0 24 24" fill="#ffffff">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      );
    }

    if (index === 0 || index === 3) {
      return (
        <img
          src={conversation.participant.avatar}
          alt=""
          className="status-avatar"
        />
      );
    }

    return (
      <div className="status-person-icon">
        <svg viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    );
  };

  return (
    <div className="inbox-container">
      <header className="inbox-header">
        <button className="header-back-btn" onClick={() => navigate('/menu/messenger')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="header-title">Marketplace</h1>
        <div className="header-spacer"></div>
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

      <div className="conversation-list">
        {conversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className={`conversation-item ${editMode ? 'edit-mode' : ''}`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="product-thumbnail-wrapper">
              <EditableImage
                src={conversation.product.image}
                alt={conversation.product.title}
                onSave={(newImage) => updateProduct(conversation.id, { image: newImage })}
                className="product-thumbnail-editable"
              />
            </div>

            <div className="conversation-content">
              <div className="conversation-line1">
                <EditableField
                  value={conversation.participant.name}
                  onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
                />
                {' · '}
                <EditableField
                  value={truncateText(conversation.product.title, 14)}
                  onSave={(newTitle) => updateProduct(conversation.id, { title: newTitle })}
                />
              </div>

              <div className="conversation-line2">
                {conversation.lastMessage.isFromMe ? 'You: ' : `${conversation.participant.name}: `}
                {conversation.lastMessage.text === '👍' ? '👍' : truncateText(conversation.lastMessage.text, 12)} · {formatTimestamp(conversation.lastMessage.timestamp)}
              </div>
            </div>

            <div className="conversation-status">
              {editMode ? (
                <button
                  className="delete-conversation-btn"
                  onClick={(e) => handleDelete(e, conversation.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              ) : (
                renderStatusIcon(conversation, index)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
