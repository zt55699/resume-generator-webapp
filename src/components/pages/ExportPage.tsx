import React, { useState, useRef, useEffect } from 'react';
import { useResumeContext } from '../../contexts/ResumeContext';
import { Template } from '../../types';
import ExportManager from '../export/ExportManager';
import ResumeRenderer from '../templates/ResumeRenderer';
import { resumeTemplates } from '../../data/templates';
import './ExportPage.css';

interface ExportPageProps {
  templates: Template[];
}

const ExportPage: React.FC<ExportPageProps> = ({ templates }) => {
  const { state } = useResumeContext();
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(resumeTemplates[0]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'html'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    format: string;
    template: string;
    date: string;
    filename: string;
  }>>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load export history from localStorage
    const history = JSON.parse(localStorage.getItem('export-history') || '[]');
    setExportHistory(history);
  }, []);

  const allTemplates = [...resumeTemplates, ...templates];

  const handleExport = async (format: 'pdf' | 'docx' | 'html') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Import the appropriate exporter
      let exporter;
      let exportOptions = {
        format: format as 'html' | 'pdf' | 'docx',
        template: selectedTemplate.id,
        quality: 'high' as const,
        paperSize: 'a4' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        includeProfilePhoto: true,
        includePortfolioImages: true,
        includePortfolioVideos: false,
      };

      switch (format) {
        case 'pdf':
          const { default: PDFExporter } = await import('../export/PDFExporter');
          exporter = PDFExporter;
          break;
        case 'docx':
          const { default: DocxExporter } = await import('../export/DocxExporter');
          exporter = DocxExporter;
          break;
        case 'html':
          const { default: HTMLExporter } = await import('../export/HTMLExporter');
          exporter = HTMLExporter;
          break;
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      const success = await exporter.export(state.resumeData, selectedTemplate, exportOptions);

      if (success) {
        // Add to export history
        const exportRecord = {
          id: `export_${Date.now()}`,
          format: format.toUpperCase(),
          template: selectedTemplate.name,
          date: new Date().toISOString(),
          filename: `${state.resumeData.personalInfo.firstName}_${state.resumeData.personalInfo.lastName}_Resume.${format}`,
        };

        const updatedHistory = [exportRecord, ...exportHistory].slice(0, 10); // Keep last 10 exports
        setExportHistory(updatedHistory);
        localStorage.setItem('export-history', JSON.stringify(updatedHistory));
      }

    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
  };

  const clearExportHistory = () => {
    setExportHistory([]);
    localStorage.removeItem('export-history');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDataComplete = () => {
    const { personalInfo, experience, education } = state.resumeData;
    return personalInfo.firstName && personalInfo.lastName && personalInfo.email &&
           (experience.length > 0 || education.length > 0);
  };

  return (
    <div className="export-page">
      <div className="export-header">
        <div className="header-content">
          <h1 className="page-title">Export Resume</h1>
          <p className="page-description">
            Preview your resume and export it in your preferred format. 
            Choose from PDF, Word Document, or standalone HTML.
          </p>
        </div>
      </div>

      <div className="export-content">
        <div className="export-main">
          <div className="preview-section">
            <div className="preview-header">
              <h2 className="preview-title">Live Preview</h2>
              <div className="template-selector">
                <label htmlFor="template-select">Template:</label>
                <select
                  id="template-select"
                  value={selectedTemplate.id}
                  onChange={(e) => {
                    const template = allTemplates.find(t => t.id === e.target.value);
                    if (template) handleTemplateChange(template);
                  }}
                  className="template-select"
                >
                  {allTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="preview-container" ref={previewRef}>
              <div className="resume-preview">
                <ResumeRenderer 
                  resumeData={state.resumeData}
                  template={selectedTemplate}
                />
              </div>
            </div>

            <div className="preview-actions">
              <button className="preview-action-btn" title="Zoom In">
                🔍+ Zoom In
              </button>
              <button className="preview-action-btn" title="Zoom Out">
                🔍- Zoom Out
              </button>
              <button className="preview-action-btn" title="Print Preview">
                🖨️ Print Preview
              </button>
              <button className="preview-action-btn" title="Fullscreen">
                ⛶ Fullscreen
              </button>
            </div>
          </div>

          <div className="export-options">
            <ExportManager
              resumeData={state.resumeData}
              template={selectedTemplate}
              onExport={(format: string, success: boolean) => {
                // Handle export completion
                console.log(`Export ${format} ${success ? 'succeeded' : 'failed'}`);
              }}
            />
          </div>
        </div>

        <div className="export-sidebar">
          <div className="template-gallery">
            <h3 className="gallery-title">Quick Template Switch</h3>
            <div className="template-thumbnails">
              {allTemplates.map(template => (
                <div
                  key={template.id}
                  className={`template-thumb ${selectedTemplate.id === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateChange(template)}
                  title={template.name}
                >
                  <div className="thumb-preview">
                    <div 
                      className="thumb-header"
                      style={{ background: template.colors.primary }}
                    ></div>
                    <div className="thumb-content">
                      <div 
                        className="thumb-line"
                        style={{ background: template.colors.text }}
                      ></div>
                      <div 
                        className="thumb-line"
                        style={{ background: template.colors.text }}
                      ></div>
                      <div 
                        className="thumb-line short"
                        style={{ background: template.colors.text }}
                      ></div>
                    </div>
                  </div>
                  <span className="thumb-name">{template.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="export-formats">
            <h3 className="formats-title">Export Formats</h3>
            <div className="format-options">
              <div 
                className={`format-option ${exportFormat === 'pdf' ? 'selected' : ''}`}
                onClick={() => setExportFormat('pdf')}
              >
                <div className="format-icon">📄</div>
                <div className="format-info">
                  <h4>PDF Document</h4>
                  <p>Perfect for email and printing</p>
                  <span className="format-size">~500-800 KB</span>
                </div>
              </div>

              <div 
                className={`format-option ${exportFormat === 'docx' ? 'selected' : ''}`}
                onClick={() => setExportFormat('docx')}
              >
                <div className="format-icon">📝</div>
                <div className="format-info">
                  <h4>Word Document</h4>
                  <p>Editable in Microsoft Word</p>
                  <span className="format-size">~200-400 KB</span>
                </div>
              </div>

              <div 
                className={`format-option ${exportFormat === 'html' ? 'selected' : ''}`}
                onClick={() => setExportFormat('html')}
              >
                <div className="format-icon">🌐</div>
                <div className="format-info">
                  <h4>HTML Page</h4>
                  <p>Standalone web page</p>
                  <span className="format-size">~100-300 KB</span>
                </div>
              </div>
            </div>

            <button
              className="quick-export-btn"
              onClick={() => handleExport(exportFormat)}
              disabled={!isDataComplete() || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="export-spinner"></div>
                  Exporting... {exportProgress}%
                </>
              ) : (
                <>
                  🚀 Export as {exportFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>

          <div className="export-history">
            <div className="history-header">
              <h3 className="history-title">Recent Exports</h3>
              {exportHistory.length > 0 && (
                <button 
                  className="clear-history"
                  onClick={clearExportHistory}
                  title="Clear History"
                >
                  🗑️
                </button>
              )}
            </div>

            {exportHistory.length === 0 ? (
              <div className="no-history">
                <div className="no-history-icon">📭</div>
                <p>No exports yet</p>
              </div>
            ) : (
              <div className="history-list">
                {exportHistory.map(record => (
                  <div key={record.id} className="history-item">
                    <div className="history-icon">
                      {record.format === 'PDF' ? '📄' : 
                       record.format === 'DOCX' ? '📝' : '🌐'}
                    </div>
                    <div className="history-info">
                      <div className="history-filename">{record.filename}</div>
                      <div className="history-meta">
                        {record.template} • {formatDate(record.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isDataComplete() && (
            <div className="export-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h4>Incomplete Resume</h4>
                <p>Please fill in basic information before exporting.</p>
                <button 
                  className="warning-action"
                  onClick={() => window.history.back()}
                >
                  Continue Editing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="export-tips">
        <h3>💡 Export Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <strong>PDF:</strong> Best for job applications and ATS systems. Maintains exact formatting.
          </div>
          <div className="tip">
            <strong>Word:</strong> Perfect if recruiters need to edit or add comments to your resume.
          </div>
          <div className="tip">
            <strong>HTML:</strong> Great for online portfolios and sharing via web links.
          </div>
          <div className="tip">
            <strong>Pro Tip:</strong> Always review your resume after export to ensure formatting is correct.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;