import React from 'react';
import './FormField.css';

interface CheckboxInputProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  checked,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  className = '',
  description,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <div className="form-checkbox-wrapper">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className="form-checkbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        <label htmlFor={name} className="form-label checkbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      </div>
      {description && (
        <div className="checkbox-description">
          {description}
        </div>
      )}
      {error && (
        <div id={`${name}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}

    </div>
  );
};

export default CheckboxInput;