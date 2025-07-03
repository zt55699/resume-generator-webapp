import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import './FormField.css';

interface RichTextInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const RichTextInput: React.FC<RichTextInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Enter your text...',
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const sanitizedValue = useMemo(() => {
    return DOMPurify.sanitize(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = DOMPurify.sanitize(e.target.value);
    onChange(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '\t' + value.substring(end);
      onChange(newValue);
      
      // Restore cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById(name) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = selectedText;
    let newValue = value;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'bullet':
        formattedText = `• ${selectedText}`;
        break;
      case 'number':
        formattedText = `1. ${selectedText}`;
        break;
      default:
        return;
    }

    newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <div className="form-rich-text">
        <div className="rich-text-toolbar">
          <button
            type="button"
            onClick={() => formatText('bold')}
            disabled={disabled}
            title="Bold"
            className="toolbar-button"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            disabled={disabled}
            title="Italic"
            className="toolbar-button"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            disabled={disabled}
            title="Underline"
            className="toolbar-button"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => formatText('bullet')}
            disabled={disabled}
            title="Bullet List"
            className="toolbar-button"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => formatText('number')}
            disabled={disabled}
            title="Numbered List"
            className="toolbar-button"
          >
            1.
          </button>
        </div>
        
        <textarea
          id={name}
          name={name}
          value={sanitizedValue}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="form-textarea rich-text-editor"
          rows={8}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>

      {error && (
        <div id={`${name}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}

    </div>
  );
};

export default RichTextInput;