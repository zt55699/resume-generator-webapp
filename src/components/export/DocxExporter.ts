import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  Table,
  TableRow,
  TableCell,
  ImageRun,
} from 'docx';
import { ResumeData, Template, ExportOptions } from '../../types';
import { downloadFile } from '../../utils/fileUtils';

class DocxExporter {
  static async export(
    resumeData: ResumeData,
    template: Template,
    options: ExportOptions
  ): Promise<boolean> {
    try {
      const doc = await this.createDocument(resumeData, template, options);
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const filename = this.generateFilename(resumeData);
      downloadFile(
        blob,
        filename,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      return true;
    } catch (error) {
      console.error('DOCX export failed:', error);
      return false;
    }
  }

  private static async createDocument(
    resumeData: ResumeData,
    template: Template,
    options: ExportOptions
  ): Promise<Document> {
    const { personalInfo, experience, education } = resumeData;

    const children: any[] = [];

    // Header with name and contact info
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${personalInfo.firstName} ${personalInfo.lastName}`,
            bold: true,
            size: 32,
            font: this.getFontFamily(template.fonts.primary),
            color: this.hexToDocxColor(template.colors.primary),
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Contact information
    const contactInfo = [
      `📧 ${personalInfo.email}`,
      `📞 ${personalInfo.phone}`,
      `📍 ${personalInfo.city}, ${personalInfo.state}`,
    ];

    if (personalInfo.website) contactInfo.push(`🌐 ${personalInfo.website}`);
    if (personalInfo.linkedin) contactInfo.push(`💼 ${personalInfo.linkedin}`);
    if (personalInfo.github) contactInfo.push(`💻 ${personalInfo.github}`);

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(' | '),
            size: 20,
            color: this.hexToDocxColor(template.colors.secondary),
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );

    // Add a line separator
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '' })],
        border: {
          bottom: {
            color: this.hexToDocxColor(template.colors.primary),
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 300 },
      })
    );

    // Professional Summary
    if (personalInfo.summary) {
      children.push(
        ...this.createSection(
          'Professional Summary',
          [
            new Paragraph({
              children: [
                new TextRun({
                  text: personalInfo.summary,
                  size: 22,
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED,
            }),
          ],
          template
        )
      );
    }

    // Professional Experience
    if (experience.length > 0) {
      const experienceContent: any[] = [];

      experience.forEach((exp, index) => {
        // Job title and company
        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 24,
                color: this.hexToDocxColor(template.colors.primary),
              }),
            ],
            spacing: { before: index > 0 ? 200 : 0, after: 100 },
          })
        );

        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company} | ${exp.location}`,
                italics: true,
                size: 20,
                color: this.hexToDocxColor(template.colors.secondary),
              }),
              new TextRun({
                text: ` | ${exp.startDate} - ${exp.isCurrentPosition ? 'Present' : exp.endDate}`,
                size: 20,
                color: this.hexToDocxColor(template.colors.secondary),
              }),
            ],
            spacing: { after: 100 },
          })
        );

        // Description
        experienceContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 22,
              }),
            ],
            spacing: { after: exp.achievements.length > 0 ? 100 : 200 },
          })
        );

        // Achievements
        if (exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            experienceContent.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 360 },
              })
            );
          });
        }
      });

      children.push(
        ...this.createSection(
          'Professional Experience',
          experienceContent,
          template
        )
      );
    }

    // Education
    if (education.length > 0) {
      const educationContent: any[] = [];

      education.forEach((edu, index) => {
        educationContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree} in ${edu.fieldOfStudy}`,
                bold: true,
                size: 24,
                color: this.hexToDocxColor(template.colors.primary),
              }),
            ],
            spacing: { before: index > 0 ? 200 : 0, after: 100 },
          })
        );

        educationContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution}, ${edu.location}`,
                italics: true,
                size: 20,
                color: this.hexToDocxColor(template.colors.secondary),
              }),
              new TextRun({
                text: ` | ${edu.startDate} - ${edu.endDate}`,
                size: 20,
                color: this.hexToDocxColor(template.colors.secondary),
              }),
              ...(edu.gpa
                ? [
                    new TextRun({
                      text: ` | GPA: ${edu.gpa}`,
                      size: 20,
                      color: this.hexToDocxColor(template.colors.secondary),
                    }),
                  ]
                : []),
            ],
            spacing: {
              after: edu.description || edu.achievements.length > 0 ? 100 : 200,
            },
          })
        );

        if (edu.description) {
          educationContent.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.description,
                  size: 22,
                }),
              ],
              spacing: { after: edu.achievements.length > 0 ? 100 : 200 },
            })
          );
        }

        if (edu.achievements.length > 0) {
          edu.achievements.forEach(achievement => {
            educationContent.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
                indent: { left: 360 },
              })
            );
          });
        }
      });

      children.push(
        ...this.createSection('Education', educationContent, template)
      );
    }

    return new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: (options.margins?.top || 20) * 56.7, // Convert mm to twips
                right: (options.margins?.right || 20) * 56.7,
                bottom: (options.margins?.bottom || 20) * 56.7,
                left: (options.margins?.left || 20) * 56.7,
              },
              size: {
                orientation: 'portrait',
                width:
                  options.paperSize === 'letter'
                    ? 12240
                    : options.paperSize === 'legal'
                      ? 12240
                      : 11906, // twips
                height:
                  options.paperSize === 'letter'
                    ? 15840
                    : options.paperSize === 'legal'
                      ? 20160
                      : 16838, // twips
              },
            },
          },
          children,
        },
      ],
    });
  }

  private static createSection(
    title: string,
    content: any[],
    template: Template
  ): any[] {
    return [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 28,
            font: this.getFontFamily(template.fonts.primary),
            color: this.hexToDocxColor(template.colors.primary),
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 },
        border: {
          bottom: {
            color: this.hexToDocxColor(template.colors.accent),
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
      ...content,
    ];
  }

  private static hexToDocxColor(hex: string): string {
    // Remove # if present and convert to uppercase
    return hex.replace('#', '').toUpperCase();
  }

  private static getFontFamily(fontFamily: string): string {
    // Extract the first font from the font-family string
    const firstFont = fontFamily.split(',')[0].trim();
    // Remove quotes if present
    return firstFont.replace(/['"]/g, '');
  }

  private static generateFilename(resumeData: ResumeData): string {
    const name = `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}`;
    const date = new Date().toISOString().split('T')[0];
    return `${name}_Resume_${date}.docx`;
  }
}

export default DocxExporter;
