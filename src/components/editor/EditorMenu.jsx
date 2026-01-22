import { useRef, useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { VintedSettings } from '../vinted';
import './EditorMenu.css';

export default function EditorMenu() {
  const {
    isEditorOpen,
    closeEditor,
    editMode,
    toggleEditMode,
    exportData,
    importData,
    addConversation
  } = useEditor();

  const fileInputRef = useRef(null);
  const [showVintedSettings, setShowVintedSettings] = useState(false);

  if (!isEditorOpen) return null;

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = importData(event.target.result);
        if (success) {
          closeEditor();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleAddConversation = () => {
    addConversation({
      participantName: 'New User',
      productTitle: 'New Product',
      productPrice: 0
    });
    closeEditor();
  };

  return (
    <div className="editor-menu-overlay" onClick={closeEditor}>
      <div className="editor-menu" onClick={(e) => e.stopPropagation()}>
        <div className="editor-menu-header">
          <h2>Editor Menu</h2>
          <button className="editor-close-btn" onClick={closeEditor}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="editor-menu-content">
          <div className="editor-section">
            <h3>Edit Mode</h3>
            <button
              className={`editor-btn ${editMode ? 'active' : ''}`}
              onClick={toggleEditMode}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              {editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
            </button>
            <p className="editor-hint">
              {editMode
                ? 'Click any text, image, or element to edit it'
                : 'Enable edit mode to modify elements'}
            </p>
          </div>

          <div className="editor-section">
            <h3>Add Content</h3>
            <button className="editor-btn" onClick={handleAddConversation}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add New Conversation
            </button>
            <button className="editor-btn" onClick={() => setShowVintedSettings(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              Vinted Settings (Bulk Create)
            </button>
          </div>

          <div className="editor-section">
            <h3>Data Management</h3>
            <button className="editor-btn" onClick={exportData}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Data
            </button>
            <button className="editor-btn" onClick={handleImportClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="editor-menu-footer">
          <p>Press <kbd>Esc</kbd> to close this menu</p>
        </div>
      </div>

      <VintedSettings
        isOpen={showVintedSettings}
        onClose={() => setShowVintedSettings(false)}
      />
    </div>
  );
}
