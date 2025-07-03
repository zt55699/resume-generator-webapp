import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: '📝',
      title: 'Dynamic Forms',
      description: 'Create resumes with intelligent forms that adapt to your needs. Support for all field types including text, images, videos, and rich content.',
    },
    {
      icon: '🎨',
      title: 'Professional Templates',
      description: 'Choose from 10+ carefully designed templates across Traditional, Modern, Creative, Technical, and Executive categories.',
    },
    {
      icon: '📤',
      title: 'Multiple Export Formats',
      description: 'Export your resume to PDF, Word Document, or standalone HTML with embedded images and styling.',
    },
    {
      icon: '📱',
      title: 'WeChat Mini App Ready',
      description: 'Optimized for WeChat Mini App deployment with mobile-first design and performance optimization.',
    },
    {
      icon: '⚙️',
      title: 'Admin Panel',
      description: 'Powerful admin panel for managing form fields, templates, and user configurations with real-time updates.',
    },
    {
      icon: '🚀',
      title: 'Performance Optimized',
      description: 'Built with modern React and TypeScript for fast, reliable performance with automatic file compression.',
    },
  ];

  const templateCategories = [
    {
      name: 'Traditional',
      description: 'Classic, professional layouts for corporate environments',
      count: '2 templates',
      color: '#1e40af',
    },
    {
      name: 'Modern',
      description: 'Clean, contemporary designs with subtle visual elements',
      count: '2 templates',
      color: '#059669',
    },
    {
      name: 'Creative',
      description: 'Vibrant, eye-catching layouts for creative professionals',
      count: '2 templates',
      color: '#dc2626',
    },
    {
      name: 'Technical',
      description: 'Structured layouts perfect for technical roles',
      count: '2 templates',
      color: '#7c3aed',
    },
    {
      name: 'Executive',
      description: 'Sophisticated designs for senior leadership positions',
      count: '2 templates',
      color: '#ea580c',
    },
  ];

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Create Professional Resumes
              <span className="hero-highlight"> in Minutes</span>
            </h1>
            <p className="hero-description">
              Build stunning, ATS-friendly resumes with our intelligent form system, 
              professional templates, and powerful export options. Perfect for job seekers, 
              career changers, and professionals at any level.
            </p>
            <div className="hero-actions">
              <Link to="/builder" className="cta-button primary">
                Start Building
                <span className="button-icon">🚀</span>
              </Link>
              <Link to="/templates" className="cta-button secondary">
                Browse Templates
                <span className="button-icon">👀</span>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10+</div>
                <div className="stat-label">Templates</div>
              </div>
              <div className="stat">
                <div className="stat-number">15+</div>
                <div className="stat-label">Field Types</div>
              </div>
              <div className="stat">
                <div className="stat-number">3</div>
                <div className="stat-label">Export Formats</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="resume-preview">
              <div className="preview-header">
                <div className="preview-avatar"></div>
                <div className="preview-info">
                  <div className="preview-name"></div>
                  <div className="preview-contact"></div>
                </div>
              </div>
              <div className="preview-sections">
                <div className="preview-section">
                  <div className="section-title"></div>
                  <div className="section-content">
                    <div className="content-line"></div>
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
                <div className="preview-section">
                  <div className="section-title"></div>
                  <div className="section-content">
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Resume Generator?</h2>
            <p className="section-description">
              Everything you need to create professional resumes that get noticed by employers and ATS systems.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="templates-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Professional Templates</h2>
            <p className="section-description">
              Choose from our curated collection of professional resume templates, 
              each designed for specific industries and career levels.
            </p>
          </div>
          <div className="templates-grid">
            {templateCategories.map((category, index) => (
              <div key={index} className="template-category">
                <div 
                  className="category-header"
                  style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                >
                  <h3 className="category-name">{category.name}</h3>
                  <div className="category-count">{category.count}</div>
                </div>
                <div className="category-content">
                  <p className="category-description">{category.description}</p>
                  <Link 
                    to="/templates" 
                    className="category-link"
                    style={{ color: category.color }}
                  >
                    View Templates →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="templates-cta">
            <Link to="/templates" className="cta-button primary">
              Browse All Templates
            </Link>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Simple 3-Step Process</h2>
            <p className="section-description">
              Creating your professional resume has never been easier. Follow our streamlined process.
            </p>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Choose Template</h3>
                <p className="step-description">
                  Select from our collection of professional templates that match your industry and style preferences.
                </p>
                <Link to="/templates" className="step-link">Browse Templates</Link>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Fill Information</h3>
                <p className="step-description">
                  Use our intelligent forms to input your experience, skills, education, and other relevant information.
                </p>
                <Link to="/builder" className="step-link">Start Building</Link>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Export & Share</h3>
                <p className="step-description">
                  Download your resume in PDF, Word, or HTML format. Perfect for online applications and printing.
                </p>
                <Link to="/export" className="step-link">Export Options</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Build Your Resume?</h2>
            <p className="cta-description">
              Join thousands of professionals who have created successful resumes with our platform.
              Start building your resume today and land your dream job.
            </p>
            <Link to="/builder" className="cta-button primary large">
              Get Started Now
              <span className="button-icon">✨</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;