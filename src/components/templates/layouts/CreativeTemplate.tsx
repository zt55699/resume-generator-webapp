import React from 'react';
import { ResumeData, Template } from '../../../types';

interface CreativeTemplateProps {
  resumeData: ResumeData;
  template: Template;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({
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
      <div key={category} className="creative-skill-category">
        <div className="creative-skill-category-title">{category}</div>
        <div className="creative-skills-container">
          {categorySkills.map(skill => (
            <div key={skill.id} className="creative-skill-item">
              <span className="creative-skill-name">{skill.name}</span>
              <div className="creative-skill-level-container">
                <div 
                  className="creative-skill-level"
                  style={{
                    width: skill.level === 'Expert' ? '100%' :
                           skill.level === 'Advanced' ? '80%' :
                           skill.level === 'Intermediate' ? '60%' : '40%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`creative-template layout-${template.layout}`}>
      {/* Creative Header with unique design */}
      <header className="creative-header">
        <div className="creative-header-bg">
          <div className="creative-shape-1"></div>
          <div className="creative-shape-2"></div>
          <div className="creative-shape-3"></div>
        </div>
        <div className="creative-header-content">
          <div className="creative-profile-section">
            {personalInfo.profilePhoto && (
              <div className="creative-photo-container">
                <img 
                  src={personalInfo.profilePhoto} 
                  alt="Profile" 
                  className="creative-profile-photo"
                />
                <div className="creative-photo-frame"></div>
              </div>
            )}
          </div>
          <div className="creative-info-section">
            <h1 className="creative-name">
              <span className="creative-name-first">{personalInfo.firstName}</span>
              <span className="creative-name-last">{personalInfo.lastName}</span>
            </h1>
            <div className="creative-contact-artistic">
              <div className="creative-contact-item">
                <div className="creative-contact-icon">✉</div>
                <span>{personalInfo.email}</span>
              </div>
              <div className="creative-contact-item">
                <div className="creative-contact-icon">📱</div>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="creative-contact-item">
                <div className="creative-contact-icon">📍</div>
                <span>{personalInfo.city}, {personalInfo.state}</span>
              </div>
              {personalInfo.website && (
                <div className="creative-contact-item">
                  <div className="creative-contact-icon">🌐</div>
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="creative-contact-item">
                  <div className="creative-contact-icon">💼</div>
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="resume-body creative-body">
        {/* Creative Summary */}
        {personalInfo.summary && (
          <section className="creative-summary-section">
            <div className="creative-section-header">
              <h2 className="creative-section-title">Creative Vision</h2>
              <div className="creative-section-decoration"></div>
            </div>
            <div className="creative-summary-content">
              <div className="creative-quote-mark">"</div>
              <div className="creative-summary-text">{personalInfo.summary}</div>
              <div className="creative-quote-mark closing">"</div>
            </div>
          </section>
        )}

        {template.layout === 'three-column' ? (
          <>
            {/* Left Column - Skills & Languages */}
            <div className="creative-sidebar-left">
              {/* Skills */}
              {skills.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Skills & Expertise</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-skills-grid">
                    {renderSkillsByCategory()}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Languages</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-languages">
                    {languages.map(language => (
                      <div key={language.id} className="creative-language">
                        <div className="creative-language-name">{language.name}</div>
                        <div className="creative-language-dots">
                          {Array.from({length: 5}).map((_, i) => (
                            <div 
                              key={i} 
                              className={`creative-dot ${
                                (language.proficiency === 'Native' && i < 5) ||
                                (language.proficiency === 'Professional' && i < 4) ||
                                (language.proficiency === 'Conversational' && i < 3) ||
                                (language.proficiency === 'Basic' && i < 2) ? 'active' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Center Column - Experience & Education */}
            <div className="creative-main-center">
              {/* Experience */}
              {experience.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Professional Journey</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-experience-flow">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="creative-experience-card">
                        <div className="creative-card-number">{String(index + 1).padStart(2, '0')}</div>
                        <div className="creative-card-content">
                          <div className="creative-exp-header">
                            <div className="creative-exp-title">{exp.position}</div>
                            <div className="creative-exp-company">{exp.company}</div>
                            <div className="creative-exp-period">
                              {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                            </div>
                          </div>
                          <div className="creative-exp-description">{exp.description}</div>
                          {exp.achievements.length > 0 && (
                            <div className="creative-achievements">
                              {exp.achievements.map((achievement, achievementIndex) => (
                                <div key={achievementIndex} className="creative-achievement">
                                  <span className="creative-achievement-bullet">◆</span>
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Academic Background</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-education-cards">
                    {education.map(edu => (
                      <div key={edu.id} className="creative-education-card">
                        <div className="creative-edu-degree">{edu.degree}</div>
                        <div className="creative-edu-field">{edu.fieldOfStudy}</div>
                        <div className="creative-edu-school">{edu.institution}</div>
                        <div className="creative-edu-year">{edu.startDate} - {edu.endDate}</div>
                        {edu.gpa && <div className="creative-edu-gpa">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Projects & Certifications */}
            <div className="creative-sidebar-right">
              {/* Projects */}
              {projects.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Portfolio</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-projects">
                    {projects.map(project => (
                      <div key={project.id} className="creative-project-card">
                        <div className="creative-project-title">{project.name}</div>
                        <div className="creative-project-description">{project.description}</div>
                        <div className="creative-project-tech">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="creative-tech-badge">{tech}</span>
                          ))}
                        </div>
                        <div className="creative-project-links">
                          {project.url && (
                            <a href={project.url} className="creative-project-link">View</a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="creative-project-link">Code</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="creative-section">
                  <div className="creative-section-header">
                    <h2 className="creative-section-title">Certifications</h2>
                    <div className="creative-section-decoration"></div>
                  </div>
                  <div className="creative-certifications">
                    {certifications.map(cert => (
                      <div key={cert.id} className="creative-cert-badge">
                        <div className="creative-cert-name">{cert.name}</div>
                        <div className="creative-cert-issuer">{cert.issuer}</div>
                        <div className="creative-cert-year">{cert.dateIssued}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        ) : (
          /* Two Column or Single Column Layout */
          <div className="creative-main">
            {/* Single/Two column content similar structure but adjusted layout */}
            {/* Experience */}
            {experience.length > 0 && (
              <section className="creative-section">
                <div className="creative-section-header">
                  <h2 className="creative-section-title">Professional Journey</h2>
                  <div className="creative-section-decoration"></div>
                </div>
                <div className="creative-experience-flow">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="creative-experience-card">
                      <div className="creative-card-number">{String(index + 1).padStart(2, '0')}</div>
                      <div className="creative-card-content">
                        <div className="creative-exp-header">
                          <div className="creative-exp-title">{exp.position}</div>
                          <div className="creative-exp-company">{exp.company}</div>
                          <div className="creative-exp-period">
                            {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                          </div>
                        </div>
                        <div className="creative-exp-description">{exp.description}</div>
                        {exp.achievements.length > 0 && (
                          <div className="creative-achievements">
                            {exp.achievements.map((achievement, achievementIndex) => (
                              <div key={achievementIndex} className="creative-achievement">
                                <span className="creative-achievement-bullet">◆</span>
                                {achievement}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills, Education, Projects, etc. in single column */}
            {skills.length > 0 && (
              <section className="creative-section">
                <div className="creative-section-header">
                  <h2 className="creative-section-title">Skills & Expertise</h2>
                  <div className="creative-section-decoration"></div>
                </div>
                <div className="creative-skills-grid">
                  {renderSkillsByCategory()}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.map(section => (
              <section key={section.id} className="creative-section">
                <div className="creative-section-header">
                  <h2 className="creative-section-title">{section.title}</h2>
                  <div className="creative-section-decoration"></div>
                </div>
                <div className="creative-custom-content">{section.content}</div>
              </section>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CreativeTemplate;