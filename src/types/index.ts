export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profilePhoto?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrentPosition: boolean;
  location: string;
  description: string;
  achievements: string[];
  companyLogo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  url?: string;
  githubUrl?: string;
  images: string[];
  videos: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateIssued: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  references: Reference[];
  customSections: CustomSection[];
}

export interface Template {
  id: string;
  name: string;
  category: 'Traditional' | 'Modern' | 'Creative' | 'Technical' | 'Executive';
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  layout: 'single-column' | 'two-column' | 'three-column';
  supportsPrint: boolean;
  supportsMobile: boolean;
  supportsWechat: boolean;
}

export interface FieldConfig {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'file' | 'image' | 'video' | 'richtext' | 'number' | 'url' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[];
  section: 'personalInfo' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'references' | 'customSections';
  order: number;
  visible: boolean;
  fileConfig?: {
    acceptedTypes: string[];
    maxSize: number;
    maxFiles: number;
  };
}

export interface ExportOptions {
  format: 'html' | 'pdf' | 'docx';
  template: string;
  includeProfilePhoto: boolean;
  includePortfolioImages: boolean;
  includePortfolioVideos: boolean;
  paperSize?: 'a4' | 'letter' | 'legal';
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  quality?: 'low' | 'medium' | 'high';
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FileUpload {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video' | 'document';
  compressed?: boolean;
  thumbnail?: string;
}

export interface WechatConfig {
  appId: string;
  bundleSize: number;
  maxBundleSize: number;
  features: {
    sharing: boolean;
    localStorage: boolean;
    camera: boolean;
    location: boolean;
  };
}

export interface AppConfig {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
  debugMode: boolean;
  analytics: boolean;
  wechat: WechatConfig;
}