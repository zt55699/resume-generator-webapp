import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button 
      className={`language-switcher ${language}`}
      onClick={toggleLanguage}
      title={`Switch to ${language === 'en' ? '中文' : 'English'}`}
    >
      <span className="language-icon">🌐</span>
      <span className="language-text">
        {language === 'en' ? 'EN' : '中文'}
      </span>
      <span className="language-arrow">▼</span>
    </button>
  );
};

export default LanguageSwitcher;