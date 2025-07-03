import React from 'react';
import './FormField.css';

interface SelectInputProps {
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
  options: string[];
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  className = '',
  options,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className="form-select"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${name}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectInput;