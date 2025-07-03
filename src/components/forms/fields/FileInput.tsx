import React, { useState, useRef } from 'react';
import { createFileUpload, formatFileSize } from '../../../utils/fileUtils';
import { FileUpload } from '../../../types';
import './FormField.css';

interface FileInputProps {
  name: string;
  label: string;
  value?: FileUpload[];
  onChange: (value: FileUpload[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  acceptedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
}

const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  value = [],
  onChange,
  onBlur,
  placeholder = 'Choose files or drag and drop',
  required = false,
  disabled = false,
  error,
  className = '',
  acceptedTypes = [],
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newFiles: FileUpload[] = [];

    try {
      for (let i = 0; i < files.length && newFiles.length < maxFiles; i++) {
        const file = files[i];

        // Determine file type
        let fileType: 'image' | 'video' | 'document' = 'document';
        if (file.type.startsWith('image/')) {
          fileType = 'image';
        } else if (file.type.startsWith('video/')) {
          fileType = 'video';
        }

        try {
          const fileUpload = await createFileUpload(file, fileType);
          newFiles.push(fileUpload);
        } catch (error) {
          console.error('Error processing file:', error);
        }
      }

      const updatedFiles = [...value, ...newFiles].slice(0, maxFiles);
      onChange(updatedFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = value.filter(file => file.id !== fileId);
    onChange(updatedFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className='form-label'>
        {label}
        {required && <span className='required'>*</span>}
      </label>

      <div
        className={`form-drag-drop ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='form-drag-drop-text'>{placeholder}</div>
        <button
          type='button'
          className='form-drag-drop-button'
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Browse Files'}
        </button>

        <input
          ref={fileInputRef}
          type='file'
          id={name}
          name={name}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          accept={acceptedTypes.join(',')}
          multiple={maxFiles > 1}
          style={{ display: 'none' }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>

      {value.length > 0 && (
        <div className='form-file-preview'>
          <ul className='form-file-list'>
            {value.map(file => (
              <li key={file.id} className='form-file-item'>
                <div>
                  <div className='form-file-name'>{file.file.name}</div>
                  <div className='form-file-size'>
                    {formatFileSize(file.file.size)}
                  </div>
                </div>
                <button
                  type='button'
                  className='form-file-remove'
                  onClick={() => handleRemoveFile(file.id)}
                  disabled={disabled}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div id={`${name}-error`} className='form-error' role='alert'>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileInput;
