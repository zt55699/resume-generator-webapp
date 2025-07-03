import React from 'react';
import './FormField.css';

interface DateInputProps {
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
  min?: string;
  max?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  min,
  max,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="form-input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        min={min}
        max={max}
      />
      {error && (
        <div id={`${name}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default DateInput;