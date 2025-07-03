import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeContext } from '../../contexts/ResumeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Template } from '../../types';
import ResumeRenderer from '../templates/ResumeRenderer';
import { resumeTemplates } from '../../data/templates';
import './ResumePreview.css';

interface ResumePreviewProps {
  templates: Template[];
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ templates }) => {
  const navigate = useNavigate();
  const { state, dispatch } = useResumeContext();
  const { t } = useLanguage();
  const [currentTemplate, setCurrentTemplate] = useState<Template>(resumeTemplates[0]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleTemplateChange = (template: Template) => {
    setCurrentTemplate(template);
    setShowTemplateGallery(false);
    handleAutoSave();
  };

  const handleAutoSave = async () => {
    if (state.isDirty) {
      setIsSaving(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch({ type: 'SAVE_RESUME' });
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePublish = async () => {
    try {
      setIsSaving(true);
      
      const publishId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const publishedResume = {
        id: publishId,
        data: state.resumeData,
        template: currentTemplate,
        publishedAt: new Date().toISOString(),
        title: `${state.resumeData.personalInfo.firstName} ${state.resumeData.personalInfo.lastName} - Resume`,
        url: `/resume/${publishId}`,
      };

      const existingResumes = JSON.parse(localStorage.getItem('published-resumes') || '[]');
      existingResumes.push(publishedResume);
      localStorage.setItem('published-resumes', JSON.stringify(existingResumes));

      navigate(`/resume/${publishId}`);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    navigate('/export');
  };

  const handleBackToForm = () => {
    navigate('/builder');
  };

  return (
    <div className="resume-preview">
      <div className="preview-header">
        <div className="header-info">
          <h1 className="preview-title">{t('preview.title')}</h1>
          <p className="preview-subtitle">{t('templates.subtitle')}</p>
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
              className="back-button"
              onClick={handleBackToForm}
            >
              ← {t('preview.backtoform')}
            </button>
            
            <button 
              className="template-button"
              onClick={() => setShowTemplateGallery(!showTemplateGallery)}
            >
              🎨 {t('nav.templates')}
            </button>
            
            <button className="export-button" onClick={handleExport}>
              📤 {t('nav.export')}
            </button>
            
            <button 
              className="publish-button"
              onClick={handlePublish}
              disabled={!state.resumeData.personalInfo.firstName || !state.resumeData.personalInfo.lastName}
            >
              🚀 {t('preview.publish')}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-main">
          <div className="resume-container">
            <div className="resume-preview-wrapper">
              <ResumeRenderer 
                resumeData={state.resumeData}
                template={currentTemplate}
              />
            </div>
          </div>
        </div>

        {showTemplateGallery && (
          <div className="template-sidebar">
            <div className="template-selector">
              <div className="selector-header">
                <h3>Choose Template</h3>
                <button 
                  className="close-selector"
                  onClick={() => setShowTemplateGallery(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="templates-grid">
                {[...resumeTemplates, ...templates].map(template => (
                  <div 
                    key={template.id}
                    className={`template-option ${currentTemplate.id === template.id ? 'selected' : ''}`}
                    onClick={() => handleTemplateChange(template)}
                  >
                    <div className="template-thumbnail">
                      <div className="thumbnail-preview">
                        <div 
                          className="preview-header-thumb"
                          style={{ background: template.colors.primary }}
                        ></div>
                        <div className="preview-content-thumb">
                          <div 
                            className="content-line"
                            style={{ background: template.colors.text }}
                          ></div>
                          <div 
                            className="content-line"
                            style={{ background: template.colors.text }}
                          ></div>
                          <div 
                            className="content-line short"
                            style={{ background: template.colors.text }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="template-info">
                      <h4 className="template-name">{template.name}</h4>
                      <p className="template-category">{template.category}</p>
                    </div>
                    
                    {currentTemplate.id === template.id && (
                      <div className="selected-indicator">✅</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="preview-footer">
        <div className="footer-info">
          <span>Resume Preview • Template: {currentTemplate.name}</span>
        </div>
        <div className="footer-actions">
          <button onClick={() => navigate('/my-resumes')} className="my-resumes-link">
            📁 My Resumes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;