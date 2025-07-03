import React from 'react';
import './FormField.css';

interface UrlInputProps {
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

const UrlInput: React.FC<UrlInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'https://example.com',
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenUrl = () => {
    if (value && isValidUrl(value)) {
      window.open(value, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="url-input-container">
        <input
          type="url"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="form-input url-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {value && isValidUrl(value) && (
          <button
            type="button"
            onClick={handleOpenUrl}
            className="url-open-button"
            title="Open link in new tab"
            disabled={disabled}
          >
            ↗
          </button>
        )}
      </div>
      {error && (
        <div id={`${name}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}

    </div>
  );
};

export default UrlInput;