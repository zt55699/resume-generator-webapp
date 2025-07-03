import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeData, Template, ExportOptions } from '../../types';
import { downloadFile } from '../../utils/fileUtils';
import ResumeRenderer from '../templates/ResumeRenderer';

class PDFExporter {
  static async export(resumeData: ResumeData, template: Template, options: ExportOptions): Promise<boolean> {
    try {
      // Create a temporary container for rendering
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '210mm'; // A4 width
      container.style.background = 'white';
      container.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(container);

      // Render the resume HTML
      const resumeHTML = await this.generateResumeHTML(resumeData, template, options);
      container.innerHTML = resumeHTML;

      // Wait for fonts and images to load
      await this.waitForContentLoad(container);

      // Generate PDF
      const pdf = await this.createPDF(container, options);
      
      // Clean up
      document.body.removeChild(container);

      // Download the PDF
      const filename = this.generateFilename(resumeData);
      const pdfBlob = pdf.output('blob');
      downloadFile(pdfBlob, filename, 'application/pdf');

      return true;
    } catch (error) {
      console.error('PDF export failed:', error);
      return false;
    }
  }

  private static async generateResumeHTML(resumeData: ResumeData, template: Template, options: ExportOptions): Promise<string> {
    const { personalInfo, experience, education } = resumeData;
    
    // Generate styles for PDF
    const styles = this.generatePDFStyles(template, options);
    
    // Contact information
    const contactItems = [
      `📧 ${personalInfo.email}`,
      `📞 ${personalInfo.phone}`,
      `📍 ${personalInfo.city}, ${personalInfo.state}`,
    ];
    
    if (personalInfo.website) contactItems.push(`🌐 ${personalInfo.website}`);
    if (personalInfo.linkedin) contactItems.push(`💼 LinkedIn`);
    if (personalInfo.github) contactItems.push(`💻 GitHub`);


    return `
      <style>${styles}</style>
      <div class="pdf-resume ${template.layout}">
        <!-- Header -->
        <div class="pdf-header">
          ${options.includeProfilePhoto && personalInfo.profilePhoto ? `
            <img src="${personalInfo.profilePhoto}" alt="Profile" class="profile-photo" onerror="this.style.display='none'">
          ` : ''}
          <div class="header-info">
            <h1 class="name">${personalInfo.firstName} ${personalInfo.lastName}</h1>
            <div class="contact-info">
              ${contactItems.join(' | ')}
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="pdf-body">
          ${personalInfo.summary ? `
            <div class="section">
              <h2 class="section-title">Professional Summary</h2>
              <p class="summary">${personalInfo.summary}</p>
            </div>
          ` : ''}

          ${experience.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Professional Experience</h2>
              ${experience.map(exp => `
                <div class="item">
                  <div class="item-header">
                    <div class="item-left">
                      <h3 class="item-title">${exp.position}</h3>
                      <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-right">
                      <div class="item-date">${exp.startDate} - ${exp.isCurrentPosition ? 'Present' : exp.endDate}</div>
                      <div class="item-location">${exp.location}</div>
                    </div>
                  </div>
                  <p class="item-description">${exp.description}</p>
                  ${exp.achievements.length > 0 ? `
                    <ul class="achievements">
                      ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${education.length > 0 ? `
            <div class="section">
              <h2 class="section-title">Education</h2>
              ${education.map(edu => `
                <div class="item">
                  <div class="item-header">
                    <div class="item-left">
                      <h3 class="item-title">${edu.degree} in ${edu.fieldOfStudy}</h3>
                      <div class="item-subtitle">${edu.institution}</div>
                    </div>
                    <div class="item-right">
                      <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
                      <div class="item-location">${edu.location}</div>
                      ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                  </div>
                  ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                  ${edu.achievements.length > 0 ? `
                    <ul class="achievements">
                      ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

        </div>
      </div>
    `;
  }

  private static generatePDFStyles(template: Template, options: ExportOptions): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      .pdf-resume {
        font-family: ${template.fonts.secondary};
        font-size: 10pt;
        line-height: 1.4;
        color: ${template.colors.text};
        background: white;
        width: 100%;
        padding: ${options.margins?.top || 20}mm ${options.margins?.right || 20}mm ${options.margins?.bottom || 20}mm ${options.margins?.left || 20}mm;
      }
      
      .pdf-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid ${template.colors.primary};
      }
      
      .profile-photo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid ${template.colors.primary};
      }
      
      .header-info {
        flex: 1;
      }
      
      .name {
        font-family: ${template.fonts.primary};
        font-size: 24pt;
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 5px;
      }
      
      .contact-info {
        font-size: 9pt;
        color: ${template.colors.secondary};
        line-height: 1.3;
      }
      
      .section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      
      .section-title {
        font-family: ${template.fonts.primary};
        font-size: 14pt;
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 8px;
        padding-bottom: 3px;
        border-bottom: 1px solid ${template.colors.accent};
      }
      
      .summary {
        text-align: justify;
        line-height: 1.5;
        margin-bottom: 10px;
      }
      
      .item {
        margin-bottom: 15px;
        page-break-inside: avoid;
      }
      
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 5px;
        gap: 10px;
      }
      
      .item-title {
        font-size: 11pt;
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 2px;
      }
      
      .item-subtitle {
        font-size: 10pt;
        color: ${template.colors.secondary};
        font-weight: 500;
      }
      
      .item-right {
        text-align: right;
        font-size: 9pt;
        color: ${template.colors.secondary};
        flex-shrink: 0;
      }
      
      .item-date {
        font-weight: bold;
        margin-bottom: 2px;
      }
      
      .item-location {
        font-style: italic;
      }
      
      .gpa {
        margin-top: 2px;
      }
      
      .item-description {
        text-align: justify;
        margin-bottom: 8px;
        line-height: 1.5;
      }
      
      .achievements {
        list-style: none;
        margin-left: 15px;
      }
      
      .achievements li {
        position: relative;
        margin-bottom: 3px;
        line-height: 1.4;
      }
      
      .achievements li:before {
        content: "•";
        color: ${template.colors.accent};
        font-weight: bold;
        position: absolute;
        left: -15px;
      }
      
      .skills-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .skill-category {
        margin-bottom: 8px;
      }
      
      .skill-category-title {
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 4px;
        font-size: 10pt;
      }
      
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      
      .skill-tag {
        background: ${template.colors.accent};
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 8pt;
        font-weight: 500;
      }
      
      .technologies {
        margin-top: 5px;
        font-size: 9pt;
        color: ${template.colors.secondary};
      }
      
      .project-link {
        margin-top: 3px;
        font-size: 9pt;
        color: ${template.colors.secondary};
      }
      
      .certification {
        margin-bottom: 8px;
        padding-left: 10px;
        border-left: 2px solid ${template.colors.accent};
      }
      
      .cert-name {
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 2px;
      }
      
      .cert-details {
        font-size: 9pt;
        color: ${template.colors.secondary};
      }
      
      .languages {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .language {
        padding: 3px 8px;
        background: rgba(0,0,0,0.05);
        border-radius: 5px;
        font-size: 9pt;
      }
      
      .reference {
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(0,0,0,0.02);
        border-radius: 5px;
      }
      
      .ref-name {
        font-weight: bold;
        color: ${template.colors.primary};
        margin-bottom: 2px;
      }
      
      .ref-title {
        color: ${template.colors.secondary};
        margin-bottom: 2px;
        font-size: 9pt;
      }
      
      .ref-contact {
        font-size: 8pt;
        color: ${template.colors.secondary};
      }
      
      /* Page break utilities */
      .page-break {
        page-break-before: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
      
      @media print {
        .pdf-resume {
          font-size: 10pt;
        }
        
        .name {
          font-size: 20pt;
        }
        
        .section-title {
          font-size: 12pt;
        }
        
        .item-title {
          font-size: 10pt;
        }
      }
    `;
  }

  private static async waitForContentLoad(container: HTMLElement): Promise<void> {
    // Wait for images to load
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue even if image fails to load
        setTimeout(resolve, 3000); // Timeout after 3 seconds
      });
    });

    await Promise.all(imagePromises);

    // Wait a bit more for fonts and layout
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private static async createPDF(container: HTMLElement, options: ExportOptions): Promise<jsPDF> {
    const canvas = await html2canvas(container, {
      scale: options.quality === 'high' ? 2 : options.quality === 'medium' ? 1.5 : 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: container.scrollWidth,
      height: container.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions based on paper size
    let pdfWidth: number, pdfHeight: number;
    
    switch (options.paperSize) {
      case 'letter':
        pdfWidth = 216; // 8.5 inches
        pdfHeight = 279; // 11 inches
        break;
      case 'legal':
        pdfWidth = 216; // 8.5 inches
        pdfHeight = 356; // 14 inches
        break;
      case 'a4':
      default:
        pdfWidth = 210; // A4 width in mm
        pdfHeight = 297; // A4 height in mm
        break;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
    });

    // Calculate image dimensions to fit the page
    const imgAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pdfWidth / pdfHeight;
    
    let imgWidth = pdfWidth;
    let imgHeight = pdfHeight;
    
    if (imgAspectRatio > pageAspectRatio) {
      // Image is wider than page ratio
      imgHeight = pdfWidth / imgAspectRatio;
    } else {
      // Image is taller than page ratio
      imgWidth = pdfHeight * imgAspectRatio;
    }

    // Center the image on the page
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    return pdf;
  }


  private static generateFilename(resumeData: ResumeData): string {
    const name = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}`;
    const date = new Date().toISOString().split('T')[0];
    return `${name}_Resume_${date}.pdf`;
  }
}

export default PDFExporter;