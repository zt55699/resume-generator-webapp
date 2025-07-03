import React from 'react';
import { ResumeData, Template } from '../../../types';

interface ModernTemplateProps {
  resumeData: ResumeData;
  template: Template;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  resumeData,
  template,
  isPreview = false,
}) => {
  const { personalInfo, experience, education } = resumeData;

  return (
    <div className={`modern-template layout-${template.layout}`}>
      {/* Header with modern styling */}
      <header className='resume-header modern-header'>
        <div className='modern-header-content'>
          {personalInfo.profilePhoto && (
            <img
              src={personalInfo.profilePhoto}
              alt='Profile'
              className='resume-profile-photo modern-profile-photo'
            />
          )}
          <div className='modern-header-text'>
            <h1 className='resume-name modern-name'>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className='modern-contact-grid'>
              <div className='modern-contact-item'>
                <span className='modern-icon'>✉</span>
                <span>{personalInfo.email}</span>
              </div>
              <div className='modern-contact-item'>
                <span className='modern-icon'>☎</span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className='modern-contact-item'>
                <span className='modern-icon'>📍</span>
                <span>
                  {personalInfo.city}, {personalInfo.state}
                </span>
              </div>
              {personalInfo.website && (
                <div className='modern-contact-item'>
                  <span className='modern-icon'>🌐</span>
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className='modern-contact-item'>
                  <span className='modern-icon'>💼</span>
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className='modern-contact-item'>
                  <span className='modern-icon'>💻</span>
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className='resume-body'>
        {/* Summary with modern styling */}
        {personalInfo.summary && (
          <section className='resume-section modern-summary-section'>
            <div className='modern-summary-content'>
              <h2 className='modern-section-title'>About Me</h2>
              <div className='resume-summary modern-summary'>
                {personalInfo.summary}
              </div>
            </div>
          </section>
        )}

        {template.layout === 'two-column' ? (
          <>
            {/* Left Column */}
            <div className='resume-sidebar modern-sidebar'></div>

            {/* Right Column */}
            <div className='resume-main modern-main'>
              {/* Experience */}
              {experience.length > 0 && (
                <section className='resume-section'>
                  <h2 className='modern-section-title'>Experience</h2>
                  <div className='modern-timeline'>
                    {experience.map((exp, index) => (
                      <div key={exp.id} className='modern-timeline-item'>
                        <div className='modern-timeline-marker'></div>
                        <div className='modern-timeline-content'>
                          <div className='resume-item-header modern-item-header'>
                            <div>
                              <div className='resume-item-title modern-item-title'>
                                {exp.position}
                              </div>
                              <div className='resume-item-subtitle modern-item-subtitle'>
                                {exp.company}
                              </div>
                            </div>
                            <div className='modern-item-meta'>
                              <div className='modern-date-badge'>
                                {exp.startDate} -{' '}
                                {exp.isCurrentPosition
                                  ? 'Present'
                                  : exp.endDate}
                              </div>
                              <div className='resume-item-location'>
                                {exp.location}
                              </div>
                            </div>
                          </div>
                          <div className='resume-item-description'>
                            {exp.description}
                          </div>
                          {exp.achievements.length > 0 && (
                            <ul className='modern-achievements'>
                              {exp.achievements.map(
                                (achievement, achievementIndex) => (
                                  <li
                                    key={achievementIndex}
                                    className='modern-achievement'
                                  >
                                    {achievement}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <section className='resume-section'>
                  <h2 className='modern-section-title'>Education</h2>
                  <div className='modern-education-grid'>
                    {education.map(edu => (
                      <div key={edu.id} className='modern-education-card'>
                        <div className='modern-card-header'>
                          <div className='resume-item-title modern-item-title'>
                            {edu.degree}
                          </div>
                          <div className='modern-date-badge small'>
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                        <div className='resume-item-subtitle modern-item-subtitle'>
                          {edu.fieldOfStudy}
                        </div>
                        <div className='modern-institution'>
                          {edu.institution}
                        </div>
                        {edu.gpa && (
                          <div className='modern-gpa'>GPA: {edu.gpa}</div>
                        )}
                        {edu.description && (
                          <div className='resume-item-description'>
                            {edu.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          /* Single Column Layout */
          <div className='resume-main modern-main'>
            {/* Experience */}
            {experience.length > 0 && (
              <section className='resume-section'>
                <h2 className='modern-section-title'>Experience</h2>
                <div className='modern-timeline'>
                  {experience.map((exp, index) => (
                    <div key={exp.id} className='modern-timeline-item'>
                      <div className='modern-timeline-marker'></div>
                      <div className='modern-timeline-content'>
                        <div className='resume-item-header modern-item-header'>
                          <div>
                            <div className='resume-item-title modern-item-title'>
                              {exp.position}
                            </div>
                            <div className='resume-item-subtitle modern-item-subtitle'>
                              {exp.company}
                            </div>
                          </div>
                          <div className='modern-item-meta'>
                            <div className='modern-date-badge'>
                              {exp.startDate} -{' '}
                              {exp.isCurrentPosition ? 'Present' : exp.endDate}
                            </div>
                            <div className='resume-item-location'>
                              {exp.location}
                            </div>
                          </div>
                        </div>
                        <div className='resume-item-description'>
                          {exp.description}
                        </div>
                        {exp.achievements.length > 0 && (
                          <ul className='modern-achievements'>
                            {exp.achievements.map(
                              (achievement, achievementIndex) => (
                                <li
                                  key={achievementIndex}
                                  className='modern-achievement'
                                >
                                  {achievement}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className='resume-section'>
                <h2 className='modern-section-title'>Education</h2>
                <div className='modern-education-grid'>
                  {education.map(edu => (
                    <div key={edu.id} className='modern-education-card'>
                      <div className='modern-card-header'>
                        <div className='resume-item-title modern-item-title'>
                          {edu.degree}
                        </div>
                        <div className='modern-date-badge small'>
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                      <div className='resume-item-subtitle modern-item-subtitle'>
                        {edu.fieldOfStudy}
                      </div>
                      <div className='modern-institution'>
                        {edu.institution}
                      </div>
                      {edu.gpa && (
                        <div className='modern-gpa'>GPA: {edu.gpa}</div>
                      )}
                      {edu.description && (
                        <div className='resume-item-description'>
                          {edu.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
