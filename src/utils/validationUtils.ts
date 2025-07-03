import * as yup from 'yup';
import { ResumeData } from '../types';
import { Language } from '../contexts/LanguageContext';

// Language-specific name validation functions
export const validateChineseName = (name: string): boolean => {
  const chineseNameRegex = /^[\u4e00-\u9fa5]{1,4}$/;
  return chineseNameRegex.test(name);
};

export const validateEnglishName = (name: string): boolean => {
  const englishNameRegex = /^[a-zA-Z\s-]{2,50}$/;
  return englishNameRegex.test(name);
};

export const getNameValidationSchema = (
  language: Language,
  fieldName: 'firstName' | 'lastName'
) => {
  if (language === 'zh') {
    return yup
      .string()
      .required(`${fieldName === 'firstName' ? '名字' : '姓氏'}是必填的`)
      .test(
        'chinese-name',
        `${fieldName === 'firstName' ? '名字' : '姓氏'}必须是1-4个中文字符`,
        validateChineseName
      );
  } else {
    return yup
      .string()
      .required(
        `${fieldName === 'firstName' ? 'First name' : 'Last name'} is required`
      )
      .test(
        'english-name',
        `${fieldName === 'firstName' ? 'First name' : 'Last name'} must be 2-50 letters, spaces, or hyphens`,
        validateEnglishName
      );
  }
};

export const personalInfoSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup.string().optional(), // No validation for phone
  address: yup
    .string()
    .required('Address is required')
    .max(100, 'Address must be less than 100 characters'),
  city: yup
    .string()
    .required('City is required')
    .max(50, 'City must be less than 50 characters'),
  state: yup
    .string()
    .required('State is required')
    .max(50, 'State must be less than 50 characters'),
  zipCode: yup
    .string()
    .required('Zip code is required')
    .max(20, 'Zip code must be less than 20 characters'),
  country: yup
    .string()
    .required('Country is required')
    .max(50, 'Country must be less than 50 characters'),
  website: yup.string().url('Invalid website URL').optional(),
  linkedin: yup.string().url('Invalid LinkedIn URL').optional(),
  github: yup.string().url('Invalid GitHub URL').optional(),
  profilePhoto: yup.string().optional(),
  summary: yup
    .string()
    .required('Summary is required')
    .max(500, 'Summary must be less than 500 characters'),
});

export const experienceSchema = yup.object({
  id: yup.string().required(),
  company: yup
    .string()
    .required('Company is required')
    .max(100, 'Company name must be less than 100 characters'),
  position: yup
    .string()
    .required('Position is required')
    .max(100, 'Position must be less than 100 characters'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().when('isCurrentPosition', {
    is: false,
    then: schema => schema.required('End date is required'),
    otherwise: schema => schema.optional(),
  }),
  isCurrentPosition: yup.boolean().default(false),
  location: yup
    .string()
    .required('Location is required')
    .max(100, 'Location must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  achievements: yup
    .array()
    .of(yup.string().max(200, 'Achievement must be less than 200 characters'))
    .default([]),
  companyLogo: yup.string().optional(),
});

export const educationSchema = yup.object({
  id: yup.string().required(),
  institution: yup
    .string()
    .required('Institution is required')
    .max(100, 'Institution name must be less than 100 characters'),
  degree: yup
    .string()
    .required('Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  fieldOfStudy: yup
    .string()
    .required('Field of study is required')
    .max(100, 'Field of study must be less than 100 characters'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  gpa: yup
    .string()
    .matches(/^[0-4](\.[0-9]{1,2})?$/, 'Invalid GPA format')
    .optional(),
  location: yup
    .string()
    .required('Location is required')
    .max(100, 'Location must be less than 100 characters'),
  description: yup
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  achievements: yup
    .array()
    .of(yup.string().max(200, 'Achievement must be less than 200 characters'))
    .default([]),
});

export const skillSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required('Skill name is required')
    .max(50, 'Skill name must be less than 50 characters'),
  level: yup
    .string()
    .oneOf(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .required('Skill level is required'),
  category: yup
    .string()
    .required('Category is required')
    .max(50, 'Category must be less than 50 characters'),
});

export const projectSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required('Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  technologies: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one technology is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  url: yup.string().url('Invalid project URL').optional(),
  githubUrl: yup.string().url('Invalid GitHub URL').optional(),
  images: yup.array().of(yup.string()).default([]),
  videos: yup.array().of(yup.string()).default([]),
});

export const certificationSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required('Certification name is required')
    .max(100, 'Certification name must be less than 100 characters'),
  issuer: yup
    .string()
    .required('Issuer is required')
    .max(100, 'Issuer must be less than 100 characters'),
  dateIssued: yup.string().required('Date issued is required'),
  expirationDate: yup.string().optional(),
  credentialId: yup.string().optional(),
  credentialUrl: yup.string().url('Invalid credential URL').optional(),
});

export const languageSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required('Language name is required')
    .max(50, 'Language name must be less than 50 characters'),
  proficiency: yup
    .string()
    .oneOf(['Basic', 'Conversational', 'Professional', 'Native'])
    .required('Proficiency is required'),
});

export const referenceSchema = yup.object({
  id: yup.string().required(),
  name: yup
    .string()
    .required('Name is required')
    .max(100, 'Name must be less than 100 characters'),
  position: yup
    .string()
    .required('Position is required')
    .max(100, 'Position must be less than 100 characters'),
  company: yup
    .string()
    .required('Company is required')
    .max(100, 'Company must be less than 100 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup.string().optional(), // No validation for phone
  relationship: yup
    .string()
    .required('Relationship is required')
    .max(100, 'Relationship must be less than 100 characters'),
});

export const customSectionSchema = yup.object({
  id: yup.string().required(),
  title: yup
    .string()
    .required('Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: yup
    .string()
    .required('Content is required')
    .max(1000, 'Content must be less than 1000 characters'),
  order: yup.number().min(0).required('Order is required'),
});

export const resumeDataSchema = yup.object({
  personalInfo: personalInfoSchema.required(),
  experience: yup.array().of(experienceSchema).default([]),
  education: yup.array().of(educationSchema).default([]),
  skills: yup.array().of(skillSchema).default([]),
  projects: yup.array().of(projectSchema).default([]),
  certifications: yup.array().of(certificationSchema).default([]),
  languages: yup.array().of(languageSchema).default([]),
  references: yup.array().of(referenceSchema).default([]),
  customSections: yup.array().of(customSectionSchema).default([]),
});

export const validateResumeData = async (
  data: ResumeData
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await resumeDataSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

export const validateField = async (
  value: any,
  fieldName: string,
  schema: yup.AnySchema
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await schema.validate(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // No phone validation required - accept any input
  return true;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const validateDateRange = (
  startDate: string,
  endDate: string
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

export const getFieldValidationSchema = (fieldType: string): yup.AnySchema => {
  switch (fieldType) {
    case 'email':
      return yup.string().email('Invalid email format');
    case 'phone':
      return yup.string(); // No validation for phone numbers
    case 'url':
      return yup.string().url('Invalid URL format');
    case 'date':
      return yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format');
    case 'number':
      return yup.number().typeError('Must be a number');
    case 'text':
    case 'textarea':
    case 'richtext':
    default:
      return yup.string();
  }
};
