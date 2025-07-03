import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResumeData, Template } from '../../types';
import { resumeTemplates } from '../../data/templates';
import './MyResumes.css';

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

const MyResumes: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<PublishedResume[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'popular'>('all');
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const savedResumes = JSON.parse(
      localStorage.getItem('published-resumes') || '[]'
    );
    setResumes(savedResumes);
  };

  const filteredAndSortedResumes = React.useMemo(() => {
    let filtered = resumes.filter(resume => {
      const matchesSearch =
        resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.data.personalInfo.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resume.data.personalInfo.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (filterBy) {
        case 'recent':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(resume.publishedAt) > weekAgo;
        case 'popular':
          return (resume.views || 0) > 5;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'date':
        default:
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
      }
    });
  }, [resumes, searchTerm, filterBy, sortBy]);

  const handleResumeAction = async (
    action: 'view' | 'edit' | 'share' | 'export' | 'delete',
    resumeId: string
  ) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;

    switch (action) {
      case 'view':
        // Open public resume page
        window.open(resume.url, '_blank');
        // Increment view count
        updateResumeViews(resumeId);
        break;

      case 'edit':
        // Navigate back to builder with pre-filled data
        navigate(`/builder?resume=${resumeId}`);
        break;

      case 'share':
        // Copy shareable link to clipboard
        const shareUrl = `${window.location.origin}${resume.url}`;
        await navigator.clipboard.writeText(shareUrl);
        // Show success notification (you might want to add a toast system)
        alert('Resume link copied to clipboard!');
        break;

      case 'export':
        // Navigate to export page with this resume data
        navigate(`/export?resume=${resumeId}`);
        break;

      case 'delete':
        setResumeToDelete(resumeId);
        setShowDeleteModal(true);
        break;
    }
  };

  const updateResumeViews = (resumeId: string) => {
    const updatedResumes = resumes.map(resume => {
      if (resume.id === resumeId) {
        return {
          ...resume,
          views: (resume.views || 0) + 1,
          lastViewed: new Date().toISOString(),
        };
      }
      return resume;
    });
    setResumes(updatedResumes);
    localStorage.setItem('published-resumes', JSON.stringify(updatedResumes));
  };

  const confirmDelete = () => {
    if (resumeToDelete) {
      const updatedResumes = resumes.filter(r => r.id !== resumeToDelete);
      setResumes(updatedResumes);
      localStorage.setItem('published-resumes', JSON.stringify(updatedResumes));
      setShowDeleteModal(false);
      setResumeToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    const updatedResumes = resumes.filter(r => !selectedResumes.has(r.id));
    setResumes(updatedResumes);
    localStorage.setItem('published-resumes', JSON.stringify(updatedResumes));
    setSelectedResumes(new Set());
  };

  const toggleResumeSelection = (resumeId: string) => {
    const newSelection = new Set(selectedResumes);
    if (newSelection.has(resumeId)) {
      newSelection.delete(resumeId);
    } else {
      newSelection.add(resumeId);
    }
    setSelectedResumes(newSelection);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const generateResumePreview = (resume: PublishedResume) => {
    const template = resume.template;
    return (
      <div className='resume-preview-mini'>
        <div
          className='preview-header'
          style={{ background: template.colors.primary }}
        >
          <div className='preview-avatar'></div>
          <div className='preview-info'>
            <div className='preview-name'></div>
            <div className='preview-contact'></div>
          </div>
        </div>
        <div className='preview-content'>
          <div className='preview-section'>
            <div
              className='section-title'
              style={{ background: template.colors.primary }}
            ></div>
            <div className='section-lines'>
              <div
                className='content-line'
                style={{ background: template.colors.text }}
              ></div>
              <div
                className='content-line'
                style={{ background: template.colors.text }}
              ></div>
              <div
                className='content-line short'
                style={{ background: template.colors.text }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='my-resumes'>
      <div className='resumes-header'>
        <div className='header-content'>
          <div className='header-left'>
            <h1 className='page-title'>My Resumes</h1>
            <p className='page-description'>
              Manage your published resumes, track views, and share with
              potential employers.
            </p>
          </div>
          <div className='header-actions'>
            <Link to='/builder' className='create-new-btn'>
              ➕ Create New Resume
            </Link>
          </div>
        </div>
      </div>

      <div className='resumes-controls'>
        <div className='controls-left'>
          <div className='search-box'>
            <input
              type='text'
              placeholder='Search resumes...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='search-input'
            />
            <span className='search-icon'>🔍</span>
          </div>

          <div className='filter-controls'>
            <select
              value={filterBy}
              onChange={e => setFilterBy(e.target.value as any)}
              className='filter-select'
            >
              <option value='all'>All Resumes</option>
              <option value='recent'>Recent (7 days)</option>
              <option value='popular'>Popular (5+ views)</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className='sort-select'
            >
              <option value='date'>Sort by Date</option>
              <option value='title'>Sort by Title</option>
              <option value='views'>Sort by Views</option>
            </select>
          </div>
        </div>

        <div className='controls-right'>
          {selectedResumes.size > 0 && (
            <div className='bulk-actions'>
              <span className='selected-count'>
                {selectedResumes.size} selected
              </span>
              <button className='bulk-delete-btn' onClick={handleBulkDelete}>
                🗑️ Delete Selected
              </button>
            </div>
          )}

          <div className='view-toggle'>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title='Grid View'
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title='List View'
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className='resumes-content'>
        {filteredAndSortedResumes.length === 0 ? (
          <div className='empty-state'>
            {resumes.length === 0 ? (
              <>
                <div className='empty-icon'>📄</div>
                <h3 className='empty-title'>No resumes yet</h3>
                <p className='empty-description'>
                  Create your first professional resume to get started.
                </p>
                <Link to='/builder' className='empty-action'>
                  Create Your First Resume
                </Link>
              </>
            ) : (
              <>
                <div className='empty-icon'>🔍</div>
                <h3 className='empty-title'>No resumes found</h3>
                <p className='empty-description'>
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  className='empty-action'
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={`resumes-grid ${viewMode}`}>
            {filteredAndSortedResumes.map(resume => (
              <div key={resume.id} className='resume-card'>
                <div className='card-header'>
                  <input
                    type='checkbox'
                    checked={selectedResumes.has(resume.id)}
                    onChange={() => toggleResumeSelection(resume.id)}
                    className='resume-checkbox'
                  />
                  <div className='resume-status'>
                    <span className='status-badge published'>Published</span>
                  </div>
                </div>

                <div
                  className='card-preview'
                  onClick={() => handleResumeAction('view', resume.id)}
                >
                  {generateResumePreview(resume)}
                  <div className='preview-overlay'>
                    <span className='view-label'>👁️ View Resume</span>
                  </div>
                </div>

                <div className='card-content'>
                  <h3 className='resume-title'>{resume.title}</h3>

                  <div className='resume-meta'>
                    <div className='meta-item'>
                      <span className='meta-label'>Template:</span>
                      <span className='meta-value'>{resume.template.name}</span>
                    </div>
                    <div className='meta-item'>
                      <span className='meta-label'>Published:</span>
                      <span className='meta-value'>
                        {formatDate(resume.publishedAt)}
                      </span>
                    </div>
                    <div className='meta-item'>
                      <span className='meta-label'>Views:</span>
                      <span className='meta-value'>{resume.views || 0}</span>
                    </div>
                  </div>

                  <div className='card-actions'>
                    <button
                      className='action-btn primary'
                      onClick={() => handleResumeAction('view', resume.id)}
                      title='View Resume'
                    >
                      👁️
                    </button>
                    <button
                      className='action-btn secondary'
                      onClick={() => handleResumeAction('edit', resume.id)}
                      title='Edit Resume'
                    >
                      ✏️
                    </button>
                    <button
                      className='action-btn secondary'
                      onClick={() => handleResumeAction('share', resume.id)}
                      title='Share Resume'
                    >
                      🔗
                    </button>
                    <button
                      className='action-btn secondary'
                      onClick={() => handleResumeAction('export', resume.id)}
                      title='Export Resume'
                    >
                      📤
                    </button>
                    <button
                      className='action-btn danger'
                      onClick={() => handleResumeAction('delete', resume.id)}
                      title='Delete Resume'
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='resumes-stats'>
        <div className='stats-container'>
          <div className='stat'>
            <div className='stat-number'>{resumes.length}</div>
            <div className='stat-label'>Total Resumes</div>
          </div>
          <div className='stat'>
            <div className='stat-number'>
              {resumes.reduce((sum, resume) => sum + (resume.views || 0), 0)}
            </div>
            <div className='stat-label'>Total Views</div>
          </div>
          <div className='stat'>
            <div className='stat-number'>
              {
                resumes.filter(r => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(r.publishedAt) > weekAgo;
                }).length
              }
            </div>
            <div className='stat-label'>This Week</div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className='modal-overlay'
          onClick={() => setShowDeleteModal(false)}
        >
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3>Delete Resume</h3>
            </div>
            <div className='modal-body'>
              <p>
                Are you sure you want to delete this resume? This action cannot
                be undone.
              </p>
            </div>
            <div className='modal-footer'>
              <button
                className='modal-btn secondary'
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className='modal-btn danger' onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResumes;
