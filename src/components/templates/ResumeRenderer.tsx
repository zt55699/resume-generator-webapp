import React from 'react';
import { ResumeData, Template } from '../../types';
import TraditionalTemplate from './layouts/TraditionalTemplate';
import ModernTemplate from './layouts/ModernTemplate';
import CreativeTemplate from './layouts/CreativeTemplate';
import TechnicalTemplate from './layouts/TechnicalTemplate';
import ExecutiveTemplate from './layouts/ExecutiveTemplate';
import './ResumeRenderer.css';

interface ResumeRendererProps {
  resumeData: ResumeData;
  template: Template;
  className?: string;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  resumeData,
  template,
  className = '',
  isPreview = false,
  showWatermark = false,
}) => {
  const renderTemplate = () => {
    const commonProps = {
      resumeData,
      template,
      isPreview,
      showWatermark,
    };

    switch (template.category) {
      case 'Traditional':
        return <TraditionalTemplate {...commonProps} />;
      case 'Modern':
        return <ModernTemplate {...commonProps} />;
      case 'Creative':
        return <CreativeTemplate {...commonProps} />;
      case 'Technical':
        return <TechnicalTemplate {...commonProps} />;
      case 'Executive':
        return <ExecutiveTemplate {...commonProps} />;
      default:
        return <TraditionalTemplate {...commonProps} />;
    }
  };

  return (
    <div
      className={`resume-renderer ${className} template-${template.id} ${isPreview ? 'preview' : ''}`}
      style={
        {
          '--primary-color': template.colors.primary,
          '--secondary-color': template.colors.secondary,
          '--accent-color': template.colors.accent,
          '--text-color': template.colors.text,
          '--background-color': template.colors.background,
          '--primary-font': template.fonts.primary,
          '--secondary-font': template.fonts.secondary,
        } as React.CSSProperties
      }
    >
      {renderTemplate()}
      {showWatermark && (
        <div className='resume-watermark'>Resume Generator</div>
      )}
    </div>
  );
};

export default ResumeRenderer;
