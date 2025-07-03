import React, { useState, useEffect } from 'react';
import { FieldConfig, Template, UserRole, User } from '../../types';
import FieldConfigEditor from './FieldConfigEditor';
import TemplateManager from './TemplateManager';
import UserManagement from './UserManagement';
import './AdminPanel.css';

interface AdminPanelProps {
  currentUser: User;
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  onTemplatesChange: (templates: Template[]) => void;
}

type AdminTab = 'fields' | 'templates' | 'users' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onFieldConfigsChange,
  onTemplatesChange,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('fields');
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Load field configurations
      const savedConfigs = localStorage.getItem('admin-field-configs');
      if (savedConfigs) {
        const configs = JSON.parse(savedConfigs);
        setFieldConfigs(configs);
        onFieldConfigsChange(configs);
      } else {
        // Set default field configurations
        const defaultConfigs = getDefaultFieldConfigs();
        setFieldConfigs(defaultConfigs);
        onFieldConfigsChange(defaultConfigs);
      }

      // Load templates
      const savedTemplates = localStorage.getItem('admin-templates');
      if (savedTemplates) {
        const templateData = JSON.parse(savedTemplates);
        setTemplates(templateData);
        onTemplatesChange(templateData);
      }

      // Load users
      const savedUsers = localStorage.getItem('admin-users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultFieldConfigs = (): FieldConfig[] => {
    return [
      // Personal Info Fields
      {
        id: 'firstName',
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
        validation: { minLength: 1, maxLength: 50 },
        section: 'personalInfo',
        order: 1,
        visible: true,
      },
      {
        id: 'lastName',
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        required: true,
        validation: { minLength: 1, maxLength: 50 },
        section: 'personalInfo',
        order: 2,
        visible: true,
      },
      {
        id: 'email',
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        validation: { minLength: 5, maxLength: 100 },
        section: 'personalInfo',
        order: 3,
        visible: true,
      },
      {
        id: 'phone',
        name: 'phone',
        type: 'phone',
        label: 'Phone Number',
        placeholder: '+1 (555) 123-4567',
        required: true,
        validation: { minLength: 10, maxLength: 20 },
        section: 'personalInfo',
        order: 4,
        visible: true,
      },
      {
        id: 'profilePhoto',
        name: 'profilePhoto',
        type: 'image',
        label: 'Profile Photo',
        placeholder: 'Upload your profile photo',
        required: false,
        section: 'personalInfo',
        order: 5,
        visible: true,
        fileConfig: {
          acceptedTypes: ['image/jpeg', 'image/png', 'image/gif'],
          maxSize: 5 * 1024 * 1024, // 5MB
          maxFiles: 1,
        },
      },
      {
        id: 'summary',
        name: 'summary',
        type: 'richtext',
        label: 'Professional Summary',
        placeholder: 'Write a brief professional summary...',
        required: true,
        validation: { minLength: 50, maxLength: 500 },
        section: 'personalInfo',
        order: 6,
        visible: true,
      },
      // Address Fields
      {
        id: 'address',
        name: 'address',
        type: 'text',
        label: 'Street Address',
        placeholder: 'Enter your street address',
        required: true,
        validation: { minLength: 5, maxLength: 100 },
        section: 'personalInfo',
        order: 7,
        visible: true,
      },
      {
        id: 'city',
        name: 'city',
        type: 'text',
        label: 'City',
        placeholder: 'Enter your city',
        required: true,
        validation: { minLength: 2, maxLength: 50 },
        section: 'personalInfo',
        order: 8,
        visible: true,
      },
      {
        id: 'state',
        name: 'state',
        type: 'text',
        label: 'State/Province',
        placeholder: 'Enter your state or province',
        required: true,
        validation: { minLength: 2, maxLength: 50 },
        section: 'personalInfo',
        order: 9,
        visible: true,
      },
      {
        id: 'zipCode',
        name: 'zipCode',
        type: 'text',
        label: 'ZIP/Postal Code',
        placeholder: 'Enter your ZIP or postal code',
        required: true,
        validation: { minLength: 3, maxLength: 10 },
        section: 'personalInfo',
        order: 10,
        visible: true,
      },
      {
        id: 'country',
        name: 'country',
        type: 'select',
        label: 'Country',
        placeholder: 'Select your country',
        required: true,
        section: 'personalInfo',
        order: 11,
        visible: true,
        options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Other'],
      },
      // Contact Fields
      {
        id: 'website',
        name: 'website',
        type: 'url',
        label: 'Personal Website',
        placeholder: 'https://yourwebsite.com',
        required: false,
        section: 'personalInfo',
        order: 12,
        visible: true,
      },
      {
        id: 'linkedin',
        name: 'linkedin',
        type: 'url',
        label: 'LinkedIn Profile',
        placeholder: 'https://linkedin.com/in/yourprofile',
        required: false,
        section: 'personalInfo',
        order: 13,
        visible: true,
      },
      {
        id: 'github',
        name: 'github',
        type: 'url',
        label: 'GitHub Profile',
        placeholder: 'https://github.com/yourusername',
        required: false,
        section: 'personalInfo',
        order: 14,
        visible: true,
      },
    ];
  };

  const handleFieldConfigsUpdate = (configs: FieldConfig[]) => {
    setFieldConfigs(configs);
    onFieldConfigsChange(configs);
    // Save to localStorage
    localStorage.setItem('admin-field-configs', JSON.stringify(configs));
  };

  const handleTemplatesUpdate = (templateData: Template[]) => {
    setTemplates(templateData);
    onTemplatesChange(templateData);
    // Save to localStorage
    localStorage.setItem('admin-templates', JSON.stringify(templateData));
  };

  const handleUsersUpdate = (userData: User[]) => {
    setUsers(userData);
    // Save to localStorage
    localStorage.setItem('admin-users', JSON.stringify(userData));
  };

  const hasPermission = (permission: string): boolean => {
    return currentUser.role.permissions.includes(permission) || currentUser.role.permissions.includes('admin:all');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fields':
        return (
          <FieldConfigEditor
            fieldConfigs={fieldConfigs}
            onUpdate={handleFieldConfigsUpdate}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'templates':
        return (
          <TemplateManager
            templates={templates}
            onUpdate={handleTemplatesUpdate}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'users':
        return (
          <UserManagement
            users={users}
            currentUser={currentUser}
            onUpdate={handleUsersUpdate}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'settings':
        return (
          <div className="admin-settings">
            <h3>System Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Auto-save Interval (seconds)</label>
                <input type="number" defaultValue={30} min={10} max={300} />
              </div>
              <div className="setting-item">
                <label>Max File Upload Size (MB)</label>
                <input type="number" defaultValue={10} min={1} max={50} />
              </div>
              <div className="setting-item">
                <label>Enable Analytics</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>Enable Debug Mode</label>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!hasPermission('admin:read')) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-user-info">
          <span>Welcome, {currentUser.name}</span>
          <span className="admin-user-role">({currentUser.role.name})</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'fields' ? 'active' : ''}`}
          onClick={() => setActiveTab('fields')}
          disabled={!hasPermission('admin:fields')}
        >
          Field Configuration
        </button>
        <button
          className={`admin-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          disabled={!hasPermission('admin:templates')}
        >
          Template Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          disabled={!hasPermission('admin:users')}
        >
          User Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          disabled={!hasPermission('admin:settings')}
        >
          System Settings
        </button>
      </div>

      <div className="admin-content">
        {isLoading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading admin data...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={loadInitialData} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default AdminPanel;