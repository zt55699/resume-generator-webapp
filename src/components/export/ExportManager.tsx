import React, { useState } from 'react';
import { ResumeData, Template, ExportOptions } from '../../types';
import HTMLExporter from './HTMLExporter';
import PDFExporter from './PDFExporter';
import DocxExporter from './DocxExporter';
import ResumeRenderer from '../templates/ResumeRenderer';
import './ExportManager.css';

interface ExportManagerProps {
  resumeData: ResumeData;
  template: Template;
  onExport?: (format: string, success: boolean) => void;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  resumeData,
  template,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'html' | 'pdf' | 'docx'>('pdf');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    template: template.id,
    includeProfilePhoto: true,
    includePortfolioImages: true,
    includePortfolioVideos: false,
    paperSize: 'a4',
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    },
    quality: 'high',
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    let success = false;

    try {
      const options = { ...exportOptions, format: exportFormat, template: template.id };

      switch (exportFormat) {
        case 'html':
          success = await HTMLExporter.export(resumeData, template, options);
          break;
        case 'pdf':
          success = await PDFExporter.export(resumeData, template, options);
          break;
        case 'docx':
          success = await DocxExporter.export(resumeData, template, options);
          break;
      }

      onExport?.(exportFormat, success);
    } catch (error) {
      console.error('Export failed:', error);
      success = false;
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMarginChange = (side: string, value: number) => {
    setExportOptions(prev => ({
      ...prev,
      margins: {
        ...prev.margins!,
        [side]: value,
      },
    }));
  };

  const getExportButtonText = () => {
    if (isExporting) {
      return `Exporting ${exportFormat.toUpperCase()}...`;
    }
    return `Export as ${exportFormat.toUpperCase()}`;
  };

  const getFormatDescription = () => {
    switch (exportFormat) {
      case 'html':
        return 'Standalone HTML file with embedded styles and images. Perfect for web viewing and sharing.';
      case 'pdf':
        return 'High-quality PDF document. Best for printing and professional sharing.';
      case 'docx':
        return 'Microsoft Word document. Editable format for further customization.';
      default:
        return '';
    }
  };

  const getFileSizeEstimate = () => {
    const hasImages = resumeData.personalInfo.profilePhoto || 
                     resumeData.projects.some(p => p.images.length > 0) ||
                     resumeData.experience.some(e => e.companyLogo);
    
    switch (exportFormat) {
      case 'html':
        return hasImages ? '500KB - 2MB' : '50KB - 200KB';
      case 'pdf':
        return hasImages ? '1MB - 5MB' : '100KB - 500KB';
      case 'docx':
        return hasImages ? '2MB - 10MB' : '200KB - 1MB';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="export-manager">
      <div className="export-header">
        <h3>Export Resume</h3>
        <button
          className="preview-button"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className="export-content">
        <div className="export-options">
          <div className="format-selection">
            <h4>Export Format</h4>
            <div className="format-buttons">
              <button
                className={`format-button ${exportFormat === 'html' ? 'active' : ''}`}
                onClick={() => setExportFormat('html')}
              >
                <div className="format-icon">🌐</div>
                <div className="format-info">
                  <div className="format-name">HTML</div>
                  <div className="format-subtitle">Web Page</div>
                </div>
              </button>
              <button
                className={`format-button ${exportFormat === 'pdf' ? 'active' : ''}`}
                onClick={() => setExportFormat('pdf')}
              >
                <div className="format-icon">📄</div>
                <div className="format-info">
                  <div className="format-name">PDF</div>
                  <div className="format-subtitle">Document</div>
                </div>
              </button>
              <button
                className={`format-button ${exportFormat === 'docx' ? 'active' : ''}`}
                onClick={() => setExportFormat('docx')}
              >
                <div className="format-icon">📝</div>
                <div className="format-info">
                  <div className="format-name">DOCX</div>
                  <div className="format-subtitle">Word Doc</div>
                </div>
              </button>
            </div>
            <div className="format-description">
              {getFormatDescription()}
            </div>
          </div>

          <div className="content-options">
            <h4>Content Options</h4>
            <div className="option-group">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={exportOptions.includeProfilePhoto}
                  onChange={(e) => handleOptionChange('includeProfilePhoto', e.target.checked)}
                />
                Include profile photo
              </label>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={exportOptions.includePortfolioImages}
                  onChange={(e) => handleOptionChange('includePortfolioImages', e.target.checked)}
                />
                Include portfolio images
              </label>
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={exportOptions.includePortfolioVideos}
                  onChange={(e) => handleOptionChange('includePortfolioVideos', e.target.checked)}
                  disabled={exportFormat === 'pdf' || exportFormat === 'docx'}
                />
                Include portfolio videos {(exportFormat === 'pdf' || exportFormat === 'docx') && '(HTML only)'}
              </label>
            </div>
          </div>

          {(exportFormat === 'pdf' || exportFormat === 'docx') && (
            <div className="print-options">
              <h4>Print Options</h4>
              <div className="option-grid">
                <div className="option-group">
                  <label>Paper Size</label>
                  <select
                    value={exportOptions.paperSize}
                    onChange={(e) => handleOptionChange('paperSize', e.target.value)}
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="legal">Legal (8.5 × 14 in)</option>
                  </select>
                </div>
                <div className="option-group">
                  <label>Quality</label>
                  <select
                    value={exportOptions.quality}
                    onChange={(e) => handleOptionChange('quality', e.target.value)}
                  >
                    <option value="low">Low (Faster)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Better Quality)</option>
                  </select>
                </div>
              </div>

              <div className="margins-section">
                <label>Margins (mm)</label>
                <div className="margins-grid">
                  <div className="margin-input">
                    <label>Top</label>
                    <input
                      type="number"
                      value={exportOptions.margins?.top}
                      onChange={(e) => handleMarginChange('top', parseInt(e.target.value))}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="margin-input">
                    <label>Right</label>
                    <input
                      type="number"
                      value={exportOptions.margins?.right}
                      onChange={(e) => handleMarginChange('right', parseInt(e.target.value))}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="margin-input">
                    <label>Bottom</label>
                    <input
                      type="number"
                      value={exportOptions.margins?.bottom}
                      onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value))}
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="margin-input">
                    <label>Left</label>
                    <input
                      type="number"
                      value={exportOptions.margins?.left}
                      onChange={(e) => handleMarginChange('left', parseInt(e.target.value))}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="export-info">
            <div className="info-item">
              <span className="info-label">Template:</span>
              <span className="info-value">{template.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Estimated file size:</span>
              <span className="info-value">{getFileSizeEstimate()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Compatible with:</span>
              <span className="info-value">
                {exportFormat === 'pdf' && 'All devices, printers'}
                {exportFormat === 'html' && 'Web browsers, email'}
                {exportFormat === 'docx' && 'Microsoft Word, Google Docs'}
              </span>
            </div>
          </div>

          <div className="export-actions">
            <button
              className="export-button"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting && <div className="export-spinner"></div>}
              {getExportButtonText()}
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="export-preview">
            <h4>Preview</h4>
            <div className="preview-container">
              <div className="preview-wrapper" style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                <ResumeRenderer
                  resumeData={resumeData}
                  template={template}
                  isPreview={true}
                  showWatermark={false}
                />
              </div>
            </div>
            <div className="preview-note">
              <small>This is a scaled preview. The actual export will be full size.</small>
            </div>
          </div>
        )}
      </div>

      <div className="export-tips">
        <h4>💡 Export Tips</h4>
        <ul className="tips-list">
          <li><strong>PDF:</strong> Best for job applications and printing. Preserves exact formatting.</li>
          <li><strong>DOCX:</strong> Choose this if you need to edit the content later in Word.</li>
          <li><strong>HTML:</strong> Perfect for online portfolios and email attachments.</li>
          <li><strong>Images:</strong> Large images increase file size. Consider unchecking if not needed.</li>
          <li><strong>Print Quality:</strong> Use "High" quality for final versions, "Low" for quick previews.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportManager;