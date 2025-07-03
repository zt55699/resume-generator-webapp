import React, { useState, useRef, useEffect } from 'react';
import './FormField.css';

interface MultiSelectInputProps {
  name: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  options: string[];
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Select options',
  required = false,
  disabled = false,
  error,
  className = '',
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleToggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const handleRemoveTag = (option: string) => {
    const newValue = value.filter(v => v !== option);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue && !value.includes(inputValue)) {
        onChange([...value, inputValue]);
        setInputValue('');
      }
    }
  };

  const filteredOptions = options.filter(
    option =>
      option.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(option)
  );

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className='form-label'>
        {label}
        {required && <span className='required'>*</span>}
      </label>
      <div className='multiselect-container' ref={containerRef}>
        <div
          className='multiselect-input'
          onClick={() => !disabled && setIsOpen(true)}
        >
          {value.map(option => (
            <div key={option} className='multiselect-tag'>
              {option}
              <span
                className='multiselect-tag-remove'
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveTag(option);
                }}
              >
                ×
              </span>
            </div>
          ))}
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              flex: 1,
              minWidth: '100px',
            }}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        </div>
        {isOpen && !disabled && (
          <div className='multiselect-dropdown'>
            {filteredOptions.length === 0 ? (
              <div className='multiselect-option'>
                {inputValue ? `Add "${inputValue}"` : 'No options available'}
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option}
                  className={`multiselect-option ${value.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleToggleOption(option)}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && (
        <div id={`${name}-error`} className='form-error' role='alert'>
          {error}
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;
