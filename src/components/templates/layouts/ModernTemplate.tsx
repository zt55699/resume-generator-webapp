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
  const { personalInfo, experience, education, skills, projects, certifications, languages, references, customSections } = resumeData;

  const renderSkillsByCategory = () => {
    const skillsByCategory: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    return Object.entries(skillsByCategory).map(([category, categorySkills]) => (
      <div key={category} className="resume-skill-category">
        <div className="resume-skill-category-title">{category}</div>
        <div className="resume-skills-list">
          {categorySkills.map(skill => (
            <span key={skill.id} className="resume-skill-tag modern-skill-tag">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`modern-template layout-${template.layout}`}>
      {/* Header with modern styling */}
      <header className="resume-header modern-header">
        <div className="modern-header-content">
          {personalInfo.profilePhoto && (
            <img 
              src={personalInfo.profilePhoto} 
              alt="Profile" 
              className="resume-profile-photo modern-profile-photo"
            />
          )}
          <div className="modern-header-text">
            <h1 className="resume-name modern-name">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="modern-contact-grid">
              <div className="modern-contact-item">
                <span className="modern-icon">✉</span>
                <span>{personalInfo.email}</span>
              </div>
              <div className="modern-contact-item">
                <span className="modern-icon">☎</span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="modern-contact-item">
                <span className="modern-icon">📍</span>
                <span>{personalInfo.city}, {personalInfo.state}</span>
              </div>
              {personalInfo.website && (
                <div className="modern-contact-item">
                  <span className="modern-icon">🌐</span>
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="modern-contact-item">
                  <span className="modern-icon">💼</span>
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="modern-contact-item">
                  <span className="modern-icon">💻</span>
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="resume-body">
        {/* Summary with modern styling */}
        {personalInfo.summary && (
          <section className="resume-section modern-summary-section">
            <div className="modern-summary-content">
              <h2 className="modern-section-title">About Me</h2>
              <div className="resume-summary modern-summary">{personalInfo.summary}</div>
            </div>
          </section>
        )}

        {template.layout === 'two-column' ? (
          <>
            {/* Left Column */}
            <div className="resume-sidebar modern-sidebar">
              {/* Skills */}
              {skills.length > 0 && (
                <section className="resume-section">
                  <h2 className="modern-section-title">Expertise</h2>
                  <div className="modern-skills-container">
                    {renderSkillsByCategory()}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="resume-section">
                  <h2 className="modern-section-title">Languages</h2>
                  <div className="modern-languages">
                    {languages.map(language => (
                      <div key={language.id} className="modern-language">
                        <div className="modern-language-header">
                          <span className="resume-language-name">{language.name}</span>
                          <span className="modern-language-level">{language.proficiency}</span>
                        </div>
                        <div className="modern-progress-bar">
                          <div 
                            className="modern-progress-fill"
                            style={{
                              width: language.proficiency === 'Native' ? '100%' : 
                                     language.proficiency === 'Professional' ? '85%' :
                                     language.proficiency === 'Conversational' ? '70%' : '50%'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="resume-section">
                  <h2 className="modern-section-title">Certifications</h2>
                  <div className="modern-certifications">
                    {certifications.map(cert => (
                      <div key={cert.id} className="modern-certification">
                        <div className="modern-cert-badge">
                          <div className="resume-certification-name">{cert.name}</div>
                          <div className="resume-certification-issuer">{cert.issuer}</div>
                          <div className="resume-certification-date">{cert.dateIssued}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="resume-main modern-main">
              {/* Experience */}
              {experience.length > 0 && (
                <section className="resume-section">
                  <h2 className="modern-section-title">Experience</h2>
                  <div className="modern-timeline">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="modern-timeline-item">
                        <div className="modern-timeline-marker"></div>
                        <div className="modern-timeline-content">
                          <div className="resume-item-header modern-item-header">
                            <div>
                              <div className="resume-item-title modern-item-title">{exp.position}</div>
                              <div className="resume-item-subtitle modern-item-subtitle">{exp.company}</div>
                            </div>
                            <div className="modern-item-meta">
                              <div className="modern-date-badge">
                                {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                              </div>
                              <div className="resume-item-location">{exp.location}</div>
                            </div>
                          </div>
                          <div className="resume-item-description">{exp.description}</div>
                          {exp.achievements.length > 0 && (
                            <ul className="modern-achievements">
                              {exp.achievements.map((achievement, achievementIndex) => (
                                <li key={achievementIndex} className="modern-achievement">{achievement}</li>
                              ))}
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
                <section className="resume-section">
                  <h2 className="modern-section-title">Education</h2>
                  <div className="modern-education-grid">
                    {education.map(edu => (
                      <div key={edu.id} className="modern-education-card">
                        <div className="modern-card-header">
                          <div className="resume-item-title modern-item-title">{edu.degree}</div>
                          <div className="modern-date-badge small">
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                        <div className="resume-item-subtitle modern-item-subtitle">{edu.fieldOfStudy}</div>
                        <div className="modern-institution">{edu.institution}</div>
                        {edu.gpa && <div className="modern-gpa">GPA: {edu.gpa}</div>}
                        {edu.description && (
                          <div className="resume-item-description">{edu.description}</div>
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
          <div className="resume-main modern-main">
            {/* Experience */}
            {experience.length > 0 && (
              <section className="resume-section">
                <h2 className="modern-section-title">Experience</h2>
                <div className="modern-timeline">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="modern-timeline-item">
                      <div className="modern-timeline-marker"></div>
                      <div className="modern-timeline-content">
                        <div className="resume-item-header modern-item-header">
                          <div>
                            <div className="resume-item-title modern-item-title">{exp.position}</div>
                            <div className="resume-item-subtitle modern-item-subtitle">{exp.company}</div>
                          </div>
                          <div className="modern-item-meta">
                            <div className="modern-date-badge">
                              {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                            </div>
                            <div className="resume-item-location">{exp.location}</div>
                          </div>
                        </div>
                        <div className="resume-item-description">{exp.description}</div>
                        {exp.achievements.length > 0 && (
                          <ul className="modern-achievements">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex} className="modern-achievement">{achievement}</li>
                            ))}
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
              <section className="resume-section">
                <h2 className="modern-section-title">Education</h2>
                <div className="modern-education-grid">
                  {education.map(edu => (
                    <div key={edu.id} className="modern-education-card">
                      <div className="modern-card-header">
                        <div className="resume-item-title modern-item-title">{edu.degree}</div>
                        <div className="modern-date-badge small">
                          {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                      <div className="resume-item-subtitle modern-item-subtitle">{edu.fieldOfStudy}</div>
                      <div className="modern-institution">{edu.institution}</div>
                      {edu.gpa && <div className="modern-gpa">GPA: {edu.gpa}</div>}
                      {edu.description && (
                        <div className="resume-item-description">{edu.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="resume-section">
                <h2 className="modern-section-title">Expertise</h2>
                <div className="modern-skills-container">
                  {renderSkillsByCategory()}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="resume-section">
                <h2 className="modern-section-title">Featured Projects</h2>
                <div className="modern-projects-grid">
                  {projects.map(project => (
                    <div key={project.id} className="modern-project-card">
                      <div className="modern-project-header">
                        <div className="resume-project-title modern-project-title">{project.name}</div>
                        <div className="resume-project-links">
                          {project.url && (
                            <a href={project.url} className="modern-project-link" target="_blank" rel="noopener noreferrer">
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="modern-project-link" target="_blank" rel="noopener noreferrer">
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="resume-item-description">{project.description}</div>
                      <div className="modern-project-tech">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="modern-tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.map(section => (
              <section key={section.id} className="resume-section">
                <h2 className="modern-section-title">{section.title}</h2>
                <div className="resume-item-description">{section.content}</div>
              </section>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ModernTemplate;