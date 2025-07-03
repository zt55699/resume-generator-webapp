import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
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
  | {
      type: 'UPDATE_PERSONAL_INFO';
      payload: Partial<ResumeData['personalInfo']>;
    }
  | { type: 'ADD_EXPERIENCE'; payload: ResumeData['experience'][0] }
  | {
      type: 'UPDATE_EXPERIENCE';
      payload: { id: string; data: Partial<ResumeData['experience'][0]> };
    }
  | { type: 'UPDATE_EXPERIENCE_FORM'; payload: Record<string, any> }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: ResumeData['education'][0] }
  | {
      type: 'UPDATE_EDUCATION';
      payload: { id: string; data: Partial<ResumeData['education'][0]> };
    }
  | { type: 'UPDATE_EDUCATION_FORM'; payload: Record<string, any> }
  | { type: 'DELETE_EDUCATION'; payload: string }
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
            exp.id === action.payload.id
              ? { ...exp, ...action.payload.data }
              : exp
          ),
        },
        isDirty: true,
      };

    case 'UPDATE_EXPERIENCE_FORM':
      // For simplified single-form approach, either update first existing or create new
      const existingExperience = state.resumeData.experience[0];
      const experienceData = {
        id: existingExperience?.id || 'exp-1',
        company: action.payload.company || '',
        position: action.payload.position || '',
        startDate: action.payload.startDate || '',
        endDate: action.payload.endDate || '',
        isCurrentPosition: action.payload.isCurrentPosition || false,
        location: action.payload.location || '',
        description: action.payload.description || '',
        achievements: existingExperience?.achievements || [],
      };

      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: existingExperience
            ? [experienceData, ...state.resumeData.experience.slice(1)]
            : [experienceData],
        },
        isDirty: true,
      };

    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.filter(
            exp => exp.id !== action.payload
          ),
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
            edu.id === action.payload.id
              ? { ...edu, ...action.payload.data }
              : edu
          ),
        },
        isDirty: true,
      };

    case 'UPDATE_EDUCATION_FORM':
      // For simplified single-form approach, either update first existing or create new
      const existingEducation = state.resumeData.education[0];
      const educationData = {
        id: existingEducation?.id || 'edu-1',
        institution: action.payload.institution || '',
        degree: action.payload.degree || '',
        fieldOfStudy: action.payload.fieldOfStudy || '',
        startDate: action.payload.startDate || '',
        endDate: action.payload.endDate || '',
        gpa: action.payload.gpa || '',
        location: action.payload.location || '',
        description: action.payload.description || '',
        achievements: existingEducation?.achievements || [],
      };

      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: existingEducation
            ? [educationData, ...state.resumeData.education.slice(1)]
            : [educationData],
        },
        isDirty: true,
      };

    case 'DELETE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter(
            edu => edu.id !== action.payload
          ),
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
      dispatch({
        type: 'SET_ERROR',
        payload: { field: 'save', message: 'Failed to save resume' },
      });
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
      dispatch({
        type: 'SET_ERROR',
        payload: { field: 'load', message: 'Failed to load resume' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  // Auto-save removed to prevent infinite loops

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

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};
