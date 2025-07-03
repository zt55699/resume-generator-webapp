import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResumeData, Template } from '../../types';
import ResumeRenderer from '../templates/ResumeRenderer';
import PDFExporter from '../export/PDFExporter';
import './PublicResume.css';

interface PublishedResume {
  id: string;
  data: ResumeData;
  template: Template;
  publishedAt: string;
  title: string;
  url: string;
  views?: number;
  lastViewed?: string;
}

const PublicResume: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<PublishedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  useEffect(() => {
    // Update page metadata for social sharing
    if (resume) {
      updatePageMetadata(resume);
    }
  }, [resume]);

  const loadResume = async (resumeId: string) => {
    try {
      setLoading(true);

      // Load from localStorage (in a real app, this would be an API call)
      const savedResumes = JSON.parse(
        localStorage.getItem('published-resumes') || '[]'
      );
      const foundResume = savedResumes.find(
        (r: PublishedResume) => r.id === resumeId
      );

      if (foundResume) {
        setResume(foundResume);

        // Increment view count
        const updatedResumes = savedResumes.map((r: PublishedResume) => {
          if (r.id === resumeId) {
            return {
              ...r,
              views: (r.views || 0) + 1,
              lastViewed: new Date().toISOString(),
            };
          }
          return r;
        });

        localStorage.setItem(
          'published-resumes',
          JSON.stringify(updatedResumes)
        );
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const updatePageMetadata = (resume: PublishedResume) => {
    const { firstName, lastName } = resume.data.personalInfo;
    const title = `${firstName} ${lastName} - Professional Resume`;
    const description =
      resume.data.personalInfo.summary ||
      `Professional resume for ${firstName} ${lastName}. View work experience, education, skills, and contact information.`;
    const imageUrl = resume.data.personalInfo.profilePhoto || '';

    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', 'profile');
    updateMetaTag('og:url', window.location.href);

    if (imageUrl) {
      updateMetaTag('og:image', imageUrl);
    }

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);

    if (imageUrl) {
      updateMetaTag('twitter:image', imageUrl);
    }

    // LinkedIn specific
    updateMetaTag('linkedin:owner', `${firstName} ${lastName}`);
  };

  const updateMetaTag = (property: string, content: string) => {
    let element = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement;
    if (!element) {
      element = document.querySelector(
        `meta[name="${property}"]`
      ) as HTMLMetaElement;
    }
    if (!element) {
      element = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('linkedin:')) {
        element.setAttribute('property', property);
      } else {
        element.setAttribute('name', property);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const handleExportPDF = async () => {
    if (!resume) return;

    setIsExporting(true);
    try {
      const exportOptions = {
        format: 'pdf' as const,
        template: resume.template.id,
        quality: 'high' as const,
        paperSize: 'a4' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        includeProfilePhoto: true,
        includePortfolioImages: true,
        includePortfolioVideos: false,
      };

      await PDFExporter.export(resume.data, resume.template, exportOptions);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (
    platform: 'copy' | 'linkedin' | 'twitter' | 'email'
  ) => {
    const url = window.location.href;
    const title = resume
      ? `${resume.data.personalInfo.firstName} ${resume.data.personalInfo.lastName} - Professional Resume`
      : 'Professional Resume';
    const text = resume
      ? `Check out ${resume.data.personalInfo.firstName}'s professional resume`
      : 'Check out this professional resume';

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } catch (error) {
          console.error('Failed to copy URL:', error);
        }
        break;

      case 'linkedin':
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=400');
        break;

      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;

      case 'email':
        const emailSubject = encodeURIComponent(title);
        const emailBody = encodeURIComponent(`${text}\n\n${url}`);
        window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='public-resume-loading'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <h2>Loading Resume...</h2>
          <p>Please wait while we fetch the resume.</p>
        </div>
      </div>
    );
  }

  if (notFound || !resume) {
    return (
      <div className='public-resume-error'>
        <div className='error-container'>
          <div className='error-icon'>📄</div>
          <h2>Resume Not Found</h2>
          <p>
            The resume you're looking for doesn't exist or has been removed.
          </p>
          <button className='error-action' onClick={() => navigate('/')}>
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='public-resume'>
      <div className='public-header'>
        <div className='header-content'>
          <div className='header-info'>
            <h1 className='resume-owner'>
              {resume.data.personalInfo.firstName}{' '}
              {resume.data.personalInfo.lastName}
            </h1>
            <p className='resume-subtitle'>Professional Resume</p>
            <div className='resume-meta'>
              <span className='meta-item'>
                📅 Published {formatDate(resume.publishedAt)}
              </span>
              <span className='meta-item'>👁️ {resume.views || 0} views</span>
              <span className='meta-item'>
                🎨 {resume.template.name} template
              </span>
            </div>
          </div>

          <div className='header-actions'>
            <button
              className='action-btn primary'
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className='action-spinner'></div>
                  Exporting...
                </>
              ) : (
                <>📄 Download PDF</>
              )}
            </button>

            <button className='action-btn secondary' onClick={handlePrint}>
              🖨️ Print
            </button>

            <button
              className='action-btn secondary'
              onClick={() => setShowShareModal(true)}
            >
              🔗 Share
            </button>
          </div>
        </div>
      </div>

      <div className='public-content'>
        <div className='resume-container'>
          <div className='resume-wrapper'>
            <ResumeRenderer
              resumeData={resume.data}
              template={resume.template}
            />
          </div>
        </div>
      </div>

      <div className='public-footer'>
        <div className='footer-content'>
          <div className='footer-info'>
            <p>
              This resume was created using our professional resume builder.
              Want to create your own?
            </p>
          </div>
          <div className='footer-actions'>
            <button className='footer-cta' onClick={() => navigate('/')}>
              Create Your Resume
            </button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className='modal-overlay' onClick={() => setShowShareModal(false)}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Share Resume</h3>
              <button
                className='close-modal'
                onClick={() => setShowShareModal(false)}
              >
                ✕
              </button>
            </div>

            <div className='modal-body'>
              <div className='share-url'>
                <label>Resume URL:</label>
                <div className='url-input-group'>
                  <input
                    type='text'
                    value={window.location.href}
                    readOnly
                    className='url-input'
                  />
                  <button
                    className='copy-btn'
                    onClick={() => handleShare('copy')}
                  >
                    {copySuccess ? '✅' : '📋'}
                  </button>
                </div>
                {copySuccess && (
                  <span className='copy-success'>URL copied to clipboard!</span>
                )}
              </div>

              <div className='share-platforms'>
                <h4>Share on:</h4>
                <div className='platform-buttons'>
                  <button
                    className='platform-btn linkedin'
                    onClick={() => handleShare('linkedin')}
                  >
                    <span className='platform-icon'>💼</span>
                    LinkedIn
                  </button>

                  <button
                    className='platform-btn twitter'
                    onClick={() => handleShare('twitter')}
                  >
                    <span className='platform-icon'>🐦</span>
                    Twitter
                  </button>

                  <button
                    className='platform-btn email'
                    onClick={() => handleShare('email')}
                  >
                    <span className='platform-icon'>📧</span>
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicResume;
