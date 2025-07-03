import { Template } from '../types';

export const resumeTemplates: Template[] = [
  {
    id: 'traditional-1',
    name: 'Classic Professional',
    category: 'Traditional',
    description:
      'A timeless, professional layout perfect for corporate environments and traditional industries.',
    preview: '/templates/traditional-1-preview.jpg',
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
      text: '#2c3e50',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Georgia, serif',
      secondary: 'Arial, sans-serif',
    },
    layout: 'single-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'traditional-2',
    name: 'Executive Formal',
    category: 'Traditional',
    description:
      'An elegant, formal design suitable for executive positions and senior management roles.',
    preview: '/templates/traditional-2-preview.jpg',
    colors: {
      primary: '#1a1a1a',
      secondary: '#555555',
      accent: '#8b0000',
      text: '#1a1a1a',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Times New Roman, serif',
      secondary: 'Arial, sans-serif',
    },
    layout: 'two-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'modern-1',
    name: 'Contemporary Clean',
    category: 'Modern',
    description:
      'A sleek, modern design with clean lines and contemporary typography.',
    preview: '/templates/modern-1-preview.jpg',
    colors: {
      primary: '#2c3e50',
      secondary: '#95a5a6',
      accent: '#e74c3c',
      text: '#2c3e50',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Roboto, sans-serif',
      secondary: 'Open Sans, sans-serif',
    },
    layout: 'two-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'modern-2',
    name: 'Minimalist Pro',
    category: 'Modern',
    description:
      'A minimalist approach with plenty of white space and modern aesthetics.',
    preview: '/templates/modern-2-preview.jpg',
    colors: {
      primary: '#34495e',
      secondary: '#bdc3c7',
      accent: '#f39c12',
      text: '#2c3e50',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Montserrat, sans-serif',
      secondary: 'Source Sans Pro, sans-serif',
    },
    layout: 'single-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'creative-1',
    name: 'Design Portfolio',
    category: 'Creative',
    description:
      'A vibrant, creative layout perfect for designers, artists, and creative professionals.',
    preview: '/templates/creative-1-preview.jpg',
    colors: {
      primary: '#8e44ad',
      secondary: '#9b59b6',
      accent: '#e67e22',
      text: '#2c3e50',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Playfair Display, serif',
      secondary: 'Lato, sans-serif',
    },
    layout: 'three-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: false,
  },
  {
    id: 'creative-2',
    name: 'Artistic Expression',
    category: 'Creative',
    description:
      'Bold and expressive design for creative industries and portfolio showcases.',
    preview: '/templates/creative-2-preview.jpg',
    colors: {
      primary: '#2980b9',
      secondary: '#3498db',
      accent: '#f1c40f',
      text: '#2c3e50',
      background: '#ecf0f1',
    },
    fonts: {
      primary: 'Oswald, sans-serif',
      secondary: 'Merriweather, serif',
    },
    layout: 'two-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: false,
  },
  {
    id: 'technical-1',
    name: 'Developer Focus',
    category: 'Technical',
    description:
      'A technical layout optimized for software developers and IT professionals.',
    preview: '/templates/technical-1-preview.jpg',
    colors: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Fira Code, monospace',
      secondary: 'Inter, sans-serif',
    },
    layout: 'two-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'technical-2',
    name: 'Engineering Pro',
    category: 'Technical',
    description:
      'Professional layout for engineers, researchers, and technical specialists.',
    preview: '/templates/technical-2-preview.jpg',
    colors: {
      primary: '#065f46',
      secondary: '#059669',
      accent: '#dc2626',
      text: '#111827',
      background: '#ffffff',
    },
    fonts: {
      primary: 'JetBrains Mono, monospace',
      secondary: 'System UI, sans-serif',
    },
    layout: 'single-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'executive-1',
    name: 'Leadership Elite',
    category: 'Executive',
    description:
      'Premium design for C-level executives and senior leadership positions.',
    preview: '/templates/executive-1-preview.jpg',
    colors: {
      primary: '#1f2937',
      secondary: '#4b5563',
      accent: '#d97706',
      text: '#111827',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Crimson Text, serif',
      secondary: 'Source Sans Pro, sans-serif',
    },
    layout: 'two-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
  {
    id: 'executive-2',
    name: 'Corporate Excellence',
    category: 'Executive',
    description:
      'Sophisticated design emphasizing leadership experience and achievements.',
    preview: '/templates/executive-2-preview.jpg',
    colors: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#7c3aed',
      text: '#0f172a',
      background: '#ffffff',
    },
    fonts: {
      primary: 'Cormorant Garamond, serif',
      secondary: 'Inter, sans-serif',
    },
    layout: 'single-column',
    supportsPrint: true,
    supportsMobile: true,
    supportsWechat: true,
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return resumeTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (
  category: Template['category']
): Template[] => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getWechatCompatibleTemplates = (): Template[] => {
  return resumeTemplates.filter(template => template.supportsWechat);
};

export const getPrintFriendlyTemplates = (): Template[] => {
  return resumeTemplates.filter(template => template.supportsPrint);
};

export const getMobileFriendlyTemplates = (): Template[] => {
  return resumeTemplates.filter(template => template.supportsMobile);
};
