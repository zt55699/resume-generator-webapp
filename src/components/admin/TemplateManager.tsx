import React, { useState } from 'react';
import { Template } from '../../types';
import { resumeTemplates } from '../../data/templates';

interface TemplateManagerProps {
  templates: Template[];
  onUpdate: (templates: Template[]) => void;
  isLoading: boolean;
  error: string | null;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onUpdate,
  isLoading,
  error,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<
    Template['category'] | 'all'
  >('all');

  const categories: (Template['category'] | 'all')[] = [
    'all',
    'Traditional',
    'Modern',
    'Creative',
    'Technical',
    'Executive',
  ];

  const filteredTemplates = (
    templates.length > 0 ? templates : resumeTemplates
  ).filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate({ ...template });
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return;

    const existingTemplates =
      templates.length > 0 ? templates : resumeTemplates;
    const updatedTemplates = existingTemplates.map(template =>
      template.id === selectedTemplate.id ? selectedTemplate : template
    );

    onUpdate(updatedTemplates);
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      id: `custom_${Date.now()}`,
      name: 'New Template',
      category: 'Modern',
      description: 'A new custom template',
      preview: '/templates/default-preview.jpg',
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        text: '#2c3e50',
        background: '#ffffff',
      },
      fonts: {
        primary: 'Arial, sans-serif',
        secondary: 'Times New Roman, serif',
      },
      layout: 'single-column',
      supportsPrint: true,
      supportsMobile: true,
      supportsWechat: true,
    };

    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const existingTemplates =
        templates.length > 0 ? templates : resumeTemplates;
      const updatedTemplates = existingTemplates.filter(
        template => template.id !== templateId
      );
      onUpdate(updatedTemplates);
    }
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (Copy)`,
    };

    const existingTemplates =
      templates.length > 0 ? templates : resumeTemplates;
    const updatedTemplates = [...existingTemplates, duplicatedTemplate];
    onUpdate(updatedTemplates);
  };

  const handleTemplatePropertyChange = (
    property: keyof Template,
    value: any
  ) => {
    if (!selectedTemplate) return;

    setSelectedTemplate({
      ...selectedTemplate,
      [property]: value,
    });
  };

  const handleColorChange = (
    colorKey: keyof Template['colors'],
    value: string
  ) => {
    if (!selectedTemplate) return;

    setSelectedTemplate({
      ...selectedTemplate,
      colors: {
        ...selectedTemplate.colors,
        [colorKey]: value,
      },
    });
  };

  const handleFontChange = (
    fontKey: keyof Template['fonts'],
    value: string
  ) => {
    if (!selectedTemplate) return;

    setSelectedTemplate({
      ...selectedTemplate,
      fonts: {
        ...selectedTemplate.fonts,
        [fontKey]: value,
      },
    });
  };

  return (
    <div className='template-manager'>
      <div className='template-manager-header'>
        <h3>Template Management</h3>
        <button className='add-template-button' onClick={handleCreateTemplate}>
          <span>+</span>
          Create New Template
        </button>
      </div>

      {error && (
        <div className='error-message'>
          <p>{error}</p>
        </div>
      )}

      <div className='template-filters'>
        <div className='filter-group'>
          <input
            type='text'
            placeholder='Search templates...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>
        <div className='filter-group'>
          <select
            value={filterCategory}
            onChange={e =>
              setFilterCategory(e.target.value as Template['category'] | 'all')
            }
            className='category-filter'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isEditing && selectedTemplate && (
        <div className='template-editor-modal'>
          <div className='template-editor'>
            <div className='template-editor-header'>
              <h4>Edit Template: {selectedTemplate.name}</h4>
              <button
                className='close-editor-button'
                onClick={handleCancelEdit}
              >
                ×
              </button>
            </div>

            <div className='template-editor-content'>
              <div className='template-editor-form'>
                <div className='form-section'>
                  <h5>Basic Information</h5>
                  <div className='form-grid'>
                    <div className='form-group'>
                      <label>Template Name</label>
                      <input
                        type='text'
                        value={selectedTemplate.name}
                        onChange={e =>
                          handleTemplatePropertyChange('name', e.target.value)
                        }
                      />
                    </div>

                    <div className='form-group'>
                      <label>Category</label>
                      <select
                        value={selectedTemplate.category}
                        onChange={e =>
                          handleTemplatePropertyChange(
                            'category',
                            e.target.value
                          )
                        }
                      >
                        {categories
                          .filter(cat => cat !== 'all')
                          .map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className='form-group'>
                      <label>Layout</label>
                      <select
                        value={selectedTemplate.layout}
                        onChange={e =>
                          handleTemplatePropertyChange('layout', e.target.value)
                        }
                      >
                        <option value='single-column'>Single Column</option>
                        <option value='two-column'>Two Column</option>
                        <option value='three-column'>Three Column</option>
                      </select>
                    </div>

                    <div className='form-group full-width'>
                      <label>Description</label>
                      <textarea
                        value={selectedTemplate.description}
                        onChange={e =>
                          handleTemplatePropertyChange(
                            'description',
                            e.target.value
                          )
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className='form-section'>
                  <h5>Color Scheme</h5>
                  <div className='color-grid'>
                    <div className='color-group'>
                      <label>Primary Color</label>
                      <div className='color-input-group'>
                        <input
                          type='color'
                          value={selectedTemplate.colors.primary}
                          onChange={e =>
                            handleColorChange('primary', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          value={selectedTemplate.colors.primary}
                          onChange={e =>
                            handleColorChange('primary', e.target.value)
                          }
                          placeholder='#000000'
                        />
                      </div>
                    </div>

                    <div className='color-group'>
                      <label>Secondary Color</label>
                      <div className='color-input-group'>
                        <input
                          type='color'
                          value={selectedTemplate.colors.secondary}
                          onChange={e =>
                            handleColorChange('secondary', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          value={selectedTemplate.colors.secondary}
                          onChange={e =>
                            handleColorChange('secondary', e.target.value)
                          }
                          placeholder='#000000'
                        />
                      </div>
                    </div>

                    <div className='color-group'>
                      <label>Accent Color</label>
                      <div className='color-input-group'>
                        <input
                          type='color'
                          value={selectedTemplate.colors.accent}
                          onChange={e =>
                            handleColorChange('accent', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          value={selectedTemplate.colors.accent}
                          onChange={e =>
                            handleColorChange('accent', e.target.value)
                          }
                          placeholder='#000000'
                        />
                      </div>
                    </div>

                    <div className='color-group'>
                      <label>Text Color</label>
                      <div className='color-input-group'>
                        <input
                          type='color'
                          value={selectedTemplate.colors.text}
                          onChange={e =>
                            handleColorChange('text', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          value={selectedTemplate.colors.text}
                          onChange={e =>
                            handleColorChange('text', e.target.value)
                          }
                          placeholder='#000000'
                        />
                      </div>
                    </div>

                    <div className='color-group'>
                      <label>Background Color</label>
                      <div className='color-input-group'>
                        <input
                          type='color'
                          value={selectedTemplate.colors.background}
                          onChange={e =>
                            handleColorChange('background', e.target.value)
                          }
                        />
                        <input
                          type='text'
                          value={selectedTemplate.colors.background}
                          onChange={e =>
                            handleColorChange('background', e.target.value)
                          }
                          placeholder='#ffffff'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='form-section'>
                  <h5>Typography</h5>
                  <div className='form-grid'>
                    <div className='form-group'>
                      <label>Primary Font</label>
                      <input
                        type='text'
                        value={selectedTemplate.fonts.primary}
                        onChange={e =>
                          handleFontChange('primary', e.target.value)
                        }
                        placeholder='Arial, sans-serif'
                      />
                    </div>

                    <div className='form-group'>
                      <label>Secondary Font</label>
                      <input
                        type='text'
                        value={selectedTemplate.fonts.secondary}
                        onChange={e =>
                          handleFontChange('secondary', e.target.value)
                        }
                        placeholder='Times New Roman, serif'
                      />
                    </div>
                  </div>
                </div>

                <div className='form-section'>
                  <h5>Compatibility</h5>
                  <div className='checkbox-grid'>
                    <div className='checkbox-group'>
                      <input
                        type='checkbox'
                        id='supportsPrint'
                        checked={selectedTemplate.supportsPrint}
                        onChange={e =>
                          handleTemplatePropertyChange(
                            'supportsPrint',
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor='supportsPrint'>Print Support</label>
                    </div>

                    <div className='checkbox-group'>
                      <input
                        type='checkbox'
                        id='supportsMobile'
                        checked={selectedTemplate.supportsMobile}
                        onChange={e =>
                          handleTemplatePropertyChange(
                            'supportsMobile',
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor='supportsMobile'>Mobile Support</label>
                    </div>

                    <div className='checkbox-group'>
                      <input
                        type='checkbox'
                        id='supportsWechat'
                        checked={selectedTemplate.supportsWechat}
                        onChange={e =>
                          handleTemplatePropertyChange(
                            'supportsWechat',
                            e.target.checked
                          )
                        }
                      />
                      <label htmlFor='supportsWechat'>WeChat Support</label>
                    </div>
                  </div>
                </div>

                <div className='template-editor-actions'>
                  <button className='cancel-button' onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className='save-button' onClick={handleSaveTemplate}>
                    Save Template
                  </button>
                </div>
              </div>

              <div className='template-preview-section'>
                <h5>Live Preview</h5>
                <div className='template-preview-container'>
                  <div
                    className='template-preview-sample'
                    style={{
                      backgroundColor: selectedTemplate.colors.background,
                      color: selectedTemplate.colors.text,
                      fontFamily: selectedTemplate.fonts.primary,
                    }}
                  >
                    <div
                      className='preview-header'
                      style={{
                        backgroundColor: selectedTemplate.colors.primary,
                        color: selectedTemplate.colors.background,
                        padding: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: selectedTemplate.fonts.primary,
                        }}
                      >
                        John Doe
                      </h3>
                      <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                        Software Engineer
                      </p>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4
                        style={{
                          color: selectedTemplate.colors.primary,
                          borderBottom: `2px solid ${selectedTemplate.colors.accent}`,
                          paddingBottom: '0.5rem',
                          fontFamily: selectedTemplate.fonts.primary,
                        }}
                      >
                        Experience
                      </h4>
                      <div style={{ marginTop: '1rem' }}>
                        <h5
                          style={{
                            color: selectedTemplate.colors.accent,
                            margin: '0 0 0.25rem 0',
                          }}
                        >
                          Senior Developer
                        </h5>
                        <p
                          style={{
                            margin: '0 0 0.5rem 0',
                            fontSize: '0.9rem',
                            color: selectedTemplate.colors.secondary,
                          }}
                        >
                          Tech Company • 2020 - Present
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                          }}
                        >
                          Led development of innovative web applications using
                          modern technologies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='template-grid'>
        {filteredTemplates.map(template => (
          <div key={template.id} className='template-card'>
            <div className='template-preview'>
              <img
                src={template.preview}
                alt={template.name}
                onError={e => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFByZXZpZXc8L3RleHQ+PC9zdmc+';
                }}
              />
              <div className='template-category-badge'>{template.category}</div>
            </div>

            <div className='template-info'>
              <div className='template-name'>{template.name}</div>
              <div className='template-description'>{template.description}</div>

              <div className='template-features'>
                {template.supportsPrint && (
                  <span className='template-feature'>Print</span>
                )}
                {template.supportsMobile && (
                  <span className='template-feature'>Mobile</span>
                )}
                {template.supportsWechat && (
                  <span className='template-feature'>WeChat</span>
                )}
                <span className='template-feature'>{template.layout}</span>
              </div>

              <div className='template-actions'>
                <button
                  className='template-action-button primary'
                  onClick={() => handleEditTemplate(template)}
                >
                  Edit
                </button>
                <button
                  className='template-action-button secondary'
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  Duplicate
                </button>
                {!resumeTemplates.find(t => t.id === template.id) && (
                  <button
                    className='template-action-button delete'
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && !isLoading && (
        <div className='empty-state'>
          <p>No templates found matching your criteria.</p>
        </div>
      )}

      <style>{`
        .template-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .search-input,
        .category-filter {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .search-input {
          width: 300px;
        }

        .template-editor-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .template-editor {
          background: white;
          border-radius: 0.75rem;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .template-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .template-editor-header h4 {
          margin: 0;
          color: #1e293b;
        }

        .close-editor-button {
          padding: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .template-editor-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          flex: 1;
          overflow: hidden;
        }

        .template-editor-form {
          padding: 2rem;
          overflow-y: auto;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h5 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .color-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .color-input-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .color-input-group input[type="color"] {
          width: 50px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
        }

        .color-input-group input[type="text"] {
          flex: 1;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .template-editor-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #f1f5f9;
        }

        .cancel-button,
        .save-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cancel-button {
          background: #6b7280;
          color: white;
        }

        .cancel-button:hover {
          background: #4b5563;
        }

        .save-button {
          background: #3b82f6;
          color: white;
        }

        .save-button:hover {
          background: #2563eb;
        }

        .template-preview-section {
          padding: 2rem;
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          overflow-y: auto;
        }

        .template-preview-section h5 {
          margin: 0 0 1rem 0;
          color: #374151;
        }

        .template-preview-container {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: white;
        }

        .template-preview-sample {
          min-height: 300px;
          font-size: 0.875rem;
        }

        .add-template-button {
          padding: 0.75rem 1.5rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-template-button:hover {
          background: #059669;
        }

        .template-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .template-manager-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .template-action-button.delete {
          background: #dc2626;
          color: white;
        }

        .template-action-button.delete:hover {
          background: #b91c1c;
        }

        @media (max-width: 768px) {
          .template-editor-content {
            grid-template-columns: 1fr;
          }

          .template-filters {
            flex-direction: column;
            align-items: start;
          }

          .search-input {
            width: 100%;
          }

          .form-grid,
          .color-grid,
          .checkbox-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateManager;
