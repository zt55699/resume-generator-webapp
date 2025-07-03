import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ResumeData, Template, FieldConfig } from '../types';

interface ResumeState {
  resumeData: ResumeData;
  selectedTemplate: Template | null;
  fieldConfigs: FieldConfig[];
  isLoading: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
}

type ResumeAction =
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<ResumeData['personalInfo']> }
  | { type: 'ADD_EXPERIENCE'; payload: ResumeData['experience'][0] }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<ResumeData['experience'][0]> } }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: ResumeData['education'][0] }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<ResumeData['education'][0]> } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL'; payload: ResumeData['skills'][0] }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<ResumeData['skills'][0]> } }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'ADD_PROJECT'; payload: ResumeData['projects'][0] }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<ResumeData['projects'][0]> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: ResumeData['certifications'][0] }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<ResumeData['certifications'][0]> } }
  | { type: 'DELETE_CERTIFICATION'; payload: string }
  | { type: 'ADD_LANGUAGE'; payload: ResumeData['languages'][0] }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Partial<ResumeData['languages'][0]> } }
  | { type: 'DELETE_LANGUAGE'; payload: string }
  | { type: 'ADD_REFERENCE'; payload: ResumeData['references'][0] }
  | { type: 'UPDATE_REFERENCE'; payload: { id: string; data: Partial<ResumeData['references'][0]> } }
  | { type: 'DELETE_REFERENCE'; payload: string }
  | { type: 'ADD_CUSTOM_SECTION'; payload: ResumeData['customSections'][0] }
  | { type: 'UPDATE_CUSTOM_SECTION'; payload: { id: string; data: Partial<ResumeData['customSections'][0]> } }
  | { type: 'DELETE_CUSTOM_SECTION'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'SET_FIELD_CONFIGS'; payload: FieldConfig[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SAVE_RESUME' }
  | { type: 'RESET_RESUME' };

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    linkedin: '',
    github: '',
    profilePhoto: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
  customSections: [],
};

const initialState: ResumeState = {
  resumeData: initialResumeData,
  selectedTemplate: null,
  fieldConfigs: [],
  isLoading: false,
  errors: {},
  isDirty: false,
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_RESUME_DATA':
      return {
        ...state,
        resumeData: action.payload,
        isDirty: false,
      };

    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          personalInfo: {
            ...state.resumeData.personalInfo,
            ...action.payload,
          },
        },
        isDirty: true,
      };

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: [...state.resumeData.experience, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.map(exp =>
            exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
          ),
        },
        isDirty: true,
      };

    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.filter(exp => exp.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: [...state.resumeData.education, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.map(edu =>
            edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu
          ),
        },
        isDirty: true,
      };

    case 'DELETE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter(edu => edu.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_SKILL':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: [...state.resumeData.skills, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_SKILL':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: state.resumeData.skills.map(skill =>
            skill.id === action.payload.id ? { ...skill, ...action.payload.data } : skill
          ),
        },
        isDirty: true,
      };

    case 'DELETE_SKILL':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: state.resumeData.skills.filter(skill => skill.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: [...state.resumeData.projects, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.map(project =>
            project.id === action.payload.id ? { ...project, ...action.payload.data } : project
          ),
        },
        isDirty: true,
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.filter(project => project.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_CERTIFICATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: [...state.resumeData.certifications, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: state.resumeData.certifications.map(cert =>
            cert.id === action.payload.id ? { ...cert, ...action.payload.data } : cert
          ),
        },
        isDirty: true,
      };

    case 'DELETE_CERTIFICATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certifications: state.resumeData.certifications.filter(cert => cert.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_LANGUAGE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: [...state.resumeData.languages, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: state.resumeData.languages.map(lang =>
            lang.id === action.payload.id ? { ...lang, ...action.payload.data } : lang
          ),
        },
        isDirty: true,
      };

    case 'DELETE_LANGUAGE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          languages: state.resumeData.languages.filter(lang => lang.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_REFERENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          references: [...state.resumeData.references, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_REFERENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          references: state.resumeData.references.map(ref =>
            ref.id === action.payload.id ? { ...ref, ...action.payload.data } : ref
          ),
        },
        isDirty: true,
      };

    case 'DELETE_REFERENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          references: state.resumeData.references.filter(ref => ref.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_CUSTOM_SECTION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          customSections: [...state.resumeData.customSections, action.payload],
        },
        isDirty: true,
      };

    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          customSections: state.resumeData.customSections.map(section =>
            section.id === action.payload.id ? { ...section, ...action.payload.data } : section
          ),
        },
        isDirty: true,
      };

    case 'DELETE_CUSTOM_SECTION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          customSections: state.resumeData.customSections.filter(section => section.id !== action.payload),
        },
        isDirty: true,
      };

    case 'SET_TEMPLATE':
      return {
        ...state,
        selectedTemplate: action.payload,
        isDirty: true,
      };

    case 'SET_FIELD_CONFIGS':
      return {
        ...state,
        fieldConfigs: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors,
      };

    case 'SET_DIRTY':
      return {
        ...state,
        isDirty: action.payload,
      };

    case 'SAVE_RESUME':
      return {
        ...state,
        isDirty: false,
      };

    case 'RESET_RESUME':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
  saveResume: () => void;
  loadResume: (id?: string) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};

// Alias for backwards compatibility
export const useResume = useResumeContext;

interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const saveResume = () => {
    try {
      const resumeId = 'current-resume';
      localStorage.setItem(resumeId, JSON.stringify(state.resumeData));
      dispatch({ type: 'SET_DIRTY', payload: false });
    } catch (error) {
      console.error('Failed to save resume:', error);
      dispatch({ type: 'SET_ERROR', payload: { field: 'save', message: 'Failed to save resume' } });
    }
  };

  const loadResume = (id: string = 'current-resume') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const savedResume = localStorage.getItem(id);
      if (savedResume) {
        const resumeData = JSON.parse(savedResume);
        dispatch({ type: 'SET_RESUME_DATA', payload: resumeData });
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      dispatch({ type: 'SET_ERROR', payload: { field: 'load', message: 'Failed to load resume' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  // Auto-save on data changes
  useEffect(() => {
    if (state.isDirty) {
      const saveTimer = setTimeout(() => {
        saveResume();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimer);
    }
  }, [state.isDirty, state.resumeData]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (state.isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.isDirty]);

  const value = {
    state,
    dispatch,
    saveResume,
    loadResume,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};