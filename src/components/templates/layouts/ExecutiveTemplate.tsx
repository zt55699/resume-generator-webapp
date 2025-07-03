import React from 'react';
import { ResumeData, Template } from '../../../types';

interface ExecutiveTemplateProps {
  resumeData: ResumeData;
  template: Template;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({
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
      <div key={category} className="exec-skill-category">
        <div className="exec-skill-category-title">{category}</div>
        <div className="exec-skills-list">
          {categorySkills.map(skill => (
            <span key={skill.id} className="exec-skill-badge">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`executive-template layout-${template.layout}`}>
      {/* Executive Header */}
      <header className="exec-header">
        <div className="exec-header-content">
          <div className="exec-profile-section">
            {personalInfo.profilePhoto && (
              <div className="exec-photo-frame">
                <img 
                  src={personalInfo.profilePhoto} 
                  alt="Profile" 
                  className="exec-profile-photo"
                />
                <div className="exec-photo-border"></div>
              </div>
            )}
          </div>
          <div className="exec-name-section">
            <h1 className="exec-name">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="exec-title-line"></div>
            <div className="exec-contact-executive">
              <div className="exec-contact-row">
                <div className="exec-contact-item">
                  <span className="exec-contact-label">Email</span>
                  <span className="exec-contact-value">{personalInfo.email}</span>
                </div>
                <div className="exec-contact-item">
                  <span className="exec-contact-label">Phone</span>
                  <span className="exec-contact-value">{personalInfo.phone}</span>
                </div>
              </div>
              <div className="exec-contact-row">
                <div className="exec-contact-item">
                  <span className="exec-contact-label">Location</span>
                  <span className="exec-contact-value">{personalInfo.city}, {personalInfo.state}</span>
                </div>
                {personalInfo.linkedin && (
                  <div className="exec-contact-item">
                    <span className="exec-contact-label">LinkedIn</span>
                    <span className="exec-contact-value">{personalInfo.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="exec-body">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section className="exec-summary-section">
            <div className="exec-section-header">
              <h2 className="exec-section-title">Executive Summary</h2>
              <div className="exec-section-line"></div>
            </div>
            <div className="exec-summary-content">
              <div className="exec-summary-text">{personalInfo.summary}</div>
            </div>
          </section>
        )}

        {template.layout === 'two-column' ? (
          <>
            {/* Left Column - Core Competencies & Leadership */}
            <div className="exec-sidebar">
              {/* Core Competencies */}
              {skills.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Core Competencies</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-competencies">
                    {renderSkillsByCategory()}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Languages</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-languages">
                    {languages.map(language => (
                      <div key={language.id} className="exec-language">
                        <div className="exec-language-name">{language.name}</div>
                        <div className="exec-language-level">{language.proficiency}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Executive Education */}
              {education.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Education</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-education">
                    {education.map(edu => (
                      <div key={edu.id} className="exec-education-item">
                        <div className="exec-edu-degree">{edu.degree}</div>
                        <div className="exec-edu-field">{edu.fieldOfStudy}</div>
                        <div className="exec-edu-school">{edu.institution}</div>
                        <div className="exec-edu-year">{edu.startDate} - {edu.endDate}</div>
                        {edu.gpa && <div className="exec-edu-gpa">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Professional Certifications</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-certifications">
                    {certifications.map(cert => (
                      <div key={cert.id} className="exec-certification">
                        <div className="exec-cert-name">{cert.name}</div>
                        <div className="exec-cert-issuer">{cert.issuer}</div>
                        <div className="exec-cert-date">{cert.dateIssued}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Professional Experience */}
            <div className="exec-main">
              {/* Professional Experience */}
              {experience.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Professional Experience</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-experience">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="exec-experience-item">
                        <div className="exec-exp-header">
                          <div className="exec-exp-left">
                            <div className="exec-exp-position">{exp.position}</div>
                            <div className="exec-exp-company">{exp.company}</div>
                          </div>
                          <div className="exec-exp-right">
                            <div className="exec-exp-dates">
                              {exp.startDate} – {exp.isCurrentPosition ? 'Present' : exp.endDate}
                            </div>
                            <div className="exec-exp-location">{exp.location}</div>
                          </div>
                        </div>
                        <div className="exec-exp-content">
                          <div className="exec-exp-description">{exp.description}</div>
                          {exp.achievements.length > 0 && (
                            <div className="exec-achievements">
                              <div className="exec-achievements-title">Key Achievements:</div>
                              <ul className="exec-achievements-list">
                                {exp.achievements.map((achievement, achievementIndex) => (
                                  <li key={achievementIndex} className="exec-achievement">
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        {index < experience.length - 1 && <div className="exec-experience-divider"></div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Leadership Projects */}
              {projects.length > 0 && (
                <section className="exec-section">
                  <div className="exec-section-header">
                    <h2 className="exec-section-title">Leadership Initiatives</h2>
                    <div className="exec-section-line"></div>
                  </div>
                  <div className="exec-projects">
                    {projects.map(project => (
                      <div key={project.id} className="exec-project">
                        <div className="exec-project-header">
                          <div className="exec-project-name">{project.name}</div>
                          <div className="exec-project-period">
                            {project.startDate} - {project.endDate}
                          </div>
                        </div>
                        <div className="exec-project-description">{project.description}</div>
                        {project.technologies.length > 0 && (
                          <div className="exec-project-scope">
                            <span className="exec-scope-label">Scope:</span>
                            <span className="exec-scope-items">{project.technologies.join(', ')}</span>
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
          <div className="exec-main">
            {/* Professional Experience */}
            {experience.length > 0 && (
              <section className="exec-section">
                <div className="exec-section-header">
                  <h2 className="exec-section-title">Professional Experience</h2>
                  <div className="exec-section-line"></div>
                </div>
                <div className="exec-experience">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="exec-experience-item">
                      <div className="exec-exp-header">
                        <div className="exec-exp-left">
                          <div className="exec-exp-position">{exp.position}</div>
                          <div className="exec-exp-company">{exp.company}</div>
                        </div>
                        <div className="exec-exp-right">
                          <div className="exec-exp-dates">
                            {exp.startDate} – {exp.isCurrentPosition ? 'Present' : exp.endDate}
                          </div>
                          <div className="exec-exp-location">{exp.location}</div>
                        </div>
                      </div>
                      <div className="exec-exp-content">
                        <div className="exec-exp-description">{exp.description}</div>
                        {exp.achievements.length > 0 && (
                          <div className="exec-achievements">
                            <div className="exec-achievements-title">Key Achievements:</div>
                            <ul className="exec-achievements-list">
                              {exp.achievements.map((achievement, achievementIndex) => (
                                <li key={achievementIndex} className="exec-achievement">
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {index < experience.length - 1 && <div className="exec-experience-divider"></div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Core Competencies */}
            {skills.length > 0 && (
              <section className="exec-section">
                <div className="exec-section-header">
                  <h2 className="exec-section-title">Core Competencies</h2>
                  <div className="exec-section-line"></div>
                </div>
                <div className="exec-competencies">
                  {renderSkillsByCategory()}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="exec-section">
                <div className="exec-section-header">
                  <h2 className="exec-section-title">Education</h2>
                  <div className="exec-section-line"></div>
                </div>
                <div className="exec-education-grid">
                  {education.map(edu => (
                    <div key={edu.id} className="exec-education-item">
                      <div className="exec-edu-degree">{edu.degree}</div>
                      <div className="exec-edu-field">{edu.fieldOfStudy}</div>
                      <div className="exec-edu-school">{edu.institution}</div>
                      <div className="exec-edu-year">{edu.startDate} - {edu.endDate}</div>
                      {edu.gpa && <div className="exec-edu-gpa">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.map(section => (
              <section key={section.id} className="exec-section">
                <div className="exec-section-header">
                  <h2 className="exec-section-title">{section.title}</h2>
                  <div className="exec-section-line"></div>
                </div>
                <div className="exec-custom-content">{section.content}</div>
              </section>
            ))}

            {/* Professional References */}
            {references.length > 0 && (
              <section className="exec-section">
                <div className="exec-section-header">
                  <h2 className="exec-section-title">Professional References</h2>
                  <div className="exec-section-line"></div>
                </div>
                <div className="exec-references">
                  {references.map(ref => (
                    <div key={ref.id} className="exec-reference">
                      <div className="exec-ref-name">{ref.name}</div>
                      <div className="exec-ref-title">{ref.position}</div>
                      <div className="exec-ref-company">{ref.company}</div>
                      <div className="exec-ref-contact">
                        <span>{ref.email}</span> | <span>{ref.phone}</span>
                      </div>
                      <div className="exec-ref-relationship">Relationship: {ref.relationship}</div>
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

export default ExecutiveTemplate;