import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './contexts/ResumeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FieldConfig, Template, User, UserRole } from './types';
import { resumeTemplates } from './data/templates';
import { defaultFieldConfigs } from './data/fieldConfigs';
import Navbar from './components/common/Navbar';
import HomePage from './components/pages/HomePage';
import ResumeBuilder from './components/pages/ResumeBuilder';
import ResumeForm from './components/pages/ResumeForm';
import ResumePreview from './components/pages/ResumePreview';
import TemplateSelector from './components/pages/TemplateSelector';
import ExportPage from './components/pages/ExportPage';
import MyResumes from './components/pages/MyResumes';
import PublicResume from './components/pages/PublicResume';
import AdminPanel from './components/admin/AdminPanel';
import { useWeChat } from './hooks/useWeChat';
import { enableMobileOptimizations, optimizeForWeChat } from './utils/wechatUtils';
import './App.css';
import './styles/wechat.css';

const App: React.FC = () => {
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(defaultFieldConfigs);
  const [templates, setTemplates] = useState<Template[]>(resumeTemplates);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isWeChat, isMiniProgram, deviceInfo, isOnline } = useWeChat();

  useEffect(() => {
    // Initialize the app
    initializeApp();
    
    // Apply mobile and WeChat optimizations
    if (deviceInfo.isMobile) {
      enableMobileOptimizations();
    }
    
    if (isWeChat) {
      optimizeForWeChat();
    }
  }, [deviceInfo.isMobile, isWeChat]);

  const initializeApp = async () => {
    try {
      // Load user session (mock implementation)
      const savedUser = localStorage.getItem('current-user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        // Create a default user for demo purposes
        const defaultUser: User = {
          id: 'user_1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: {
            id: 'admin',
            name: 'Administrator',
            permissions: ['admin:all'],
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setCurrentUser(defaultUser);
        localStorage.setItem('current-user', JSON.stringify(defaultUser));
      }

      // Load saved templates
      const savedTemplates = localStorage.getItem('admin-templates');
      if (savedTemplates) {
        const customTemplates = JSON.parse(savedTemplates);
        setTemplates(customTemplates);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setIsLoading(false);
    }
  };

  const handleFieldConfigsChange = (configs: FieldConfig[]) => {
    setFieldConfigs(configs);
  };

  const handleTemplatesChange = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
  };

  const handleLogout = () => {
    localStorage.removeItem('current-user');
    setCurrentUser(null);
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Resume Generator...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="app-login">
        <div className="login-container">
          <h1>Resume Generator</h1>
          <p>Please log in to continue</p>
          <button
            className="login-button"
            onClick={() => {
              // Mock login - in real app, this would be proper authentication
              const defaultUser: User = {
                id: 'user_1',
                email: 'demo@example.com',
                name: 'Demo User',
                role: {
                  id: 'admin',
                  name: 'Administrator',
                  permissions: ['admin:all'],
                },
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
              };
              setCurrentUser(defaultUser);
              localStorage.setItem('current-user', JSON.stringify(defaultUser));
            }}
          >
            Continue as Demo User
          </button>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ResumeProvider>
        <Router>
        <div className={`app ${isWeChat ? 'wechat-env' : ''} ${isMiniProgram ? 'wechat-miniprogram' : ''} ${deviceInfo.isMobile ? 'mobile-env' : ''}`}>
          {/* Network status indicator for mobile */}
          {deviceInfo.isMobile && !isOnline && (
            <div className="network-status offline">
              📶 No internet connection
            </div>
          )}
          
          {/* WeChat status bar for iOS */}
          {isWeChat && deviceInfo.isIOS && (
            <div className="wechat-status-bar safe-area-support"></div>
          )}
          
          {!isMiniProgram && (
            <Navbar 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          )}
          
          <main className={`app-main ${isMiniProgram ? 'safe-area-support' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/templates" 
                element={
                  <TemplateSelector 
                    templates={templates}
                    onTemplateSelect={(template) => {
                      // Navigate to builder with selected template
                      window.location.href = `/builder?template=${template.id}`;
                    }}
                  />
                } 
              />
              <Route 
                path="/builder" 
                element={
                  <ResumeForm 
                    fieldConfigs={fieldConfigs}
                  />
                } 
              />
              <Route 
                path="/preview" 
                element={
                  <ResumePreview 
                    templates={templates}
                  />
                } 
              />
              <Route 
                path="/export" 
                element={
                  <ExportPage 
                    templates={templates}
                  />
                } 
              />
              <Route 
                path="/my-resumes" 
                element={<MyResumes />} 
              />
              <Route 
                path="/resume/:id" 
                element={<PublicResume />} 
              />
              {currentUser.role.permissions.includes('admin:read') && (
                <Route 
                  path="/admin" 
                  element={
                    <AdminPanel 
                      currentUser={currentUser}
                      onFieldConfigsChange={handleFieldConfigsChange}
                      onTemplatesChange={handleTemplatesChange}
                    />
                  } 
                />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* WeChat Mini Program Navigation */}
          {isMiniProgram && (
            <nav className="mini-program-nav">
              <a href="/" className="mini-program-nav-item">
                <span className="mini-program-nav-icon">🏠</span>
                <span>Home</span>
              </a>
              <a href="/templates" className="mini-program-nav-item">
                <span className="mini-program-nav-icon">📄</span>
                <span>Templates</span>
              </a>
              <a href="/builder" className="mini-program-nav-item">
                <span className="mini-program-nav-icon">✏️</span>
                <span>Builder</span>
              </a>
              <a href="/my-resumes" className="mini-program-nav-item">
                <span className="mini-program-nav-icon">📁</span>
                <span>My Resumes</span>
              </a>
            </nav>
          )}

          {!isMiniProgram && (
            <footer className="app-footer">
              <div className="footer-content">
                <div className="footer-section">
                  <h4>Resume Generator</h4>
                  <p>Create professional resumes with ease</p>
                </div>
                <div className="footer-section">
                  <h4>Features</h4>
                  <ul>
                    <li>Dynamic Forms</li>
                    <li>Professional Templates</li>
                    <li>Export to PDF/Word/HTML</li>
                    <li>WeChat Mini App Ready</li>
                  </ul>
                </div>
                <div className="footer-section">
                  <h4>Support</h4>
                  <ul>
                    <li>Documentation</li>
                    <li>Help Center</li>
                    <li>Contact Us</li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2024 Resume Generator. Built with React and TypeScript.</p>
              </div>
            </footer>
          )}
        </div>
        </Router>
      </ResumeProvider>
    </LanguageProvider>
  );
};

export default App;