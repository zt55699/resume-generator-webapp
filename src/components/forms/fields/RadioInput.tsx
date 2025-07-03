import React from 'react';
import './FormField.css';

interface RadioInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  options: string[];
}

const RadioInput: React.FC<RadioInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  className = '',
  options,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <div className='form-label'>
        {label}
        {required && <span className='required'>*</span>}
      </div>
      <div className='radio-group'>
        {options.map((option, index) => (
          <div key={option} className='form-radio-wrapper'>
            <input
              type='radio'
              id={`${name}-${index}`}
              name={name}
              value={option}
              checked={value === option}
              onChange={handleChange}
              onBlur={onBlur}
              disabled={disabled}
              className='form-radio'
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
            <label htmlFor={`${name}-${index}`} className='radio-label'>
              {option}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <div id={`${name}-error`} className='form-error' role='alert'>
          {error}
        </div>
      )}
    </div>
  );
};

export default RadioInput;
