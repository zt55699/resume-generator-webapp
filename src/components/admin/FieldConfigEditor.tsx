import React, { useState } from 'react';
import { FieldConfig } from '../../types';

interface FieldConfigEditorProps {
  fieldConfigs: FieldConfig[];
  onUpdate: (configs: FieldConfig[]) => void;
  isLoading: boolean;
  error: string | null;
}

const FieldConfigEditor: React.FC<FieldConfigEditorProps> = ({
  fieldConfigs,
  onUpdate,
  isLoading,
  error,
}) => {
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const fieldTypes = [
    'text', 'textarea', 'email', 'phone', 'date', 'select', 'multiselect',
    'file', 'image', 'video', 'richtext', 'number', 'url', 'checkbox', 'radio'
  ];

  const sections = [
    'personalInfo', 'experience', 'education', 'skills', 'projects',
    'certifications', 'languages', 'references', 'customSections'
  ];

  const createNewField = (): FieldConfig => ({
    id: `field_${Date.now()}`,
    name: '',
    type: 'text',
    label: '',
    placeholder: '',
    required: false,
    validation: {},
    section: 'personalInfo',
    order: fieldConfigs.length + 1,
    visible: true,
    options: [],
  });

  const handleAddField = () => {
    const newField = createNewField();
    setEditingField(newField);
    setIsAddingField(true);
    setExpandedField(newField.id);
  };

  const handleEditField = (field: FieldConfig) => {
    setEditingField({ ...field });
    setIsAddingField(false);
    setExpandedField(field.id);
  };

  const handleSaveField = () => {
    if (!editingField) return;

    let updatedConfigs;
    if (isAddingField) {
      updatedConfigs = [...fieldConfigs, editingField];
    } else {
      updatedConfigs = fieldConfigs.map(config =>
        config.id === editingField.id ? editingField : config
      );
    }

    onUpdate(updatedConfigs);
    setEditingField(null);
    setIsAddingField(false);
    setExpandedField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setIsAddingField(false);
    setExpandedField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      const updatedConfigs = fieldConfigs.filter(config => config.id !== fieldId);
      onUpdate(updatedConfigs);
    }
  };

  const handleToggleVisibility = (fieldId: string) => {
    const updatedConfigs = fieldConfigs.map(config =>
      config.id === fieldId ? { ...config, visible: !config.visible } : config
    );
    onUpdate(updatedConfigs);
  };

  const handleFieldChange = (field: keyof FieldConfig, value: any) => {
    if (!editingField) return;

    setEditingField({
      ...editingField,
      [field]: value,
    });
  };

  const handleValidationChange = (key: string, value: any) => {
    if (!editingField) return;

    setEditingField({
      ...editingField,
      validation: {
        ...editingField.validation,
        [key]: value,
      },
    });
  };

  const handleFileConfigChange = (key: string, value: any) => {
    if (!editingField) return;

    const defaultFileConfig = {
      acceptedTypes: ['image/*'],
      maxSize: 5000000, // 5MB
      maxFiles: 1,
    };

    setEditingField({
      ...editingField,
      fileConfig: {
        ...defaultFileConfig,
        ...editingField.fileConfig,
        [key]: value,
      },
    });
  };

  const handleAddOption = () => {
    if (!editingField) return;

    setEditingField({
      ...editingField,
      options: [...(editingField.options || []), ''],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!editingField) return;

    const newOptions = [...(editingField.options || [])];
    newOptions.splice(index, 1);
    setEditingField({
      ...editingField,
      options: newOptions,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!editingField) return;

    const newOptions = [...(editingField.options || [])];
    newOptions[index] = value;
    setEditingField({
      ...editingField,
      options: newOptions,
    });
  };

  const sortedConfigs = [...fieldConfigs].sort((a, b) => a.order - b.order);

  return (
    <div className="field-config-editor">
      <div className="field-config-header">
        <h3>Field Configuration</h3>
        <button className="add-field-button" onClick={handleAddField}>
          <span>+</span>
          Add New Field
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="field-configs-list">
        {sortedConfigs.map(config => (
          <div key={config.id} className="field-config-item">
            <div
              className="field-config-summary"
              onClick={() => setExpandedField(
                expandedField === config.id ? null : config.id
              )}
            >
              <div className="field-config-info">
                <span className="field-type-badge">{config.type}</span>
                <div>
                  <div className="field-name">{config.name || 'Unnamed Field'}</div>
                  <div className="field-label">{config.label}</div>
                </div>
                {config.required && (
                  <span className="field-required-indicator">Required</span>
                )}
              </div>
              <div className="field-config-actions">
                <button
                  className={`field-action-button toggle ${config.visible ? 'visible' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(config.id);
                  }}
                  title={config.visible ? 'Hide field' : 'Show field'}
                >
                  👁
                </button>
                <button
                  className="field-action-button edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditField(config);
                  }}
                  title="Edit field"
                >
                  ✏️
                </button>
                <button
                  className="field-action-button delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteField(config.id);
                  }}
                  title="Delete field"
                >
                  🗑️
                </button>
              </div>
            </div>

            {(expandedField === config.id && editingField) && (
              <div className="field-config-details">
                <div className="field-config-form">
                  <div className="form-group">
                    <label>Field Name (ID)</label>
                    <input
                      type="text"
                      value={editingField.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Enter field name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Field Type</label>
                    <select
                      value={editingField.type}
                      onChange={(e) => handleFieldChange('type', e.target.value)}
                    >
                      {fieldTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={editingField.label}
                      onChange={(e) => handleFieldChange('label', e.target.value)}
                      placeholder="Enter field label"
                    />
                  </div>

                  <div className="form-group">
                    <label>Placeholder</label>
                    <input
                      type="text"
                      value={editingField.placeholder || ''}
                      onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  <div className="form-group">
                    <label>Section</label>
                    <select
                      value={editingField.section}
                      onChange={(e) => handleFieldChange('section', e.target.value)}
                    >
                      {sections.map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Order</label>
                    <input
                      type="number"
                      value={editingField.order}
                      onChange={(e) => handleFieldChange('order', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="required"
                        checked={editingField.required}
                        onChange={(e) => handleFieldChange('required', e.target.checked)}
                      />
                      <label htmlFor="required">Required Field</label>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="visible"
                        checked={editingField.visible}
                        onChange={(e) => handleFieldChange('visible', e.target.checked)}
                      />
                      <label htmlFor="visible">Visible</label>
                    </div>
                  </div>

                  {/* Validation Rules */}
                  <div className="form-group">
                    <label>Min Length</label>
                    <input
                      type="number"
                      value={editingField.validation?.minLength || ''}
                      onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value) || undefined)}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Length</label>
                    <input
                      type="number"
                      value={editingField.validation?.maxLength || ''}
                      onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value) || undefined)}
                      min="0"
                    />
                  </div>

                  {editingField.type === 'number' && (
                    <>
                      <div className="form-group">
                        <label>Min Value</label>
                        <input
                          type="number"
                          value={editingField.validation?.min || ''}
                          onChange={(e) => handleValidationChange('min', parseInt(e.target.value) || undefined)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Max Value</label>
                        <input
                          type="number"
                          value={editingField.validation?.max || ''}
                          onChange={(e) => handleValidationChange('max', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label>Pattern (Regex)</label>
                    <input
                      type="text"
                      value={editingField.validation?.pattern || ''}
                      onChange={(e) => handleValidationChange('pattern', e.target.value)}
                      placeholder="Enter regex pattern"
                    />
                  </div>

                  {/* Options for select/multiselect/radio */}
                  {(['select', 'multiselect', 'radio'].includes(editingField.type)) && (
                    <div className="field-options">
                      <label>Options</label>
                      <div className="options-list">
                        {(editingField.options || []).map((option, index) => (
                          <div key={index} className="option-item">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="remove-option-button"
                              onClick={() => handleRemoveOption(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="add-option-button"
                          onClick={handleAddOption}
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* File Configuration */}
                  {(['file', 'image', 'video'].includes(editingField.type)) && (
                    <>
                      <div className="form-group">
                        <label>Max File Size (bytes)</label>
                        <input
                          type="number"
                          value={editingField.fileConfig?.maxSize || 10485760}
                          onChange={(e) => handleFileConfigChange('maxSize', parseInt(e.target.value))}
                          min="1024"
                        />
                      </div>

                      <div className="form-group">
                        <label>Max Files</label>
                        <input
                          type="number"
                          value={editingField.fileConfig?.maxFiles || 1}
                          onChange={(e) => handleFileConfigChange('maxFiles', parseInt(e.target.value))}
                          min="1"
                          max="10"
                        />
                      </div>

                      <div className="form-group">
                        <label>Accepted File Types</label>
                        <textarea
                          value={(editingField.fileConfig?.acceptedTypes || []).join(', ')}
                          onChange={(e) => handleFileConfigChange('acceptedTypes', e.target.value.split(', ').filter(Boolean))}
                          placeholder="image/jpeg, image/png, image/gif"
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  <div className="field-config-form-actions">
                    <button
                      type="button"
                      className="cancel-field-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="save-field-button"
                      onClick={handleSaveField}
                      disabled={!editingField.name || !editingField.label}
                    >
                      Save Field
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {fieldConfigs.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No fields configured yet. Click "Add New Field" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FieldConfigEditor;