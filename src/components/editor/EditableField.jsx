import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import './EditableField.css';

export default function EditableField({
  value,
  onSave,
  className = '',
  type = 'text',
  multiline = false,
  placeholder = 'Enter text...'
}) {
  const { editMode } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    if (editMode) {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editValue !== value) {
      onSave(type === 'number' ? parseFloat(editValue) || 0 : editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef}
        type={type === 'number' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`editable-input ${className} ${multiline ? 'multiline' : ''}`}
      />
    );
  }

  return (
    <span
      className={`editable-field ${className} ${editMode ? 'edit-mode' : ''}`}
      onClick={handleClick}
    >
      {value || placeholder}
    </span>
  );
}
