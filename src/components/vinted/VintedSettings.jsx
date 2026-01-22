import { useState, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import './VintedSettings.css';

// Random username generator - creates realistic usernames like you'd see on Vinted
const generateRandomUsername = (genderMode = 'mix') => {
  const femaleNames = ['emma', 'olivia', 'sophie', 'chloe', 'mia', 'emily', 'grace', 'lucy', 'jessica', 'amy', 'hannah', 'lily', 'sarah', 'lauren', 'katie', 'charlotte', 'ella', 'holly', 'natalie', 'jade', 'rebecca', 'anna', 'rachel', 'victoria', 'beth', 'zoe', 'alice', 'molly', 'ruby', 'ellie', 'megan', 'paige', 'amber', 'freya', 'isabelle', 'georgia', 'poppy', 'evie', 'brooke', 'millie'];
  const maleNames = ['james', 'jack', 'oliver', 'harry', 'charlie', 'thomas', 'george', 'oscar', 'william', 'noah', 'alfie', 'jacob', 'leo', 'ethan', 'archie', 'joshua', 'max', 'henry', 'lucas', 'mason', 'daniel', 'logan', 'alexander', 'dylan', 'jake', 'connor', 'callum', 'jamie', 'ryan', 'luke', 'adam', 'nathan', 'ben', 'sam', 'joe', 'matt', 'tom', 'dan', 'mike', 'chris'];
  const surnames = ['smith', 'jones', 'wilson', 'brown', 'taylor', 'davies', 'evans', 'thomas', 'johnson', 'roberts', 'walker', 'wright', 'robinson', 'thompson', 'white', 'hughes', 'edwards', 'green', 'hall', 'wood', 'harris', 'lewis', 'martin', 'jackson', 'clarke', 'clark', 'turner', 'hill', 'scott', 'moore', 'cooper', 'ward', 'morris', 'king', 'watson', 'baker', 'patel', 'ali', 'khan', 'ahmed'];

  // Pick first name based on gender mode
  let firstName;
  if (genderMode === 'female') {
    firstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
  } else if (genderMode === 'male') {
    firstName = maleNames[Math.floor(Math.random() * maleNames.length)];
  } else if (genderMode === 'maleFocus') {
    firstName = Math.random() < 0.8
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  } else {
    firstName = Math.random() < 0.5
      ? femaleNames[Math.floor(Math.random() * femaleNames.length)]
      : maleNames[Math.floor(Math.random() * maleNames.length)];
  }

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const initial = firstName[0];
  const year = 1985 + Math.floor(Math.random() * 40);
  const shortYear = year % 100;
  const yearStr = shortYear < 10 ? '0' + shortYear : String(shortYear);
  const fullYear = 1990 + Math.floor(Math.random() * 36);
  const num2 = String(Math.floor(Math.random() * 99)).padStart(2, '0');
  const num3 = Math.floor(Math.random() * 999);

  // Casual words people actually use in usernames
  const words = ['rad', 'chill', 'real', 'just', 'the', 'its', 'hey', 'yo', 'big', 'lil', 'mr', 'cool', 'top', 'pro', 'dj'];

  // Pick a random username style
  const rand = Math.random();

  if (rand < 0.12) {
    // initial + surname: jsmith, kwilson
    return `${initial}${surname}`;
  } else if (rand < 0.20) {
    // two initials + surname: djsmith
    const initial2 = 'abcdefghjklmnprstw'[Math.floor(Math.random() * 18)];
    return `${initial}${initial2}${surname}`;
  } else if (rand < 0.32) {
    // firstname + numbers: sam387, jonah_01, emma99
    const sep = Math.random() < 0.3 ? '_' : '';
    return `${firstName}${sep}${num2}`;
  } else if (rand < 0.44) {
    // surname + year: wilson99, taylor01
    return `${surname}${yearStr}`;
  } else if (rand < 0.52) {
    // firstname + surname: emmawilson, jakesmith
    return `${firstName}${surname}`;
  } else if (rand < 0.60) {
    // firstname + initial: emmaj, jakew
    return `${firstName}${surname[0]}`;
  } else if (rand < 0.68) {
    // surname + random nums: wilson247, smith89
    return `${surname}${num3}`;
  } else if (rand < 0.76) {
    // firstname + year: emma97, jake01
    return `${firstName}${yearStr}`;
  } else if (rand < 0.82) {
    // firstname_surname: emma_wilson
    return `${firstName}_${surname}`;
  } else if (rand < 0.90) {
    // word + year: rad2025, chill99
    const word = words[Math.floor(Math.random() * words.length)];
    return Math.random() < 0.5 ? `${word}${fullYear}` : `${word}${yearStr}`;
  } else {
    // word + name or word + numbers: realjake, bigben, cool42
    const word = words[Math.floor(Math.random() * words.length)];
    return Math.random() < 0.6 ? `${word}${firstName}` : `${word}${num3}`;
  }
};

// Generate random time within a date range
const generateRandomTime = (startDate, endDate) => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
};

// Format relative time
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
};

// Generate random avatar for the 30% that get one
// Distribution: 50% colored initial, 10% black, 20% sunset, 10% far shot men, 10% nature
const generateRandomAvatar = (username) => {
  const rand = Math.random() * 100;

  if (rand < 50) {
    // 50% - Colored background with initials
    return { avatar: null, avatarColor: `hsl(${Math.random() * 360}, 50%, 50%)` };
  } else if (rand < 60) {
    // 10% - Just black
    return { avatar: null, avatarColor: '#1a1a1a' };
  } else if (rand < 80) {
    // 20% - Sunset/landscape photos
    const sunsetSeeds = ['sunset', 'dusk', 'dawn', 'sky', 'horizon', 'beach', 'mountain', 'ocean'];
    const seed = sunsetSeeds[Math.floor(Math.random() * sunsetSeeds.length)] + Math.floor(Math.random() * 100);
    return { avatar: `https://picsum.photos/seed/${seed}/150/150`, avatarColor: null };
  } else if (rand < 90) {
    // 10% - Far shot men (using specific pravatar male images - far/full body style)
    // pravatar images 11-15, 52-57, 60-65 tend to be male
    const maleIds = [11, 12, 13, 14, 15, 52, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 65, 68, 69, 70];
    const maleId = maleIds[Math.floor(Math.random() * maleIds.length)];
    return { avatar: `https://i.pravatar.cc/150?img=${maleId}`, avatarColor: null };
  } else {
    // 10% - Nature/random photos
    return { avatar: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/150/150`, avatarColor: null };
  }
};

export default function VintedSettings({ isOpen, onClose }) {
  const { setConversations, conversations } = useEditor();
  const [numChats, setNumChats] = useState(5);
  const [defaultReadStatus, setDefaultReadStatus] = useState('unread');
  const [randomizeNames, setRandomizeNames] = useState(true);
  const [genderMode, setGenderMode] = useState('mix');
  const [customUsernames, setCustomUsernames] = useState('');
  const [randomizeTimes, setRandomizeTimes] = useState(true);
  const [timeRangeDays, setTimeRangeDays] = useState(7);
  const [productImage, setProductImage] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  // Offer settings
  const [offerPercentage, setOfferPercentage] = useState(0);
  const [randomizeOfferPrice, setRandomizeOfferPrice] = useState(true);
  const [fixedOfferPrice, setFixedOfferPrice] = useState('');
  const [offerPriceMin, setOfferPriceMin] = useState('10');
  const [offerPriceMax, setOfferPriceMax] = useState('50');
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target.result);
        setCropPosition({ x: 0, y: 0 });
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Target aspect ratio 3:4 (1080x1440)
      const targetWidth = 1080;
      const targetHeight = 1440;
      const aspectRatio = targetWidth / targetHeight;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Calculate crop dimensions
      let cropWidth, cropHeight;
      if (img.width / img.height > aspectRatio) {
        // Image is wider - crop width
        cropHeight = img.height;
        cropWidth = cropHeight * aspectRatio;
      } else {
        // Image is taller - crop height
        cropWidth = img.width;
        cropHeight = cropWidth / aspectRatio;
      }

      // Apply crop position offset (percentage based)
      const maxOffsetX = img.width - cropWidth;
      const maxOffsetY = img.height - cropHeight;
      const offsetX = (cropPosition.x / 100) * maxOffsetX;
      const offsetY = (cropPosition.y / 100) * maxOffsetY;

      ctx.drawImage(
        img,
        offsetX, offsetY, cropWidth, cropHeight,
        0, 0, targetWidth, targetHeight
      );

      setProductImage(canvas.toDataURL('image/jpeg', 0.9));
      setShowCropper(false);
      setOriginalImage('');
    };

    img.src = originalImage;
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage('');
  };

  const handleBulkCreate = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - (timeRangeDays * 24 * 60 * 60 * 1000));

    // Parse custom usernames if provided
    const customNamesList = customUsernames
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    const newConversations = [];

    for (let i = 0; i < numChats; i++) {
      // Determine username
      let username;
      if (randomizeNames) {
        username = generateRandomUsername(genderMode);
      } else if (customNamesList.length > 0) {
        username = customNamesList[i % customNamesList.length];
      } else {
        username = `user_${i + 1}`;
      }

      // Determine timestamp
      const timestamp = randomizeTimes
        ? generateRandomTime(startDate, now)
        : new Date(now.getTime() - (i * 3600000)); // 1 hour apart if not random

      // 30% chance to have a profile picture or colored initial, 70% default silhouette
      const hasCustomAvatar = Math.random() < 0.3;
      const avatarData = hasCustomAvatar
        ? generateRandomAvatar(username)
        : { avatar: null, avatarColor: null };

      // Determine if this conversation has an offer
      const hasOffer = Math.random() * 100 < offerPercentage;
      const basePrice = parseFloat(productPrice) || 25.00;
      let offerData = null;

      if (hasOffer) {
        let offerAmount;
        if (randomizeOfferPrice) {
          const min = parseFloat(offerPriceMin) || 10;
          const max = parseFloat(offerPriceMax) || 50;
          // Round to nearest £5
          offerAmount = Math.round((min + Math.random() * (max - min)) / 5) * 5;
        } else {
          // Round fixed price to nearest £5 as well
          offerAmount = Math.round((parseFloat(fixedOfferPrice) || 20) / 5) * 5;
        }

        offerData = {
          amount: offerAmount,
          originalPrice: basePrice,
          status: 'pending'
        };
      }

      const lastMessageText = hasOffer
        ? `Hi! Would you sell this for £${offerData.amount.toFixed(2)}?`
        : 'Hi! Is this still available?';

      const conversation = {
        id: `conv_${Date.now()}_${i}`,
        participant: {
          id: `user_${Date.now()}_${i}`,
          name: username,
          avatar: avatarData.avatar,
          avatarColor: avatarData.avatarColor,
          location: 'United Kingdom',
          lastSeen: formatTimeAgo(timestamp)
        },
        product: {
          id: `prod_${Date.now()}_${i}`,
          title: productTitle || 'New Product',
          price: basePrice,
          originalPrice: basePrice * 1.5,
          currency: 'GBP',
          image: productImage || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
          subtotal: basePrice * 1.05,
          status: 'available'
        },
        offer: offerData,
        messages: [],
        lastMessage: {
          text: lastMessageText,
          timestamp: timestamp.toISOString(),
          isFromMe: false
        },
        unreadCount: defaultReadStatus === 'unread' ? 1 : 0,
        timeAgo: formatTimeAgo(timestamp),
        _timestamp: timestamp.getTime() // For sorting
      };

      newConversations.push(conversation);
    }

    // Sort chronologically (newest first)
    newConversations.sort((a, b) => b._timestamp - a._timestamp);

    // Remove the sorting helper
    newConversations.forEach(conv => delete conv._timestamp);

    // Add to existing conversations and sort all
    setConversations(prev => {
      const all = [...newConversations, ...prev];
      return all.sort((a, b) => {
        const timeA = new Date(a.lastMessage?.timestamp || 0).getTime();
        const timeB = new Date(b.lastMessage?.timestamp || 0).getTime();
        return timeB - timeA;
      });
    });

    onClose();
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete all conversations?');
    if (confirmed) {
      setConversations([]);
      onClose();
    }
  };

  return (
    <div className="vinted-settings-overlay" onClick={onClose}>
      <div className="vinted-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vinted-settings-header">
          <h2>Vinted Settings</h2>
          <button className="vinted-settings-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="vinted-settings-content">
          {/* Bulk Creation Section */}
          <div className="vinted-settings-section">
            <h3>Bulk Create Conversations</h3>

            <div className="vinted-settings-field">
              <label>Number of Chats</label>
              <input
                type="number"
                min="1"
                max="500"
                value={numChats}
                onChange={(e) => setNumChats(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="vinted-settings-field">
              <label>Default Status</label>
              <select
                value={defaultReadStatus}
                onChange={(e) => setDefaultReadStatus(e.target.value)}
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>

          {/* Username Settings */}
          <div className="vinted-settings-section">
            <h3>Username Settings</h3>

            <div className="vinted-settings-checkbox">
              <input
                type="checkbox"
                id="randomizeNames"
                checked={randomizeNames}
                onChange={(e) => setRandomizeNames(e.target.checked)}
              />
              <label htmlFor="randomizeNames">Generate random human-like usernames</label>
            </div>

            {randomizeNames && (
              <div className="vinted-settings-field">
                <label>Username Gender</label>
                <select
                  value={genderMode}
                  onChange={(e) => setGenderMode(e.target.value)}
                >
                  <option value="mix">Mixed (50/50)</option>
                  <option value="female">Female Only</option>
                  <option value="male">Male Only</option>
                  <option value="maleFocus">Male Focus (80/20)</option>
                </select>
              </div>
            )}

            {!randomizeNames && (
              <div className="vinted-settings-field">
                <label>Custom Usernames (one per line)</label>
                <textarea
                  value={customUsernames}
                  onChange={(e) => setCustomUsernames(e.target.value)}
                  placeholder="Enter usernames, one per line..."
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Time Settings */}
          <div className="vinted-settings-section">
            <h3>Time Settings</h3>

            <div className="vinted-settings-checkbox">
              <input
                type="checkbox"
                id="randomizeTimes"
                checked={randomizeTimes}
                onChange={(e) => setRandomizeTimes(e.target.checked)}
              />
              <label htmlFor="randomizeTimes">Randomize message times</label>
            </div>

            {randomizeTimes && (
              <div className="vinted-settings-field">
                <label>Time Range (days)</label>
                <select
                  value={timeRangeDays}
                  onChange={(e) => setTimeRangeDays(parseInt(e.target.value))}
                >
                  <option value="1">Last 24 hours</option>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last week</option>
                  <option value="14">Last 2 weeks</option>
                  <option value="30">Last month</option>
                </select>
              </div>
            )}
          </div>

          {/* Product Settings */}
          <div className="vinted-settings-section">
            <h3>Default Product</h3>

            <div className="vinted-settings-field">
              <label>Product Title</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Nike Air Max 90"
              />
            </div>

            <div className="vinted-settings-field">
              <label>Product Price (£)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="e.g. 85.00"
              />
            </div>

            <div className="vinted-settings-field">
              <label>Product Image</label>
              <div className="vinted-image-upload">
                {productImage ? (
                  <div className="vinted-image-preview">
                    <img src={productImage} alt="Product preview" />
                    <button onClick={() => setProductImage('')}>Remove</button>
                  </div>
                ) : (
                  <button
                    className="vinted-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Image
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Offer Settings */}
          <div className="vinted-settings-section">
            <h3>Offer Settings</h3>

            <div className="vinted-settings-field">
              <label>Percentage with Offers ({offerPercentage}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={offerPercentage}
                onChange={(e) => setOfferPercentage(parseInt(e.target.value))}
              />
            </div>

            {offerPercentage > 0 && (
              <>
                <div className="vinted-settings-checkbox">
                  <input
                    type="checkbox"
                    id="randomizeOfferPrice"
                    checked={randomizeOfferPrice}
                    onChange={(e) => setRandomizeOfferPrice(e.target.checked)}
                  />
                  <label htmlFor="randomizeOfferPrice">Randomize offer prices</label>
                </div>

                {randomizeOfferPrice ? (
                  <div className="vinted-settings-row">
                    <div className="vinted-settings-field">
                      <label>Min Price (£)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={offerPriceMin}
                        onChange={(e) => setOfferPriceMin(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div className="vinted-settings-field">
                      <label>Max Price (£)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={offerPriceMax}
                        onChange={(e) => setOfferPriceMax(e.target.value)}
                        placeholder="50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="vinted-settings-field">
                    <label>Fixed Offer Price (£)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={fixedOfferPrice}
                      onChange={(e) => setFixedOfferPrice(e.target.value)}
                      placeholder="e.g. 20.00"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="vinted-settings-actions">
            <button className="vinted-btn-secondary" onClick={handleClearAll}>
              Clear All Conversations
            </button>
            <button className="vinted-btn-primary" onClick={handleBulkCreate}>
              Create {numChats} Conversation{numChats !== 1 ? 's' : ''}
            </button>
          </div>
        </div>

        <div className="vinted-settings-footer">
          <p>Current conversations: {conversations.length}</p>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="vinted-cropper-overlay">
          <div className="vinted-cropper-modal">
            <div className="vinted-cropper-header">
              <h3>Crop Image (3:4)</h3>
              <button className="vinted-settings-close" onClick={handleCropCancel}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="vinted-cropper-content">
              <div className="vinted-cropper-preview" ref={cropperRef}>
                <img src={originalImage} alt="Crop preview" />
                <div
                  className="vinted-crop-overlay"
                  style={{
                    '--crop-x': `${cropPosition.x}%`,
                    '--crop-y': `${cropPosition.y}%`
                  }}
                />
              </div>
              <div className="vinted-cropper-controls">
                <div className="vinted-crop-slider">
                  <label>Horizontal Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cropPosition.x}
                    onChange={(e) => setCropPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="vinted-crop-slider">
                  <label>Vertical Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cropPosition.y}
                    onChange={(e) => setCropPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <div className="vinted-cropper-actions">
              <button className="vinted-btn-secondary" onClick={handleCropCancel}>
                Cancel
              </button>
              <button className="vinted-btn-primary" onClick={handleCropConfirm}>
                Crop & Use
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
