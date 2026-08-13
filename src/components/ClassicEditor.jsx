import React, { useRef, useEffect, useState } from 'react';

export default function ClassicEditor({ value, onChange, placeholder = 'Start writing your blog post...' }) {
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'code'
  const [wordCount, setWordCount] = useState(0);

  // Helper to count words by stripping HTML tags
  const computeWordCount = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  };

  useEffect(() => {
    setWordCount(computeWordCount(value));
  }, [value]);

  // Load value into contentEditable ref when switching to visual mode
  useEffect(() => {
    if (activeTab === 'visual' && editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [activeTab]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Run native document formatting commands
  const handleFormat = (command, val = null) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = () => {
    if (activeTab !== 'visual') return;
    const url = prompt('Enter link URL:', 'https://');
    if (url) {
      handleFormat('createLink', url);
    }
  };

  // Insert image media at current cursor position
  const handleAddMedia = () => {
    const url = prompt('Enter Image URL to insert into article:', 'https://');
    if (url) {
      if (activeTab === 'visual') {
        handleFormat('insertImage', url);
      } else {
        const textarea = document.getElementById('classic-editor-raw');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const imgTag = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 15px 0;" />`;
          const newValue = value.substring(0, start) + imgTag + value.substring(end);
          onChange(newValue);
        }
      }
    }
  };

  return (
    <div className="classic-editor-container">
      {/* Editor Top Bar (Add Media + View Tabs) */}
      <div className="classic-editor-top-bar">
        <button
          type="button"
          onClick={handleAddMedia}
          className="add-media-btn"
        >
          <i className="bx bx-image-add" style={{ marginRight: '6px' }}></i> Add Media
        </button>

        <div className="tab-selectors">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => setActiveTab('visual')}
          >
            Visual
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        </div>
      </div>

      {/* Fixed Editor Toolbar */}
      <div className={`classic-editor-toolbar ${activeTab !== 'visual' ? 'disabled' : ''}`}>
        <select
          onChange={(e) => handleFormat('formatBlock', e.target.value)}
          defaultValue="<p>"
          className="toolbar-dropdown"
          disabled={activeTab !== 'visual'}
        >
          <option value="<p>">Paragraph</option>
          <option value="<h1>">Heading 1</option>
          <option value="<h2>">Heading 2</option>
          <option value="<h3>">Heading 3</option>
          <option value="<h4>">Heading 4</option>
          <option value="<h5>">Heading 5</option>
          <option value="<h6>">Heading 6</option>
          <option value="<blockquote>">Blockquote</option>
          <option value="<pre>">Preformatted</option>
        </select>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }}
          disabled={activeTab !== 'visual'}
          title="Bold"
        >
          <i className="bx bx-bold"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }}
          disabled={activeTab !== 'visual'}
          title="Italic"
        >
          <i className="bx bx-italic"></i>
        </button>
        
        <div className="toolbar-divider" />
        
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }}
          disabled={activeTab !== 'visual'}
          title="Bulleted List"
        >
          <i className="bx bx-list-ul"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('insertOrderedList'); }}
          disabled={activeTab !== 'visual'}
          title="Numbered List"
        >
          <i className="bx bx-list-ol"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('formatBlock', '<blockquote>'); }}
          disabled={activeTab !== 'visual'}
          title="Blockquote"
        >
          <i className="bx bx-double-quotes-l"></i>
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyLeft'); }}
          disabled={activeTab !== 'visual'}
          title="Align Left"
        >
          <i className="bx bx-align-left"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyCenter'); }}
          disabled={activeTab !== 'visual'}
          title="Align Center"
        >
          <i className="bx bx-align-middle"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('justifyRight'); }}
          disabled={activeTab !== 'visual'}
          title="Align Right"
        >
          <i className="bx bx-align-right"></i>
        </button>

        <div className="toolbar-divider" />

        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          disabled={activeTab !== 'visual'}
          title="Insert Link"
        >
          <i className="bx bx-link"></i>
        </button>
        <button
          type="button"
          className="toolbar-icon-btn"
          onMouseDown={(e) => { e.preventDefault(); handleFormat('unlink'); }}
          disabled={activeTab !== 'visual'}
          title="Remove Link"
        >
          <i className="bx bx-link-external" style={{ transform: 'rotate(180deg)', display: 'inline-block' }}></i>
        </button>
      </div>

      {/* Editor Content Area (+400% height boost) */}
      <div className="classic-editor-body">
        {activeTab === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="classic-editor-visual-area"
            data-placeholder={placeholder}
            style={{
              outline: 'none',
              minHeight: '400px',
              padding: '20px',
              background: '#ffffff',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#334155',
              overflowY: 'auto'
            }}
          />
        ) : (
          <textarea
            id="classic-editor-raw"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="classic-editor-code-area"
            placeholder="Write raw HTML here..."
            style={{
              width: '100%',
              minHeight: '400px',
              border: 'none',
              padding: '20px',
              fontFamily: 'Courier New, monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#0f172a',
              background: '#f8fafc',
              resize: 'vertical',
              outline: 'none',
              display: 'block',
              boxSizing: 'border-box'
            }}
          />
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="classic-editor-status-bar">
        <span className="word-count">Word count: {wordCount}</span>
        <span className="last-edit">Last edited by admin</span>
      </div>
    </div>
  );
}
