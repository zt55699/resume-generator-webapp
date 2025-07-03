import { ResumeData, Template, ExportOptions } from '../../types';
import { downloadFile, blobToBase64 } from '../../utils/fileUtils';

class HTMLExporter {
  static async export(resumeData: ResumeData, template: Template, options: ExportOptions): Promise<boolean> {
    try {
      const html = await this.generateHTML(resumeData, template, options);
      const filename = this.generateFilename(resumeData);
      downloadFile(html, filename, 'text/html');
      return true;
    } catch (error) {
      console.error('HTML export failed:', error);
      return false;
    }
  }

  private static async generateHTML(resumeData: ResumeData, template: Template, options: ExportOptions): Promise<string> {
    const css = this.generateCSS(template, options);
    const bodyContent = await this.generateBodyContent(resumeData, template, options);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - Resume</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${bodyContent}
    <script>
        // Print functionality
        function printResume() {
            window.print();
        }
        
        // Add print button
        document.addEventListener('DOMContentLoaded', function() {
            const printButton = document.createElement('button');
            printButton.textContent = 'Print Resume';
            printButton.className = 'print-button';
            printButton.onclick = printResume;
            document.body.insertBefore(printButton, document.body.firstChild);
        });
    </script>
</body>
</html>`;
  }

  private static generateCSS(template: Template, options: ExportOptions): string {
    return `
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${template.fonts.secondary};
            line-height: 1.6;
            color: ${template.colors.text};
            background-color: ${template.colors.background};
            padding: 20px;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: ${template.colors.primary};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .print-button:hover {
            background-color: ${template.colors.secondary};
        }
        
        @media print {
            .print-button {
                display: none;
            }
            
            body {
                padding: 0;
                background: white;
                color: black;
            }
        }
        
        /* Resume container */
        .resume-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        /* Header styles */
        .resume-header {
            background: linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary});
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .profile-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 20px;
        }
        
        .resume-name {
            font-family: ${template.fonts.primary};
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .contact-link {
            color: inherit;
            text-decoration: none;
        }
        
        .contact-link:hover {
            text-decoration: underline;
        }
        
        /* Body styles */
        .resume-body {
            padding: 40px;
        }
        
        .resume-section {
            margin-bottom: 40px;
        }
        
        .resume-section:last-child {
            margin-bottom: 0;
        }
        
        .section-title {
            font-family: ${template.fonts.primary};
            font-size: 1.5rem;
            font-weight: 600;
            color: ${template.colors.primary};
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid ${template.colors.accent};
        }
        
        .summary {
            font-size: 1rem;
            line-height: 1.7;
            text-align: justify;
            color: ${template.colors.text};
        }
        
        /* Experience and Education */
        .resume-item {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .resume-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .item-title {
            font-weight: 600;
            font-size: 1.125rem;
            color: ${template.colors.primary};
        }
        
        .item-subtitle {
            font-weight: 500;
            color: ${template.colors.secondary};
        }
        
        .item-meta {
            text-align: right;
            font-size: 0.875rem;
            color: ${template.colors.secondary};
        }
        
        .item-date {
            font-weight: 500;
        }
        
        .item-location {
            font-style: italic;
        }
        
        .item-description {
            margin-top: 10px;
            line-height: 1.6;
        }
        
        .achievements {
            list-style: none;
            margin-top: 15px;
        }
        
        .achievement {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        .achievement::before {
            content: '•';
            color: ${template.colors.accent};
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        /* Skills */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px;
        }
        
        .skill-category {
            margin-bottom: 20px;
        }
        
        .skill-category-title {
            font-weight: 600;
            color: ${template.colors.primary};
            margin-bottom: 10px;
            font-size: 1rem;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-tag {
            background-color: ${template.colors.accent};
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        /* Projects */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .project {
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
            gap: 10px;
        }
        
        .project-title {
            font-weight: 600;
            color: ${template.colors.primary};
            font-size: 1.125rem;
        }
        
        .project-links {
            display: flex;
            gap: 10px;
        }
        
        .project-link {
            color: ${template.colors.accent};
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .project-link:hover {
            text-decoration: underline;
        }
        
        .project-technologies {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 15px;
        }
        
        .technology-tag {
            background-color: ${template.colors.secondary};
            color: white;
            padding: 3px 8px;
            border-radius: 5px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .project-image,
        .project-video {
            max-width: 100%;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        /* Languages and Certifications */
        .languages-grid,
        .certifications-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .language,
        .certification {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 5px;
        }
        
        .certification {
            flex-direction: column;
            align-items: start;
            border-left: 3px solid ${template.colors.accent};
        }
        
        .language-name,
        .certification-name {
            font-weight: 500;
        }
        
        .language-level {
            font-size: 0.875rem;
            color: ${template.colors.secondary};
        }
        
        .certification-issuer {
            color: ${template.colors.secondary};
            font-size: 0.875rem;
        }
        
        .certification-date {
            color: ${template.colors.secondary};
            font-size: 0.75rem;
            margin-top: 5px;
        }
        
        /* References */
        .references-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
        }
        
        .reference {
            text-align: center;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.02);
            border-radius: 8px;
        }
        
        .reference-name {
            font-weight: 600;
            color: ${template.colors.primary};
            margin-bottom: 5px;
        }
        
        .reference-title {
            font-size: 0.875rem;
            color: ${template.colors.secondary};
            margin-bottom: 10px;
        }
        
        .reference-contact {
            font-size: 0.75rem;
            color: ${template.colors.secondary};
            line-height: 1.4;
        }
        
        /* Two-column layout */
        .layout-two-column .resume-body {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 40px;
        }
        
        .layout-three-column .resume-body {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 30px;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .resume-header {
                padding: 30px 20px;
            }
            
            .resume-name {
                font-size: 2rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
            
            .resume-body {
                padding: 30px 20px;
            }
            
            .layout-two-column .resume-body,
            .layout-three-column .resume-body {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .item-header {
                flex-direction: column;
                align-items: start;
            }
            
            .item-meta {
                text-align: left;
            }
            
            .skills-grid,
            .projects-grid,
            .languages-grid,
            .certifications-grid,
            .references-grid {
                grid-template-columns: 1fr;
            }
            
            .print-button {
                position: relative;
                top: auto;
                right: auto;
                margin-bottom: 20px;
                display: block;
            }
        }
        
        /* Print styles */
        @media print {
            .resume-container {
                box-shadow: none;
                border-radius: 0;
                max-width: none;
            }
            
            .resume-header {
                background: white !important;
                color: black !important;
                border-bottom: 2px solid #ccc;
            }
            
            .section-title {
                color: black !important;
                border-bottom-color: #ccc !important;
            }
            
            .item-title {
                color: black !important;
            }
            
            .skill-tag,
            .technology-tag {
                background-color: #ccc !important;
                color: black !important;
            }
            
            .achievement::before {
                color: black !important;
            }
            
            .project-video {
                display: none;
            }
            
            @page {
                margin: 0.5in;
                size: ${options.paperSize === 'letter' ? 'letter' : options.paperSize === 'legal' ? 'legal' : 'A4'};
            }
        }
    `;
  }

  private static async generateBodyContent(resumeData: ResumeData, template: Template, options: ExportOptions): Promise<string> {
    const { personalInfo, experience, education } = resumeData;
    
    let profilePhotoHTML = '';
    if (options.includeProfilePhoto && personalInfo.profilePhoto) {
      try {
        // Convert image to base64 for embedding
        const response = await fetch(personalInfo.profilePhoto);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);
        profilePhotoHTML = `<img src="${base64}" alt="Profile Photo" class="profile-photo">`;
      } catch (error) {
        console.warn('Failed to embed profile photo:', error);
      }
    }

    const contactItems = [
      `<span class="contact-item">📧 <a href="mailto:${personalInfo.email}" class="contact-link">${personalInfo.email}</a></span>`,
      `<span class="contact-item">📞 <a href="tel:${personalInfo.phone}" class="contact-link">${personalInfo.phone}</a></span>`,
      `<span class="contact-item">📍 ${personalInfo.city}, ${personalInfo.state}</span>`,
    ];

    if (personalInfo.website) {
      contactItems.push(`<span class="contact-item">🌐 <a href="${personalInfo.website}" class="contact-link" target="_blank">${personalInfo.website}</a></span>`);
    }
    if (personalInfo.linkedin) {
      contactItems.push(`<span class="contact-item">💼 <a href="${personalInfo.linkedin}" class="contact-link" target="_blank">LinkedIn</a></span>`);
    }
    if (personalInfo.github) {
      contactItems.push(`<span class="contact-item">💻 <a href="${personalInfo.github}" class="contact-link" target="_blank">GitHub</a></span>`);
    }


    return `
      <div class="resume-container layout-${template.layout}">
        <header class="resume-header">
          ${profilePhotoHTML}
          <h1 class="resume-name">${personalInfo.firstName} ${personalInfo.lastName}</h1>
          <div class="contact-info">
            ${contactItems.join('')}
          </div>
        </header>
        
        <div class="resume-body">
          ${template.layout === 'two-column' ? this.generateTwoColumnLayout(resumeData) : this.generateSingleColumnLayout(resumeData)}
        </div>
      </div>
    `;
  }

  private static generateSingleColumnLayout(resumeData: ResumeData): string {
    const { personalInfo, experience, education } = resumeData;
    
    return `
      <div class="resume-main">
        ${personalInfo.summary ? `
          <section class="resume-section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary">${personalInfo.summary}</div>
          </section>
        ` : ''}
        
        ${experience.length > 0 ? `
          <section class="resume-section">
            <h2 class="section-title">Professional Experience</h2>
            ${experience.map(exp => this.generateExperienceHTML(exp)).join('')}
          </section>
        ` : ''}
        
        ${education.length > 0 ? `
          <section class="resume-section">
            <h2 class="section-title">Education</h2>
            ${education.map(edu => this.generateEducationHTML(edu)).join('')}
          </section>
        ` : ''}
        
      </div>
    `;
  }

  private static generateTwoColumnLayout(resumeData: ResumeData): string {
    const { personalInfo, experience, education } = resumeData;
    
    return `
      <div class="resume-sidebar">
        ${personalInfo.summary ? `
          <section class="resume-section">
            <h2 class="section-title">Summary</h2>
            <div class="summary">${personalInfo.summary}</div>
          </section>
        ` : ''}
        
      </div>
      
      <div class="resume-main">
        ${experience.length > 0 ? `
          <section class="resume-section">
            <h2 class="section-title">Experience</h2>
            ${experience.map(exp => this.generateExperienceHTML(exp)).join('')}
          </section>
        ` : ''}
        
        ${education.length > 0 ? `
          <section class="resume-section">
            <h2 class="section-title">Education</h2>
            ${education.map(edu => this.generateEducationHTML(edu)).join('')}
          </section>
        ` : ''}
        
      </div>
    `;
  }

  private static generateExperienceHTML(exp: any): string {
    return `
      <div class="resume-item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.position}</div>
            <div class="item-subtitle">${exp.company}</div>
          </div>
          <div class="item-meta">
            <div class="item-date">${exp.startDate} - ${exp.isCurrentPosition ? 'Present' : exp.endDate}</div>
            <div class="item-location">${exp.location}</div>
          </div>
        </div>
        <div class="item-description">${exp.description}</div>
        ${exp.achievements.length > 0 ? `
          <ul class="achievements">
            ${exp.achievements.map((achievement: string) => `<li class="achievement">${achievement}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }

  private static generateEducationHTML(edu: any): string {
    return `
      <div class="resume-item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.degree} in ${edu.fieldOfStudy}</div>
            <div class="item-subtitle">${edu.institution}</div>
          </div>
          <div class="item-meta">
            <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
            <div class="item-location">${edu.location}</div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
          </div>
        </div>
        ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
        ${edu.achievements.length > 0 ? `
          <ul class="achievements">
            ${edu.achievements.map((achievement: string) => `<li class="achievement">${achievement}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  }


  private static generateFilename(resumeData: ResumeData): string {
    const name = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}`;
    const date = new Date().toISOString().split('T')[0];
    return `${name}_Resume_${date}.html`;
  }
}

export default HTMLExporter;