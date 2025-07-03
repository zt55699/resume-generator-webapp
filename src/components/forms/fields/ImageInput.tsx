import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  createFileUpload,
  formatFileSize,
  ACCEPTED_IMAGE_TYPES,
} from '../../../utils/fileUtils';
import { FileUpload } from '../../../types';
import './FormField.css';

interface ImageInputProps {
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
  allowCrop?: boolean;
  cropAspectRatio?: number;
}

const ImageInput: React.FC<ImageInputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder = 'Choose image or drag and drop',
  required = false,
  disabled = false,
  error,
  className = '',
  maxSize = 10 * 1024 * 1024, // 10MB
  allowCrop = false,
  cropAspectRatio,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      console.error('Invalid file type');
      return;
    }

    if (file.size > maxSize) {
      console.error('File too large');
      return;
    }

    setIsUploading(true);

    try {
      if (allowCrop) {
        const imageUrl = URL.createObjectURL(file);
        setImageSrc(imageUrl);
        setShowCrop(true);
      } else {
        const fileUpload = await createFileUpload(file, 'image');
        onChange(fileUpload);
      }
    } catch (error) {
      console.error('Error processing image:', error);
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

  const handleRemoveImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(
      async blob => {
        if (!blob) return;

        const croppedFile = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        try {
          const fileUpload = await createFileUpload(croppedFile, 'image');
          onChange(fileUpload);
          setShowCrop(false);
          setImageSrc('');
        } catch (error) {
          console.error('Error processing cropped image:', error);
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const handleCropCancel = () => {
    setShowCrop(false);
    setImageSrc('');
    URL.revokeObjectURL(imageSrc);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label htmlFor={name} className='form-label'>
        {label}
        {required && <span className='required'>*</span>}
      </label>

      {!showCrop && (
        <>
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
              {isUploading ? 'Uploading...' : 'Browse Images'}
            </button>

            <input
              ref={fileInputRef}
              type='file'
              id={name}
              name={name}
              onChange={handleInputChange}
              onBlur={onBlur}
              disabled={disabled}
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              style={{ display: 'none' }}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${name}-error` : undefined}
            />
          </div>

          {value && (
            <div className='form-file-preview'>
              <div className='form-file-item'>
                <div>
                  <img
                    src={value.url}
                    alt='Preview'
                    className='form-image-preview'
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  <div className='form-file-name'>{value.file.name}</div>
                  <div className='form-file-size'>
                    {formatFileSize(value.file.size)}
                  </div>
                </div>
                <button
                  type='button'
                  className='form-file-remove'
                  onClick={handleRemoveImage}
                  disabled={disabled}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showCrop && (
        <div className='crop-container'>
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={cropAspectRatio}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt='Crop'
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </ReactCrop>
          <div className='crop-actions'>
            <button
              type='button'
              onClick={handleCropComplete}
              disabled={!completedCrop}
            >
              Apply Crop
            </button>
            <button type='button' onClick={handleCropCancel}>
              Cancel
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

export default ImageInput;
