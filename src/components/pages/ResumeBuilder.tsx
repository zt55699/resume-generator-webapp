import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useResumeContext } from '../../contexts/ResumeContext';
import { Template, FieldConfig, ResumeData } from '../../types';
import DynamicForm from '../forms/DynamicForm';
import ResumeRenderer from '../templates/ResumeRenderer';
import { resumeTemplates } from '../../data/templates';
import './ResumeBuilder.css';

interface ResumeBuilderProps {
  fieldConfigs: FieldConfig[];
  templates: Template[];
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ fieldConfigs, templates }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch } = useResumeContext();
  const [currentTemplate, setCurrentTemplate] = useState<Template>(resumeTemplates[0]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedSection, setSelectedSection] = useState('personalInfo');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId) {
      const selectedTemplate = [...resumeTemplates, ...templates].find(t => t.id === templateId);
      if (selectedTemplate) {
        setCurrentTemplate(selectedTemplate);
      }
    }
  }, [searchParams, templates]);

  const sections = [
    { id: 'personalInfo', name: 'Personal Info', icon: '👤', description: 'Basic contact information' },
    { id: 'experience', name: 'Experience', icon: '💼', description: 'Work history and achievements' },
    { id: 'education', name: 'Education', icon: '🎓', description: 'Academic background' },
    { id: 'skills', name: 'Skills', icon: '🛠️', description: 'Technical and soft skills' },
    { id: 'projects', name: 'Projects', icon: '🚀', description: 'Portfolio and projects' },
    { id: 'certifications', name: 'Certifications', icon: '📜', description: 'Professional certifications' },
    { id: 'languages', name: 'Languages', icon: '🌍', description: 'Language proficiencies' },
    { id: 'references', name: 'References', icon: '👥', description: 'Professional references' },
    { id: 'customSections', name: 'Custom', icon: '➕', description: 'Additional sections' },
  ];

  const handleTemplateChange = (template: Template) => {
    setCurrentTemplate(template);
    setShowTemplateGallery(false);
    
    // Auto-save template selection
    handleAutoSave();
  };

  const handleAutoSave = async () => {
    if (state.isDirty) {
      setIsSaving(true);
      
      try {
        // Simulate save operation
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
      
      // Generate unique ID for published resume
      const publishId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create published resume data
      const publishedResume = {
        id: publishId,
        data: state.resumeData,
        template: currentTemplate,
        publishedAt: new Date().toISOString(),
        title: `${state.resumeData.personalInfo.firstName} ${state.resumeData.personalInfo.lastName} - Resume`,
        url: `/resume/${publishId}`,
      };

      // Save to published resumes (in a real app, this would be an API call)
      const existingResumes = JSON.parse(localStorage.getItem('published-resumes') || '[]');
      existingResumes.push(publishedResume);
      localStorage.setItem('published-resumes', JSON.stringify(existingResumes));

      // Navigate to the published resume
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

  return (
    <div className="resume-builder">
      <div className="builder-header">
        <div className="header-info">
          <h1 className="builder-title">Resume Builder</h1>
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
              className="preview-toggle"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? '📝 Edit' : '👁️ Preview'}
            </button>
            
            <button 
              className="template-button"
              onClick={() => setShowTemplateGallery(!showTemplateGallery)}
            >
              🎨 Templates
            </button>
            
            <button className="export-button" onClick={handleExport}>
              📤 Export
            </button>
            
            <button 
              className="publish-button"
              onClick={handlePublish}
              disabled={progressPercentage < 50}
            >
              🚀 Publish
            </button>
          </div>
        </div>
      </div>

      <div className={`builder-content ${isPreviewMode ? 'preview-mode' : ''}`}>
        {!isPreviewMode && (
          <div className="builder-sidebar">
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

            <div className="builder-tips">
              <h4>💡 Pro Tips</h4>
              <ul>
                <li>Fill out your personal info first</li>
                <li>Use action verbs in experience descriptions</li>
                <li>Quantify achievements with numbers</li>
                <li>Keep descriptions concise and relevant</li>
                <li>Proofread before publishing</li>
              </ul>
            </div>
          </div>
        )}

        <div className="builder-main">
          {!isPreviewMode && (
            <div className="form-section">
              <div className="form-header">
                <h2 className="form-title">
                  {sections.find(s => s.id === selectedSection)?.icon} {' '}
                  {sections.find(s => s.id === selectedSection)?.name}
                </h2>
                <p className="form-description">
                  {sections.find(s => s.id === selectedSection)?.description}
                </p>
              </div>
              
              <div className="form-content">
                <DynamicForm
                  fields={fieldConfigs.filter(f => f.section === selectedSection)}
                  data={state.resumeData}
                  onSubmit={(data) => {
                    // Handle form submission
                    dispatch({ type: 'SET_RESUME_DATA', payload: data as ResumeData });
                  }}
                  onFieldChange={(fieldName, value) => {
                    // Handle field changes
                    if (selectedSection === 'personalInfo') {
                      dispatch({ 
                        type: 'UPDATE_PERSONAL_INFO', 
                        payload: { [fieldName]: value } 
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="preview-section">
            <div className="preview-header">
              <h3 className="preview-title">Live Preview</h3>
              <div className="preview-controls">
                <button className="zoom-button" title="Zoom Out">🔍-</button>
                <button className="zoom-button" title="Zoom In">🔍+</button>
                <button className="fullscreen-button" title="Fullscreen">⛶</button>
              </div>
            </div>
            
            <div className="preview-container">
              <div className="resume-preview">
                <ResumeRenderer 
                  resumeData={state.resumeData}
                  template={currentTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTemplateGallery && (
        <div className="template-gallery-overlay" onClick={() => setShowTemplateGallery(false)}>
          <div className="template-gallery" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-header">
              <h3>Choose Template</h3>
              <button 
                className="close-gallery"
                onClick={() => setShowTemplateGallery(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="gallery-content">
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
        </div>
      )}

      <div className="builder-footer">
        <div className="footer-info">
          <span>Resume Builder • Auto-saves every change</span>
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

export default ResumeBuilder;