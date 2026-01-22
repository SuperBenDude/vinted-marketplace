import { useNavigate } from 'react-router-dom';
import { useEditor } from '../context/EditorContext';
import './AppMenu.css';

export default function AppMenu({ currentApp }) {
  const navigate = useNavigate();
  const { toggleEditMode, editMode } = useEditor();

  const handleEditMode = () => {
    toggleEditMode();
    // Go back to the app
    if (currentApp === 'messenger') {
      navigate('/');
    } else {
      navigate('/vinted');
    }
  };

  const handleSwitchApp = () => {
    if (currentApp === 'messenger') {
      navigate('/vinted');
    } else {
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentApp === 'messenger') {
      navigate('/');
    } else {
      navigate('/vinted');
    }
  };

  return (
    <div className={`app-menu ${currentApp}`}>
      <div className="app-menu-content">
        <h2 className="app-menu-title">Menu</h2>

        <div className="app-menu-options">
          <button className="app-menu-option" onClick={handleEditMode}>
            <div className="option-icon edit-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div className="option-text">
              <span className="option-title">{editMode ? 'Disable' : 'Enable'} Edit Mode</span>
              <span className="option-desc">
                {editMode ? 'Turn off editing and return to app' : 'Click elements to edit text, images, and more'}
              </span>
            </div>
            <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <button className="app-menu-option" onClick={handleSwitchApp}>
            <div className={`option-icon switch-icon ${currentApp === 'messenger' ? 'vinted' : 'messenger'}`}>
              {currentApp === 'messenger' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}
            </div>
            <div className="option-text">
              <span className="option-title">Switch to {currentApp === 'messenger' ? 'Vinted' : 'Messenger'}</span>
              <span className="option-desc">
                {currentApp === 'messenger' ? 'Open Vinted inbox' : 'Open Messenger inbox'}
              </span>
            </div>
            <svg className="option-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <button className="app-menu-back" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to {currentApp === 'messenger' ? 'Messenger' : 'Vinted'}
        </button>
      </div>
    </div>
  );
}
