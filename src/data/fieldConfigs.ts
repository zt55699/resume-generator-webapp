import { FieldConfig } from '../types';

export const defaultFieldConfigs: FieldConfig[] = [
  // Personal Info Fields
  {
    id: 'pi-firstName',
    name: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
    },
    section: 'personalInfo',
    order: 1,
    visible: true,
  },
  {
    id: 'pi-lastName',
    name: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    required: true,
    validation: {
      minLength: 2,
      maxLength: 50,
    },
    section: 'personalInfo',
    order: 2,
    visible: true,
  },
  {
    id: 'pi-email',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    required: true,
    validation: {
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    },
    section: 'personalInfo',
    order: 3,
    visible: true,
  },
  {
    id: 'pi-phone',
    name: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: '(555) 123-4567',
    required: true,
    section: 'personalInfo',
    order: 4,
    visible: true,
  },
  {
    id: 'pi-summary',
    name: 'summary',
    type: 'textarea',
    label: 'Professional Summary',
    placeholder: 'Write a brief summary of your professional background and career objectives...',
    required: false,
    validation: {
      maxLength: 1000,
    },
    section: 'personalInfo',
    order: 5,
    visible: true,
  },
];