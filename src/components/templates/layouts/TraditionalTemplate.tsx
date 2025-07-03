import React from 'react';
import { ResumeData, Template } from '../../../types';

interface TraditionalTemplateProps {
  resumeData: ResumeData;
  template: Template;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const TraditionalTemplate: React.FC<TraditionalTemplateProps> = ({
  resumeData,
  template,
  isPreview = false,
}) => {
  const { personalInfo, experience, education } = resumeData;

  return (
    <div className={`traditional-template layout-${template.layout}`}>
      <header className='resume-header'>
        <h1 className='resume-name'>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className='contact-info'>
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div>
            {personalInfo.city}, {personalInfo.state}
          </div>
        </div>
      </header>

      <div className='resume-body'>
        {personalInfo.summary && (
          <section className='resume-section'>
            <h2 className='section-title'>Professional Summary</h2>
            <div className='summary'>{personalInfo.summary}</div>
          </section>
        )}

        {experience.length > 0 && (
          <section className='resume-section'>
            <h2 className='section-title'>Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className='resume-item'>
                <div className='item-header'>
                  <div className='item-title'>{exp.position}</div>
                  <div className='item-date'>
                    {exp.startDate} -{' '}
                    {exp.isCurrentPosition ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div className='item-subtitle'>{exp.company}</div>
                <div className='item-description'>{exp.description}</div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className='resume-section'>
            <h2 className='section-title'>Education</h2>
            {education.map(edu => (
              <div key={edu.id} className='resume-item'>
                <div className='item-header'>
                  <div className='item-title'>
                    {edu.degree} in {edu.fieldOfStudy}
                  </div>
                  <div className='item-date'>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                <div className='item-subtitle'>{edu.institution}</div>
                {edu.description && (
                  <div className='item-description'>{edu.description}</div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default TraditionalTemplate;
