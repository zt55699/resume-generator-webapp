import { FileUpload } from '../types';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const validateFile = (
  file: File,
  type: 'image' | 'video' | 'document'
): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 10MB';
  }

  let acceptedTypes: string[] = [];
  switch (type) {
    case 'image':
      acceptedTypes = ACCEPTED_IMAGE_TYPES;
      break;
    case 'video':
      acceptedTypes = ACCEPTED_VIDEO_TYPES;
      break;
    case 'document':
      acceptedTypes = ACCEPTED_DOCUMENT_TYPES;
      break;
  }

  if (!acceptedTypes.includes(file.type)) {
    return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`;
  }

  return null;
};

export const compressImage = (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

export const generateThumbnail = (
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate thumbnail dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Get frame at 1 second
      };

      video.onseeked = () => {
        let { videoWidth: width, videoHeight: height } = video;

        // Calculate thumbnail dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(video, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      video.onerror = () => reject(new Error('Video loading failed'));
      video.src = URL.createObjectURL(file);
    } else {
      reject(new Error('Unsupported file type for thumbnail generation'));
    }
  });
};

export const createFileUpload = async (
  file: File,
  type: 'image' | 'video' | 'document'
): Promise<FileUpload> => {
  const validationError = validateFile(file, type);
  if (validationError) {
    throw new Error(validationError);
  }

  let processedFile = file;
  let thumbnail: string | undefined;

  if (type === 'image') {
    processedFile = await compressImage(file);
    thumbnail = await generateThumbnail(processedFile);
  } else if (type === 'video') {
    thumbnail = await generateThumbnail(file);
  }

  const fileUpload: FileUpload = {
    id: crypto.randomUUID(),
    file: processedFile,
    url: URL.createObjectURL(processedFile),
    type,
    compressed: type === 'image',
    thumbnail,
  };

  return fileUpload;
};

export const downloadFile = (
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
) => {
  const blob =
    typeof content === 'string'
      ? new Blob([content], { type: mimeType })
      : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
