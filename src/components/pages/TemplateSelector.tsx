import React, { useState, useMemo } from 'react';
import { Template } from '../../types';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onTemplateSelect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLayout, setSelectedLayout] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(templates.map(t => t.category)));
    return ['all', ...cats];
  }, [templates]);

  const layouts = useMemo(() => {
    const lays = Array.from(new Set(templates.map(t => t.layout)));
    return ['all', ...lays];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory;
      const matchesLayout =
        selectedLayout === 'all' || template.layout === selectedLayout;
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesLayout && matchesSearch;
    });
  }, [templates, selectedCategory, selectedLayout, searchTerm]);

  const categoryIcons: Record<string, string> = {
    traditional: '🏛️',
    modern: '✨',
    creative: '🎨',
    technical: '💻',
    executive: '👔',
  };

  const layoutIcons: Record<string, string> = {
    'single-column': '📄',
    'two-column': '📑',
    'three-column': '📰',
  };

  const handleTemplatePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const generateTemplatePreview = (template: Template) => {
    return (
      <div className={`template-preview-content ${template.layout}`}>
        <div
          className='preview-header'
          style={{ borderBottom: `2px solid ${template.colors.primary}` }}
        >
          <div
            className='preview-avatar'
            style={{ background: template.colors.primary }}
          ></div>
          <div className='preview-info'>
            <div
              className='preview-name'
              style={{ background: template.colors.primary }}
            ></div>
            <div
              className='preview-contact'
              style={{ background: template.colors.secondary }}
            ></div>
          </div>
        </div>
        <div className='preview-sections'>
          <div className='preview-section'>
            <div
              className='section-title'
              style={{ background: template.colors.primary }}
            ></div>
            <div className='section-content'>
              <div
                className='content-line'
                style={{ background: template.colors.text }}
              ></div>
              <div
                className='content-line'
                style={{ background: template.colors.text }}
              ></div>
              <div
                className='content-line short'
                style={{ background: template.colors.text }}
              ></div>
            </div>
          </div>
          <div className='preview-section'>
            <div
              className='section-title'
              style={{ background: template.colors.primary }}
            ></div>
            <div className='section-content'>
              <div
                className='content-line'
                style={{ background: template.colors.text }}
              ></div>
              <div
                className='content-line short'
                style={{ background: template.colors.text }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='template-selector'>
      <div className='selector-header'>
        <div className='header-content'>
          <h1 className='page-title'>Choose Your Template</h1>
          <p className='page-description'>
            Select from our collection of professional resume templates. Each
            template is carefully designed to help you make a great first
            impression.
          </p>
        </div>
      </div>

      <div className='selector-filters'>
        <div className='filters-container'>
          <div className='search-filter'>
            <input
              type='text'
              placeholder='Search templates...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='search-input'
            />
            <span className='search-icon'>🔍</span>
          </div>

          <div className='category-filters'>
            <label className='filter-label'>Category:</label>
            <div className='filter-buttons'>
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? '📂' : categoryIcons[category] || '📄'}
                  <span className='filter-text'>
                    {category === 'all'
                      ? 'All'
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className='layout-filters'>
            <label className='filter-label'>Layout:</label>
            <div className='filter-buttons'>
              {layouts.map(layout => (
                <button
                  key={layout}
                  className={`filter-button ${selectedLayout === layout ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(layout)}
                >
                  {layout === 'all' ? '📋' : layoutIcons[layout] || '📄'}
                  <span className='filter-text'>
                    {layout === 'all'
                      ? 'All'
                      : layout
                          .split('-')
                          .map(
                            word => word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='templates-grid'>
        {filteredTemplates.map(template => (
          <div key={template.id} className='template-card'>
            <div
              className='template-preview'
              onClick={() => handleTemplatePreview(template)}
            >
              {generateTemplatePreview(template)}
              <div className='preview-overlay'>
                <button className='preview-button'>👁️ Preview</button>
              </div>
            </div>
            <div className='template-info'>
              <div className='template-header'>
                <h3 className='template-name'>{template.name}</h3>
                <div className='template-badges'>
                  <span
                    className='category-badge'
                    style={{ background: template.colors.primary }}
                  >
                    {categoryIcons[template.category]} {template.category}
                  </span>
                  <span className='layout-badge'>
                    {layoutIcons[template.layout]}{' '}
                    {template.layout.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <p className='template-description'>{template.description}</p>
              <div className='template-features'>
                <div className='color-scheme'>
                  <span className='feature-label'>Colors:</span>
                  <div className='color-dots'>
                    <div
                      className='color-dot'
                      style={{ background: template.colors.primary }}
                    ></div>
                    <div
                      className='color-dot'
                      style={{ background: template.colors.secondary }}
                    ></div>
                    <div
                      className='color-dot'
                      style={{ background: template.colors.accent }}
                    ></div>
                  </div>
                </div>
                <div className='font-info'>
                  <span className='feature-label'>Font:</span>
                  <span className='font-name'>
                    {template.fonts.primary.split(',')[0]}
                  </span>
                </div>
              </div>
              <button
                className='select-template-button'
                onClick={() => onTemplateSelect(template)}
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className='no-results'>
          <div className='no-results-icon'>😕</div>
          <h3 className='no-results-title'>No templates found</h3>
          <p className='no-results-description'>
            Try adjusting your filters or search terms to find the perfect
            template.
          </p>
          <button
            className='reset-filters-button'
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLayout('all');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className='results-summary'>
        <p className='results-text'>
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
      </div>

      {previewTemplate && (
        <div className='preview-modal' onClick={closePreview}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 className='modal-title'>{previewTemplate.name}</h3>
              <button className='close-button' onClick={closePreview}>
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <div className='full-preview'>
                {generateTemplatePreview(previewTemplate)}
              </div>
              <div className='preview-info'>
                <div className='template-details'>
                  <h4>Template Details</h4>
                  <p>
                    <strong>Category:</strong> {previewTemplate.category}
                  </p>
                  <p>
                    <strong>Layout:</strong> {previewTemplate.layout}
                  </p>
                  <p>
                    <strong>Description:</strong> {previewTemplate.description}
                  </p>
                </div>
                <div className='color-palette'>
                  <h4>Color Palette</h4>
                  <div className='palette-colors'>
                    <div className='palette-color'>
                      <div
                        className='color-swatch'
                        style={{ background: previewTemplate.colors.primary }}
                      ></div>
                      <span className='color-label'>Primary</span>
                    </div>
                    <div className='palette-color'>
                      <div
                        className='color-swatch'
                        style={{ background: previewTemplate.colors.secondary }}
                      ></div>
                      <span className='color-label'>Secondary</span>
                    </div>
                    <div className='palette-color'>
                      <div
                        className='color-swatch'
                        style={{ background: previewTemplate.colors.accent }}
                      ></div>
                      <span className='color-label'>Accent</span>
                    </div>
                    <div className='palette-color'>
                      <div
                        className='color-swatch'
                        style={{ background: previewTemplate.colors.text }}
                      ></div>
                      <span className='color-label'>Text</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button className='modal-button secondary' onClick={closePreview}>
                Close
              </button>
              <button
                className='modal-button primary'
                onClick={() => {
                  onTemplateSelect(previewTemplate);
                  closePreview();
                }}
                style={{
                  background: `linear-gradient(135deg, ${previewTemplate.colors.primary}, ${previewTemplate.colors.secondary})`,
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
