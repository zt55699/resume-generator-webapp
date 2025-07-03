import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../../contexts/ResumeContext';
import { FieldConfig, ResumeData } from '../../types';
import DynamicForm from '../forms/DynamicForm';
import './ResumeForm.css';

interface ResumeFormProps {
  fieldConfigs: FieldConfig[];
}

const ResumeForm: React.FC<ResumeFormProps> = ({ fieldConfigs }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useResumeContext();
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const sections = [
    { id: 'personalInfo', name: 'Personal Info', icon: '👤', description: 'Basic contact information' },
    { id: 'experience', name: 'Experience', icon: '💼', description: 'Work history and achievements' },
    { id: 'education', name: 'Education', icon: '🎓', description: 'Academic background' },
  ];

  const handleManualSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'SAVE_RESUME' });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToPreview = () => {
    handleManualSave();
    navigate('/preview');
  };

  const completedSections = sections.filter(section => {
    const sectionData = state.resumeData[section.id as keyof typeof state.resumeData];
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    if (typeof sectionData === 'object' && sectionData !== null) {
      return Object.values(sectionData).some(value => 
        typeof value === 'string' ? value.trim() !== '' : Boolean(value)
      );
    }
    return Boolean(sectionData);
  });

  const progressPercentage = Math.round((completedSections.length / sections.length) * 100);

  const getSectionData = (sectionId: string) => {
    switch (sectionId) {
      case 'personalInfo':
        return state.resumeData.personalInfo;
      case 'experience':
        // Return first experience item or empty object
        return state.resumeData.experience[0] || {};
      case 'education':
        // Return first education item or empty object
        return state.resumeData.education[0] || {};
      default:
        return {};
    }
  };

  // Remove field-level auto-updating to prevent infinite loops
  // Data will only be saved when user clicks "Save Section"

  const handleFormSubmit = (data: Record<string, any>) => {
    if (selectedSection === 'personalInfo') {
      dispatch({ 
        type: 'UPDATE_PERSONAL_INFO', 
        payload: data 
      });
    } else if (selectedSection === 'experience') {
      dispatch({ 
        type: 'UPDATE_EXPERIENCE_FORM', 
        payload: data 
      });
    } else if (selectedSection === 'education') {
      dispatch({ 
        type: 'UPDATE_EDUCATION_FORM', 
        payload: data 
      });
    }
    console.log(`Saving ${selectedSection} data:`, data);
    handleManualSave();
  };

  return (
    <div className="resume-form">
      <div className="form-header">
        <div className="header-info">
          <h1 className="form-title">Resume Information</h1>
          <p className="form-subtitle">Fill out your information step by step</p>
          <div className="progress-info">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{progressPercentage}% Complete</span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="save-status">
            {isSaving ? (
              <span className="saving">💾 Saving...</span>
            ) : lastSaved ? (
              <span className="saved">✅ Saved {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span className="unsaved">⚠️ Unsaved changes</span>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className="preview-button"
              onClick={handleContinueToPreview}
              disabled={progressPercentage < 20}
            >
              👁️ Preview & Templates
            </button>
          </div>
        </div>
      </div>

      <div className="form-content">
        <div className="form-sidebar">
          <div className="section-navigation">
            <h3 className="nav-title">Resume Sections</h3>
            <div className="section-list">
              {sections.map(section => {
                const isCompleted = completedSections.some(s => s.id === section.id);
                return (
                  <button
                    key={section.id}
                    className={`section-button ${selectedSection === section.id ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <span className="section-icon">{section.icon}</span>
                    <div className="section-info">
                      <span className="section-name">{section.name}</span>
                      <span className="section-desc">{section.description}</span>
                    </div>
                    {isCompleted && <span className="completion-check">✅</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-tips">
            <h4>💡 Pro Tips</h4>
            <ul>
              <li>Fill out your personal info first</li>
              <li>Use action verbs in experience descriptions</li>
              <li>Quantify achievements with numbers</li>
              <li>Keep descriptions concise and relevant</li>
              <li>Save frequently to avoid losing work</li>
            </ul>
          </div>
        </div>

        <div className="form-main">
          <div className="section-form">
            <div className="section-header">
              <h2 className="section-title">
                {sections.find(s => s.id === selectedSection)?.icon} {' '}
                {sections.find(s => s.id === selectedSection)?.name}
              </h2>
              <p className="section-description">
                {sections.find(s => s.id === selectedSection)?.description}
              </p>
            </div>
            
            <div className="section-content">
              <DynamicForm
                fields={fieldConfigs.filter(f => f.section === selectedSection)}
                data={getSectionData(selectedSection)}
                onSubmit={handleFormSubmit}
                submitButtonText="Save Section"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <div className="footer-info">
          <span>Resume Form • Click 'Save Section' to save your changes</span>
        </div>
        <div className="footer-actions">
          <button onClick={() => navigate('/my-resumes')} className="my-resumes-link">
            📁 My Resumes
          </button>
          <button 
            className="continue-button"
            onClick={handleContinueToPreview}
            disabled={progressPercentage < 20}
          >
            Continue to Preview →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;