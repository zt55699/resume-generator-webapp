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
            <span key={skill.id} className="resume-skill-tag">
              {skill.name}
              <span className="resume-skill-level">({skill.level})</span>
            </span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`traditional-template layout-${template.layout}`}>
      {/* Header */}
      <header className="resume-header">
        {personalInfo.profilePhoto && (
          <img 
            src={personalInfo.profilePhoto} 
            alt="Profile" 
            className="resume-profile-photo"
          />
        )}
        <h1 className="resume-name">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="resume-contact">
          <div className="resume-contact-item">
            <span>📧</span>
            <span>{personalInfo.email}</span>
          </div>
          <div className="resume-contact-item">
            <span>📞</span>
            <span>{personalInfo.phone}</span>
          </div>
          <div className="resume-contact-item">
            <span>📍</span>
            <span>{personalInfo.city}, {personalInfo.state}</span>
          </div>
          {personalInfo.website && (
            <div className="resume-contact-item">
              <span>🌐</span>
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="resume-contact-item">
              <span>💼</span>
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      <div className="resume-body">
        {template.layout === 'two-column' ? (
          <>
            {/* Left Column */}
            <div className="resume-sidebar">
              {/* Summary */}
              {personalInfo.summary && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Professional Summary</h2>
                  <div className="resume-summary">{personalInfo.summary}</div>
                </section>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Skills</h2>
                  <div className="resume-skills-grid">
                    {renderSkillsByCategory()}
                  </div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Languages</h2>
                  <div className="resume-languages">
                    {languages.map(language => (
                      <div key={language.id} className="resume-language">
                        <span className="resume-language-name">{language.name}</span>
                        <span className="resume-language-level">{language.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Certifications</h2>
                  <div className="resume-certifications">
                    {certifications.map(cert => (
                      <div key={cert.id} className="resume-certification">
                        <div className="resume-certification-name">{cert.name}</div>
                        <div className="resume-certification-issuer">{cert.issuer}</div>
                        <div className="resume-certification-date">{cert.dateIssued}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="resume-main">
              {/* Experience */}
              {experience.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Professional Experience</h2>
                  {experience.map(exp => (
                    <div key={exp.id} className="resume-item">
                      <div className="resume-item-header">
                        <div>
                          <div className="resume-item-title">{exp.position}</div>
                          <div className="resume-item-subtitle">{exp.company}</div>
                        </div>
                        <div className="resume-item-meta">
                          <div className="resume-item-date">
                            {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                          </div>
                          <div className="resume-item-location">{exp.location}</div>
                        </div>
                      </div>
                      <div className="resume-item-description">{exp.description}</div>
                      {exp.achievements.length > 0 && (
                        <ul className="resume-achievements">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index} className="resume-achievement">{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <section className="resume-section">
                  <h2 className="resume-section-title">Education</h2>
                  {education.map(edu => (
                    <div key={edu.id} className="resume-item">
                      <div className="resume-item-header">
                        <div>
                          <div className="resume-item-title">{edu.degree} in {edu.fieldOfStudy}</div>
                          <div className="resume-item-subtitle">{edu.institution}</div>
                        </div>
                        <div className="resume-item-meta">
                          <div className="resume-item-date">{edu.startDate} - {edu.endDate}</div>
                          <div className="resume-item-location">{edu.location}</div>
                          {edu.gpa && <div>GPA: {edu.gpa}</div>}
                        </div>
                      </div>
                      {edu.description && (
                        <div className="resume-item-description">{edu.description}</div>
                      )}
                      {edu.achievements.length > 0 && (
                        <ul className="resume-achievements">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index} className="resume-achievement">{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </>
        ) : (
          /* Single Column Layout */
          <div className="resume-main">
            {/* Summary */}
            {personalInfo.summary && (
              <section className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <div className="resume-summary">{personalInfo.summary}</div>
              </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Professional Experience</h2>
                {experience.map(exp => (
                  <div key={exp.id} className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">{exp.position}</div>
                        <div className="resume-item-subtitle">{exp.company}</div>
                      </div>
                      <div className="resume-item-meta">
                        <div className="resume-item-date">
                          {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}
                        </div>
                        <div className="resume-item-location">{exp.location}</div>
                      </div>
                    </div>
                    <div className="resume-item-description">{exp.description}</div>
                    {exp.achievements.length > 0 && (
                      <ul className="resume-achievements">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="resume-achievement">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="resume-item">
                    <div className="resume-item-header">
                      <div>
                        <div className="resume-item-title">{edu.degree} in {edu.fieldOfStudy}</div>
                        <div className="resume-item-subtitle">{edu.institution}</div>
                      </div>
                      <div className="resume-item-meta">
                        <div className="resume-item-date">{edu.startDate} - {edu.endDate}</div>
                        <div className="resume-item-location">{edu.location}</div>
                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                      </div>
                    </div>
                    {edu.description && (
                      <div className="resume-item-description">{edu.description}</div>
                    )}
                    {edu.achievements.length > 0 && (
                      <ul className="resume-achievements">
                        {edu.achievements.map((achievement, index) => (
                          <li key={index} className="resume-achievement">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Skills</h2>
                <div className="resume-skills-grid">
                  {renderSkillsByCategory()}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Projects</h2>
                <div className="resume-projects-grid">
                  {projects.map(project => (
                    <div key={project.id} className="resume-project">
                      <div className="resume-project-header">
                        <div className="resume-project-title">{project.name}</div>
                        <div className="resume-project-links">
                          {project.url && (
                            <a href={project.url} className="resume-project-link" target="_blank" rel="noopener noreferrer">
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="resume-project-link" target="_blank" rel="noopener noreferrer">
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="resume-item-description">{project.description}</div>
                      <div className="resume-project-technologies">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="resume-technology-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Languages</h2>
                <div className="resume-languages">
                  {languages.map(language => (
                    <div key={language.id} className="resume-language">
                      <span className="resume-language-name">{language.name}</span>
                      <span className="resume-language-level">{language.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">Certifications</h2>
                <div className="resume-certifications">
                  {certifications.map(cert => (
                    <div key={cert.id} className="resume-certification">
                      <div className="resume-certification-name">{cert.name}</div>
                      <div className="resume-certification-issuer">{cert.issuer}</div>
                      <div className="resume-certification-date">{cert.dateIssued}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Sections */}
            {customSections.map(section => (
              <section key={section.id} className="resume-section">
                <h2 className="resume-section-title">{section.title}</h2>
                <div className="resume-item-description">{section.content}</div>
              </section>
            ))}

            {/* References */}
            {references.length > 0 && (
              <section className="resume-section">
                <h2 className="resume-section-title">References</h2>
                <div className="resume-references">
                  {references.map(ref => (
                    <div key={ref.id} className="resume-reference">
                      <div className="resume-reference-name">{ref.name}</div>
                      <div className="resume-reference-title">{ref.position} at {ref.company}</div>
                      <div className="resume-reference-contact">
                        <div>{ref.email}</div>
                        <div>{ref.phone}</div>
                        <div>Relationship: {ref.relationship}</div>
                      </div>
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

export default TraditionalTemplate;