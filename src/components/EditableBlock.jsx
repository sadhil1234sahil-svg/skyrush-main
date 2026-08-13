import React, { useRef, useEffect, useState } from 'react';

export default function EditableBlock({
  type,
  initialValue,
  align = 'left',
  onChange,
  onTypeChange,
  onAlignChange,
  placeholder = 'Write text here...'
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Helper to ensure list blocks have semantic <li> elements
  const getInitialHTML = (value, blockType) => {
    if (blockType.includes('list')) {
      if (!value || value.trim() === '') {
        return '<li><br></li>';
      }
      if (value.includes('<li>')) {
        return value;
      }
      // Backward compatibility: split existing lines and wrap in <li>
      return value
        .split('\n')
        .filter(Boolean)
        .map((item) => `<li>${item}</li>`)
        .join('');
    }
    return value || '';
  };

  // Sync value changes from parent if editor is not focused
  useEffect(() => {
    if (editorRef.current && !isFocused) {
      const targetHTML = getInitialHTML(initialValue, type);
      if (editorRef.current.innerHTML !== targetHTML) {
        editorRef.current.innerHTML = targetHTML;
      }
    }
  }, [initialValue, type, isFocused]);

  // Save current editor HTML back to parent state
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Run formatting commands using browser document.execCommand API
  const applyFormat = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  // Prompt user for link URL
  const insertLink = () => {
    const selection = window.getSelection().toString();
    const url = prompt('Enter link URL:', 'https://');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  // Render correct HTML5 tag based on selected block type
  const getTag = () => {
    switch (type) {
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'bullet-list': return 'ul';
      case 'numbered-list': return 'ol';
      default: return 'div';
    }
  };

  const Tag = getTag();

  return (
    <div className="editable-block-wrapper" style={{ position: 'relative', width: '100%', marginBottom: '6px' }}>
      {/* Notion-style Inline Formatting Toolbar */}
      {isFocused && (
        <div 
          className="inline-editor-toolbar" 
          contentEditable={false} 
          style={{ userSelect: 'none' }}
          onMouseDown={(e) => e.preventDefault()} // Keep focus on contentEditable!
        >
          {/* Block Type Dropdown */}
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="toolbar-select"
            title="Convert Block Type"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
            <option value="bullet-list">Bulleted List</option>
            <option value="numbered-list">Numbered List</option>
          </select>

          <div className="toolbar-divider" />

          {/* Alignments */}
          <button
            type="button"
            className={`toolbar-btn ${align === 'left' ? 'active' : ''}`}
            onClick={() => onAlignChange('left')}
            title="Align Left"
          >
            <i className="bx bx-align-left"></i>
          </button>
          <button
            type="button"
            className={`toolbar-btn ${align === 'center' ? 'active' : ''}`}
            onClick={() => onAlignChange('center')}
            title="Align Center"
          >
            <i className="bx bx-align-middle"></i>
          </button>

          <div className="toolbar-divider" />

          {/* Formatting Toggles */}
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat('bold')}
            title="Bold"
          >
            <b>B</b>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => applyFormat('italic')}
            title="Italic"
          >
            <i>I</i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={insertLink}
            title="Link"
          >
            <i className="bx bx-link"></i>
          </button>
        </div>
      )}

      {/* contentEditable Element */}
      <Tag
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          handleInput();
        }}
        className={`editable-block-editor ${type}`}
        data-placeholder={placeholder}
        style={{
          outline: 'none',
          minHeight: '42px',
          padding: '10px 14px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#ffffff',
          width: '100%',
          textAlign: align,
          fontFamily: 'Poppins, sans-serif',
          margin: 0
        }}
      />
    </div>
  );
}
