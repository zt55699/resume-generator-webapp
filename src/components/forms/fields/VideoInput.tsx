import React, { useState, useRef } from 'react';
import {
  createFileUpload,
  formatFileSize,
  ACCEPTED_VIDEO_TYPES,
} from '../../../utils/fileUtils';
import { FileUpload } from '../../../types';
import './FormField.css';

interface VideoInputProps {
  name: string;
  label: string;
  value?: FileUpload;
  onChange: (value: FileUpload | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxSize?: number;
}

const VideoInput: React.FC<VideoInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Choose video or drag and drop',
  required = false,
  disabled = false,
  error,
  className = '',
  maxSize = 50 * 1024 * 1024, // 50MB
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      console.error('Invalid file type');
      return;
    }

    if (file.size > maxSize) {
      console.error('File too large');
      return;
    }

    setIsUploading(true);

    try {
      const fileUpload = await createFileUpload(file, 'video');
      onChange(fileUpload);
    } catch (error) {
      console.error('Error processing video:', error);
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

  const handleRemoveVideo = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {isUploading ? 'Uploading...' : 'Browse Videos'}
        </button>

        <input
          ref={fileInputRef}
          type='file'
          id={name}
          name={name}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          accept={ACCEPTED_VIDEO_TYPES.join(',')}
          style={{ display: 'none' }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      </div>

      {value && (
        <div className='form-file-preview'>
          <div className='form-file-item'>
            <div>
              <video
                src={value.url}
                controls
                className='form-video-preview'
                style={{ maxWidth: '300px', maxHeight: '200px' }}
              />
              <div className='form-file-name'>{value.file.name}</div>
              <div className='form-file-size'>
                {formatFileSize(value.file.size)}
              </div>
            </div>
            <button
              type='button'
              className='form-file-remove'
              onClick={handleRemoveVideo}
              disabled={disabled}
            >
              Remove
            </button>
          </div>
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

export default VideoInput;
