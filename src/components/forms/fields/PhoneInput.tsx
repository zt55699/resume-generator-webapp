import React from 'react';
import './FormField.css';

interface PhoneInputProps {
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

const PhoneInput: React.FC<PhoneInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '+1 (555) 123-4567',
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className='form-label'>
        {label}
        {required && <span className='required'>*</span>}
      </label>
      <input
        type='tel'
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className='form-input'
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete='tel'
      />
      {error && (
        <div id={`${name}-error`} className='form-error' role='alert'>
          {error}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
