import { useState, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import './EditableImage.css';

export default function EditableImage({
  src,
  alt = '',
  onSave,
  className = ''
}) {
  const { editMode } = useEditor();
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);
  const fileInputRef = useRef(null);

  const handleClick = (e) => {
    if (editMode) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(imageUrl);
    setShowModal(false);
  };

  const handleCancel = () => {
    setImageUrl(src);
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`editable-image-wrapper ${className} ${editMode ? 'edit-mode' : ''}`}
        onClick={handleClick}
      >
        <img src={src} alt={alt} className="editable-image" />
        {editMode && (
          <div className="edit-image-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {showModal && (
        <div className="image-edit-modal-overlay" onClick={handleCancel}>
          <div className="image-edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Image</h3>

            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
            </div>

            <div className="image-edit-options">
              <div className="option-section">
                <label>Upload Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="option-divider">or</div>

              <div className="option-section">
                <label>Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
