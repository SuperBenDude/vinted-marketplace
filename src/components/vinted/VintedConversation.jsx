import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { EditableField, EditableImage } from '../editor';
import './VintedConversation.css';

export default function VintedConversation({ conversations, onUpdateConversation }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const {
    editMode,
    updateParticipant,
    updateProduct,
    addMessage,
    updateConversation
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
      <div className="vinted-not-found">
        <p>Conversation not found</p>
        <button onClick={() => navigate('/vinted')}>Go back</button>
      </div>
    );
  }

  const { participant, product, messages, offer, transaction } = conversation;

  const handleAddMessage = () => {
    if (newMessageText.trim()) {
      addMessage(conversation.id, {
        text: newMessageText.trim(),
        senderId: newMessageSender,
        type: 'text'
      });
      setNewMessageText('');
      setShowAddMessage(false);
    }
  };

  const handleAcceptOffer = () => {
    updateConversation(conversation.id, {
      offer: { ...offer, status: 'accepted' }
    });
  };

  const handleDeclineOffer = () => {
    updateConversation(conversation.id, {
      offer: { ...offer, status: 'declined' }
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Check if this is a completed sale
  const isCompletedSale = transaction && transaction.status === 'complete';

  return (
    <div className="vinted-conversation">
      {/* Header */}
      <header className="vinted-conv-header">
        <button className="vinted-back-btn" onClick={() => navigate('/vinted')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div className="vinted-conv-header-info">
          <EditableField
            value={participant.name}
            onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
            className="vinted-conv-username"
          />
        </div>
        <button className="vinted-info-btn" aria-label="Information">
          <svg fill="none" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="currentColor" d="M13 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 3a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0v-5.5A.75.75 0 0 0 12 10"></path>
            <path fill="currentColor" d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11m0-1.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19"></path>
          </svg>
        </button>
      </header>

      {editMode && (
        <div className="vinted-edit-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Mode Active
        </div>
      )}

      {/* Scrollable Content */}
      <div className="vinted-conv-content">
        {/* Product Card */}
        <div className="vinted-product-card">
          <div className="vinted-product-image-wrapper">
            <EditableImage
              src={product.image}
              alt={product.title}
              onSave={(newImage) => updateProduct(conversation.id, { image: newImage })}
              className="vinted-product-img"
            />
          </div>
          <div className="vinted-product-details">
            <h3 className="vinted-product-title">
              <EditableField
                value={product.title}
                onSave={(newTitle) => updateProduct(conversation.id, { title: newTitle })}
              />
            </h3>
            <div className="vinted-product-price">
              <EditableField
                value={`£${product.price.toFixed(2)}`}
                onSave={(newPrice) => {
                  const price = parseFloat(newPrice.replace('£', ''));
                  if (!isNaN(price)) updateProduct(conversation.id, { price });
                }}
              />
            </div>
            {product.subtotal && (
              <div className="vinted-product-subtotal">
                £{product.subtotal.toFixed(2)} incl. <span className="vinted-bp-icon"><svg fill="none" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="m7.924 4.114.708.707-2.829 2.828-2.121-2.121.707-.707 1.414 1.414z"></path><path fill="currentColor" fillRule="evenodd" d="M11 6c0 4.2-5 6-5 6s-5-1.8-5-6V1.8L6 0l5 1.8zM2 6V2.503l4-1.44 4 1.44V6c0 1.66-.98 2.902-2.115 3.787A9.4 9.4 0 0 1 6 10.917a9.368 9.368 0 0 1-1.885-1.13C2.981 8.902 2 7.66 2 6m3.66 5.06" clipRule="evenodd"></path></svg></span> (subtotal for buyer)
              </div>
            )}
          </div>
        </div>

        {/* Make an offer button */}
        <button className="vinted-make-offer-btn">Make an offer</button>
        <div className="vinted-offer-divider"></div>

        {/* User Info Card */}
        <div className="vinted-message-row">
          <div className="vinted-user-card">
            <div className="vinted-user-greeting">
              Hi, I'm <EditableField
                value={participant.name}
                onSave={(newName) => updateParticipant(conversation.id, { name: newName })}
              />
            </div>
            <div className="vinted-user-meta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
              </svg>
              <span>
                <EditableField
                  value={participant.location || 'United Kingdom'}
                  onSave={(newLocation) => updateParticipant(conversation.id, { location: newLocation })}
                />
              </span>
            </div>
            <div className="vinted-user-meta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Last seen {participant.lastSeen || '9 hours ago'}</span>
            </div>
          </div>
        </div>

        {/* Offer Card (separate, if pending) */}
        {offer && offer.status === 'pending' && (
          <div className="vinted-message-row">
            <div className="vinted-offer-card-pending">
              <div className="vinted-offer-prices">
                <span className="vinted-offer-amount">
                  <EditableField
                    value={`£${offer.amount.toFixed(2)}`}
                    onSave={(newAmount) => {
                      const amount = parseFloat(newAmount.replace('£', ''));
                      if (!isNaN(amount)) {
                        updateConversation(conversation.id, {
                          offer: { ...offer, amount }
                        });
                      }
                    }}
                  />
                </span>
                <span className="vinted-offer-original">£{offer.originalPrice.toFixed(2)}</span>
              </div>
              <div className="vinted-offer-status">Pending</div>
              <div className="vinted-offer-actions">
                <button className="vinted-accept-btn" onClick={handleAcceptOffer}>Accept</button>
              </div>
              <div className="vinted-offer-secondary">
                <button className="vinted-decline-btn" onClick={handleDeclineOffer}>Decline</button>
                <button className="vinted-counter-btn">Offer your price</button>
              </div>
            </div>
            {/* Avatar positioned at bottom left of offer card */}
            <div className="vinted-card-avatar">
              {participant.avatar ? (
                <EditableImage
                  src={participant.avatar}
                  alt={participant.name}
                  onSave={(newImage) => updateParticipant(conversation.id, { avatar: newImage })}
                  className="vinted-card-avatar-img"
                />
              ) : (
                <img src="/default-avatar.png" alt="" className="vinted-card-avatar-img" />
              )}
            </div>
          </div>
        )}

        {/* Accepted Offer Card */}
        {offer && offer.status === 'accepted' && (
          <div className="vinted-offer-card accepted">
            <div className="vinted-offer-prices">
              <span className="vinted-offer-amount">£{offer.amount.toFixed(2)}</span>
              <span className="vinted-offer-original">£{offer.originalPrice.toFixed(2)}</span>
            </div>
            <div className="vinted-offer-status accepted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Accepted
            </div>
          </div>
        )}

        {/* Transaction Timeline (for completed sales) */}
        {isCompletedSale && (
          <div className="vinted-transaction-timeline">
            <div className="vinted-timeline-date">02/08/2025</div>

            <div className="vinted-timeline-item">
              <div className="vinted-timeline-title">Sold (send before {transaction.sendBefore})</div>
              <div className="vinted-timeline-desc">
                After the buyer receives this order, £{transaction.amount.toFixed(2)} will be transferred to your Balance. The buyer also bought you a shipping label. Get it and send the item.
              </div>
            </div>

            <div className="vinted-timeline-item">
              <div className="vinted-timeline-title">Order shipped</div>
              <div className="vinted-timeline-desc">This order was successfully shipped</div>
            </div>

            <div className="vinted-timeline-date">05/08/2025</div>

            <div className="vinted-timeline-item">
              <div className="vinted-timeline-title">Delivered</div>
              <div className="vinted-timeline-desc">
                Package was delivered (<a href="#" className="vinted-link">Tracking information</a>)
              </div>
            </div>

            <div className="vinted-timeline-date">09/08/2025</div>

            <div className="vinted-timeline-item">
              <div className="vinted-timeline-title">Auto-feedback received</div>
              <div className="vinted-timeline-desc">
                We've left auto-feedback for {participant.name}. Enter your own feedback to replace it.
              </div>
            </div>

            <div className="vinted-sale-complete">
              <div className="vinted-sale-complete-title">Your sale is complete!</div>
              <div className="vinted-sale-complete-desc">
                You'll receive £{transaction.amount.toFixed(2)} in <a href="#" className="vinted-link">your balance</a> soon.
              </div>
              <div className="vinted-sale-complete-cta">
                Keep the momentum going and list another item.
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="vinted-messages">
          {messages.filter(m => m.type !== 'offer').map((message) => (
            <div
              key={message.id}
              className={`vinted-message ${message.senderId === 'me' ? 'sent' : 'received'}`}
            >
              <div className="vinted-message-bubble">
                <EditableField
                  value={message.text}
                  onSave={(newText) => {
                    // Update message text
                  }}
                />
              </div>
            </div>
          ))}

          {/* Add Message Button in Edit Mode */}
          {editMode && (
            <div className="vinted-add-message-section">
              {showAddMessage ? (
                <div className="vinted-add-message-form">
                  <select
                    value={newMessageSender}
                    onChange={(e) => setNewMessageSender(e.target.value)}
                    className="vinted-sender-select"
                  >
                    <option value="me">You (sent)</option>
                    <option value={participant.id}>{participant.name} (received)</option>
                  </select>
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Enter message text..."
                    className="vinted-message-input"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMessage()}
                  />
                  <div className="vinted-add-actions">
                    <button onClick={() => setShowAddMessage(false)} className="vinted-cancel-btn">Cancel</button>
                    <button onClick={handleAddMessage} className="vinted-confirm-btn">Add</button>
                  </div>
                </div>
              ) : (
                <button className="vinted-add-message-btn" onClick={() => setShowAddMessage(true)}>
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

      {/* Safety Banner */}
      <div className="vinted-safety-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3.5 6v6c0 5.25 3.6 10.15 8.5 11.35 4.9-1.2 8.5-6.1 8.5-11.35V6L12 2z" fill="#17a5ad"/>
          <path d="M9 12l2 2 4-4" stroke="#07141c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Stay safe on Vinted. Don't share personal data, click on external links, or scan QR codes. <a href="#">More safety tips</a></span>
        <button className="vinted-safety-close">×</button>
      </div>

      {/* Input Bar */}
      <div className="vinted-input-bar">
        <button className="vinted-camera-btn" aria-label="Upload photo">
          <svg fill="none" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <g fill="currentColor" clipPath="url(#Camera24__a)">
              <path d="M13.5 8.25a4.75 4.75 0 1 0-.001 9.5 4.75 4.75 0 0 0 0-9.5ZM10.25 13a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0"></path>
              <path d="M11.824 3h2.967c1.428 0 2.255.995 2.746 2.201.191.471.65.78 1.158.78h1.553a2.75 2.75 0 0 1 2.75 2.75v9.519a2.75 2.75 0 0 1-2.75 2.75h-16.5a2.75 2.75 0 0 1-2.75-2.75V8.73a2.75 2.75 0 0 1 2.75-2.75H7.92a1.25 1.25 0 0 0 1.158-.779C9.568 3.995 10.396 3 11.824 3m0 1.5c-.798 0-1.1.636-1.356 1.266A2.75 2.75 0 0 1 7.92 7.48H6.498V19.5h13.75c.69 0 1.25-.56 1.25-1.25V8.73c0-.69-.56-1.25-1.25-1.25h-1.553a2.75 2.75 0 0 1-2.548-1.714c-.256-.63-.558-1.266-1.356-1.266zm-6.826 15V7.48h-1.25c-.69 0-1.25.56-1.25 1.25v9.52c0 .69.56 1.25 1.25 1.25z"></path>
            </g>
            <defs>
              <clipPath id="Camera24__a">
                <path fill="currentColor" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </button>
        <input
          type="text"
          placeholder="Write a message here"
          className="vinted-message-field"
        />
      </div>
    </div>
  );
}
