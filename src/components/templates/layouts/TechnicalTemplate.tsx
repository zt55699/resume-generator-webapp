import React from 'react';
import { ResumeData, Template } from '../../../types';

interface TechnicalTemplateProps {
  resumeData: ResumeData;
  template: Template;
  isPreview?: boolean;
  showWatermark?: boolean;
}

const TechnicalTemplate: React.FC<TechnicalTemplateProps> = ({
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
      <div key={category} className="tech-skill-category">
        <div className="tech-skill-category-header">
          <span className="tech-category-icon">{'<>'}</span>
          <span className="tech-skill-category-title">{category}</span>
        </div>
        <div className="tech-skills-list">
          {categorySkills.map(skill => (
            <div key={skill.id} className="tech-skill-item">
              <span className="tech-skill-name">{skill.name}</span>
              <div className="tech-skill-level-container">
                <div className="tech-skill-level-bar">
                  <div 
                    className="tech-skill-level-fill"
                    style={{
                      width: skill.level === 'Expert' ? '100%' :
                             skill.level === 'Advanced' ? '75%' :
                             skill.level === 'Intermediate' ? '50%' : '25%'
                    }}
                  />
                </div>
                <span className="tech-skill-level-text">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`technical-template layout-${template.layout}`}>
      {/* Technical Header */}
      <header className="tech-header">
        <div className="tech-terminal">
          <div className="tech-terminal-header">
            <div className="tech-terminal-buttons">
              <span className="tech-button close"></span>
              <span className="tech-button minimize"></span>
              <span className="tech-button maximize"></span>
            </div>
            <div className="tech-terminal-title">~/resume</div>
          </div>
          <div className="tech-terminal-content">
            <div className="tech-command-line">
              <span className="tech-prompt">$</span>
              <span className="tech-command">whoami</span>
            </div>
            <div className="tech-output">
              <div className="tech-name-output">
                {personalInfo.firstName} {personalInfo.lastName}
              </div>
              {personalInfo.profilePhoto && (
                <div className="tech-profile-container">
                  <img 
                    src={personalInfo.profilePhoto} 
                    alt="Profile" 
                    className="tech-profile-photo"
                  />
                  <div className="tech-profile-frame">
                    <div className="tech-corner tl"></div>
                    <div className="tech-corner tr"></div>
                    <div className="tech-corner bl"></div>
                    <div className="tech-corner br"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="tech-command-line">
              <span className="tech-prompt">$</span>
              <span className="tech-command">cat contact.json</span>
            </div>
            <div className="tech-json-output">
              <div className="tech-json-line">{'{'}</div>
              <div className="tech-json-line">  <span className="tech-json-key">"email"</span>: <span className="tech-json-value">"{personalInfo.email}"</span>,</div>
              <div className="tech-json-line">  <span className="tech-json-key">"phone"</span>: <span className="tech-json-value">"{personalInfo.phone}"</span>,</div>
              <div className="tech-json-line">  <span className="tech-json-key">"location"</span>: <span className="tech-json-value">"{personalInfo.city}, {personalInfo.state}"</span>,</div>
              {personalInfo.website && (
                <div className="tech-json-line">  <span className="tech-json-key">"website"</span>: <span className="tech-json-value">"{personalInfo.website}"</span>,</div>
              )}
              {personalInfo.github && (
                <div className="tech-json-line">  <span className="tech-json-key">"github"</span>: <span className="tech-json-value">"{personalInfo.github}"</span>,</div>
              )}
              {personalInfo.linkedin && (
                <div className="tech-json-line">  <span className="tech-json-key">"linkedin"</span>: <span className="tech-json-value">"{personalInfo.linkedin}"</span></div>
              )}
              <div className="tech-json-line">{'}'}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="tech-body">
        {/* Summary as code comment */}
        {personalInfo.summary && (
          <section className="tech-section">
            <div className="tech-section-header">
              <span className="tech-comment">/*</span>
              <h2 className="tech-section-title">About</h2>
              <span className="tech-comment">*/</span>
            </div>
            <div className="tech-code-block">
              <div className="tech-line-numbers">
                {personalInfo.summary.split('\n').map((_, index) => (
                  <div key={index} className="tech-line-number">{index + 1}</div>
                ))}
              </div>
              <div className="tech-code-content">
                <div className="tech-comment-block">
                  /**<br />
                  {personalInfo.summary.split('\n').map((line, index) => (
                    <div key={index}> * {line}</div>
                  ))}
                  <br /> */
                </div>
              </div>
            </div>
          </section>
        )}

        {template.layout === 'two-column' ? (
          <>
            {/* Left Column - Technical Skills & Tools */}
            <div className="tech-sidebar">
              {/* Skills */}
              {skills.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">const</span>
                    <h2 className="tech-section-title">skills</h2>
                    <span className="tech-operator">=</span>
                    <span className="tech-bracket">{'{'}</span>
                  </div>
                  <div className="tech-skills-container">
                    {renderSkillsByCategory()}
                  </div>
                  <div className="tech-closing-bracket">{'};'}</div>
                </section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">const</span>
                    <h2 className="tech-section-title">languages</h2>
                    <span className="tech-operator">=</span>
                    <span className="tech-bracket">[</span>
                  </div>
                  <div className="tech-languages-array">
                    {languages.map((language, index) => (
                      <div key={language.id} className="tech-language-item">
                        <span className="tech-string">"{language.name}"</span>
                        <span className="tech-comment">// {language.proficiency}</span>
                        {index < languages.length - 1 && <span className="tech-comma">,</span>}
                      </div>
                    ))}
                  </div>
                  <div className="tech-closing-bracket">];</div>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">const</span>
                    <h2 className="tech-section-title">certifications</h2>
                    <span className="tech-operator">=</span>
                    <span className="tech-bracket">[</span>
                  </div>
                  <div className="tech-certifications-array">
                    {certifications.map((cert, index) => (
                      <div key={cert.id} className="tech-cert-object">
                        <div className="tech-object-line">  {'{'}</div>
                        <div className="tech-object-line">    <span className="tech-property">name</span>: <span className="tech-string">"{cert.name}"</span>,</div>
                        <div className="tech-object-line">    <span className="tech-property">issuer</span>: <span className="tech-string">"{cert.issuer}"</span>,</div>
                        <div className="tech-object-line">    <span className="tech-property">date</span>: <span className="tech-string">"{cert.dateIssued}"</span></div>
                        <div className="tech-object-line">  {'}'}{index < certifications.length - 1 ? ',' : ''}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tech-closing-bracket">];</div>
                </section>
              )}
            </div>

            {/* Right Column - Experience & Projects */}
            <div className="tech-main">
              {/* Experience */}
              {experience.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">class</span>
                    <h2 className="tech-section-title">Experience</h2>
                    <span className="tech-bracket">{'{'}</span>
                  </div>
                  <div className="tech-experience-methods">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="tech-method">
                        <div className="tech-method-signature">
                          <span className="tech-keyword">public</span>
                          <span className="tech-method-name">{exp.position.replace(/\s+/g, '')}</span>
                          <span className="tech-parameters">({exp.company})</span>
                          <span className="tech-bracket">{'{'}</span>
                        </div>
                        <div className="tech-method-body">
                          <div className="tech-comment">// {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}</div>
                          <div className="tech-comment">// Location: {exp.location}</div>
                          <div className="tech-method-content">
                            <div className="tech-docstring">
                              /**<br />
                               * {exp.description}<br />
                               */
                            </div>
                            {exp.achievements.length > 0 && (
                              <div className="tech-achievements">
                                <div className="tech-comment">// Key Achievements:</div>
                                {exp.achievements.map((achievement, achievementIndex) => (
                                  <div key={achievementIndex} className="tech-comment">// - {achievement}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="tech-closing-bracket">{'}'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tech-closing-bracket">{'}'}</div>
                </section>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">const</span>
                    <h2 className="tech-section-title">projects</h2>
                    <span className="tech-operator">=</span>
                    <span className="tech-bracket">[</span>
                  </div>
                  <div className="tech-projects-array">
                    {projects.map((project, index) => (
                      <div key={project.id} className="tech-project-object">
                        <div className="tech-object-line">  {'{'}</div>
                        <div className="tech-object-line">    <span className="tech-property">name</span>: <span className="tech-string">"{project.name}"</span>,</div>
                        <div className="tech-object-line">    <span className="tech-property">description</span>: <span className="tech-string">"{project.description}"</span>,</div>
                        <div className="tech-object-line">    <span className="tech-property">technologies</span>: [</div>
                        {project.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="tech-object-line">      <span className="tech-string">"{tech}"</span>{techIndex < project.technologies.length - 1 ? ',' : ''}</div>
                        ))}
                        <div className="tech-object-line">    ],</div>
                        {project.url && (
                          <div className="tech-object-line">    <span className="tech-property">demo</span>: <span className="tech-string">"{project.url}"</span>,</div>
                        )}
                        {project.githubUrl && (
                          <div className="tech-object-line">    <span className="tech-property">repository</span>: <span className="tech-string">"{project.githubUrl}"</span></div>
                        )}
                        <div className="tech-object-line">  {'}'}{index < projects.length - 1 ? ',' : ''}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tech-closing-bracket">];</div>
                </section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <section className="tech-section">
                  <div className="tech-section-header">
                    <span className="tech-keyword">interface</span>
                    <h2 className="tech-section-title">Education</h2>
                    <span className="tech-bracket">{'{'}</span>
                  </div>
                  <div className="tech-education-interface">
                    {education.map((edu, index) => (
                      <div key={edu.id} className="tech-interface-property">
                        <div className="tech-property-line">
                          <span className="tech-property">{edu.degree.replace(/\s+/g, '')}</span>: {'{'}
                        </div>
                        <div className="tech-nested-object">
                          <div className="tech-object-line">    <span className="tech-property">institution</span>: <span className="tech-string">"{edu.institution}"</span>,</div>
                          <div className="tech-object-line">    <span className="tech-property">field</span>: <span className="tech-string">"{edu.fieldOfStudy}"</span>,</div>
                          <div className="tech-object-line">    <span className="tech-property">period</span>: <span className="tech-string">"{edu.startDate} - {edu.endDate}"</span>,</div>
                          <div className="tech-object-line">    <span className="tech-property">location</span>: <span className="tech-string">"{edu.location}"</span></div>
                          {edu.gpa && (
                            <div className="tech-object-line">    <span className="tech-property">gpa</span>: <span className="tech-number">{edu.gpa}</span></div>
                          )}
                        </div>
                        <div className="tech-property-line">  {'}'}{index < education.length - 1 ? ',' : ''}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tech-closing-bracket">{'}'}</div>
                </section>
              )}
            </div>
          </>
        ) : (
          /* Single Column Layout */
          <div className="tech-main">
            {/* Experience */}
            {experience.length > 0 && (
              <section className="tech-section">
                <div className="tech-section-header">
                  <span className="tech-keyword">class</span>
                  <h2 className="tech-section-title">Experience</h2>
                  <span className="tech-bracket">{'{'}</span>
                </div>
                <div className="tech-experience-methods">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="tech-method">
                      <div className="tech-method-signature">
                        <span className="tech-keyword">public</span>
                        <span className="tech-method-name">{exp.position.replace(/\s+/g, '')}</span>
                        <span className="tech-parameters">({exp.company})</span>
                        <span className="tech-bracket">{'{'}</span>
                      </div>
                      <div className="tech-method-body">
                        <div className="tech-comment">// {exp.startDate} - {exp.isCurrentPosition ? 'Present' : exp.endDate}</div>
                        <div className="tech-comment">// Location: {exp.location}</div>
                        <div className="tech-method-content">
                          <div className="tech-docstring">
                            /**<br />
                             * {exp.description}<br />
                             */
                          </div>
                          {exp.achievements.length > 0 && (
                            <div className="tech-achievements">
                              <div className="tech-comment">// Key Achievements:</div>
                              {exp.achievements.map((achievement, achievementIndex) => (
                                <div key={achievementIndex} className="tech-comment">// - {achievement}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="tech-closing-bracket">{'}'}</div>
                    </div>
                  ))}
                </div>
                <div className="tech-closing-bracket">{'}'}</div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="tech-section">
                <div className="tech-section-header">
                  <span className="tech-keyword">const</span>
                  <h2 className="tech-section-title">skills</h2>
                  <span className="tech-operator">=</span>
                  <span className="tech-bracket">{'{'}</span>
                </div>
                <div className="tech-skills-container">
                  {renderSkillsByCategory()}
                </div>
                <div className="tech-closing-bracket">{'};'}</div>
              </section>
            )}

            {/* Education, Projects, etc. */}
            {/* Custom Sections */}
            {customSections.map(section => (
              <section key={section.id} className="tech-section">
                <div className="tech-section-header">
                  <span className="tech-comment">/*</span>
                  <h2 className="tech-section-title">{section.title}</h2>
                  <span className="tech-comment">*/</span>
                </div>
                <div className="tech-code-block">
                  <div className="tech-comment-block">
                    /**<br />
                    {section.content.split('\n').map((line, index) => (
                      <div key={index}> * {line}</div>
                    ))}
                    <br /> */
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default TechnicalTemplate;