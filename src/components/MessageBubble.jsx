import { useEditor } from '../context/EditorContext';
import { EditableField } from './editor';
import './MessageBubble.css';

export default function MessageBubble({ message, isFromMe, showAvatar, avatar, isLastInGroup, isLastMessage, conversationId }) {
  const { editMode, updateMessage, deleteMessage } = useEditor();

  // Check if message is just a thumbs up emoji
  const isThumbsUp = message.text === '👍';

  const handleTextSave = (newText) => {
    updateMessage(conversationId, message.id, { text: newText });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Delete this message?')) {
      deleteMessage(conversationId, message.id);
    }
  };

  // For received thumbs up, show as large icon
  if (isThumbsUp && !isFromMe) {
    return (
      <div className={`message-row received ${editMode ? 'edit-mode' : ''}`}>
        <div className="avatar-space">
          {showAvatar && (
            <img src={avatar} alt="" className="message-avatar" />
          )}
        </div>
        <div className="thumbs-up-large">
          {editMode ? (
            <EditableField
              value="👍"
              onSave={handleTextSave}
            />
          ) : (
            '👍'
          )}
        </div>
        {editMode && (
          <button className="delete-message-btn" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // For sent thumbs up, show as large blue thumb
  if (isThumbsUp && isFromMe) {
    return (
      <div className={`message-row sent ${editMode ? 'edit-mode' : ''}`}>
        {editMode && (
          <button className="delete-message-btn" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
        <div className="thumbs-up-container">
          <div className="thumbs-up-large-sent">
            {editMode ? (
              <EditableField
                value="👍"
                onSave={handleTextSave}
              />
            ) : (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="#0866ff">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
            )}
          </div>
          {isLastMessage && message.status === 'read' && (
            <img src={avatar} alt="" className="read-receipt-avatar" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`message-row ${isFromMe ? 'sent' : 'received'} ${editMode ? 'edit-mode' : ''}`}>
      {!isFromMe && (
        <div className="avatar-space">
          {showAvatar && (
            <img src={avatar} alt="" className="message-avatar" />
          )}
        </div>
      )}

      {editMode && isFromMe && (
        <button className="delete-message-btn" onClick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      )}

      <div className="bubble-container">
        <div className={`message-bubble ${isFromMe ? 'sent' : 'received'}`}>
          <span className="message-text">
            <EditableField
              value={message.text}
              onSave={handleTextSave}
            />
          </span>
        </div>

        {/* Read receipt avatar for sent messages */}
        {isFromMe && isLastMessage && message.status === 'read' && (
          <div className="read-receipt-container">
            <img src={avatar} alt="" className="read-receipt-avatar" />
          </div>
        )}
      </div>

      {editMode && !isFromMe && (
        <button className="delete-message-btn" onClick={handleDelete}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
}
