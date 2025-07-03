import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { FieldConfig, ResumeData } from '../../types';
import DynamicForm from '../forms/DynamicForm';
import { translateFieldConfigs } from '../../utils/fieldTranslations';
import './ResumeForm.css';

interface ResumeFormProps {
  fieldConfigs: FieldConfig[];
}

const ResumeForm: React.FC<ResumeFormProps> = ({ fieldConfigs }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useResumeContext();
  const { t } = useLanguage();
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const sections = [
    { id: 'personalInfo', name: t('section.personalInfo'), icon: '👤', description: t('section.personalInfo.desc') },
    { id: 'experience', name: t('section.experience'), icon: '💼', description: t('section.experience.desc') },
    { id: 'education', name: t('section.education'), icon: '🎓', description: t('section.education.desc') },
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

  const handleFormSubmit = async (data: Record<string, any>) => {
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
    
    // Save data first
    await handleManualSave();
    
    // Auto-advance to next section
    advanceToNextSection();
  };

  const advanceToNextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === selectedSection);
    
    if (currentIndex < sections.length - 1) {
      // Move to next section
      const nextSection = sections[currentIndex + 1];
      setSelectedSection(nextSection.id);
      
      // Show success message
      setTimeout(() => {
        console.log(`Advanced to ${nextSection.name} section`);
      }, 100);
    } else {
      // Last section - go to preview
      handleContinueToPreview();
    }
  };

  return (
    <div className="resume-form">
      <div className="form-header">
        <div className="header-info">
          <h1 className="form-title">{t('resume.title')}</h1>
          <p className="form-subtitle">{t('resume.subtitle')}</p>
          <div className="progress-info">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {progressPercentage}% {t('progress.complete')} • {t('section.number')} {sections.findIndex(s => s.id === selectedSection) + 1} {t('section.of')} {sections.length}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="save-status">
            {isSaving ? (
              <span className="saving">💾 {t('status.saving')}</span>
            ) : lastSaved ? (
              <span className="saved">✅ {t('status.saved')} {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span className="unsaved">⚠️ {t('status.unsaved')}</span>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className="preview-button"
              onClick={handleContinueToPreview}
              disabled={progressPercentage < 20}
            >
              👁️ {t('button.preview')}
            </button>
          </div>
        </div>
      </div>

      <div className="form-content">
        <div className="form-sidebar">
          <div className="section-navigation">
            <h3 className="nav-title">{t('resume.title')} {t('section.number')}</h3>
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
            <h4>💡 {t('tips.title')}</h4>
            <ul>
              <li>{t('tips.personal')}</li>
              <li>{t('tips.verbs')}</li>
              <li>{t('tips.numbers')}</li>
              <li>{t('tips.concise')}</li>
              <li>{t('tips.save')}</li>
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
                fields={translateFieldConfigs(
                  fieldConfigs.filter(f => f.section === selectedSection),
                  t
                )}
                data={getSectionData(selectedSection)}
                onSubmit={handleFormSubmit}
                submitButtonText={
                  selectedSection === sections[sections.length - 1]?.id 
                    ? t('button.save.preview')
                    : t('button.save.continue')
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <div className="footer-info">
          <span>{t('footer.info')}</span>
        </div>
        <div className="footer-actions">
          <button onClick={() => navigate('/my-resumes')} className="my-resumes-link">
            📁 {t('button.my.resumes')}
          </button>
          <button 
            className="continue-button"
            onClick={handleContinueToPreview}
            disabled={progressPercentage < 20}
          >
            {t('button.continue.preview')} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;