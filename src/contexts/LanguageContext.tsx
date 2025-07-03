import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation mappings
const translations = {
  en: {
    // Navigation & Headers
    'resume.title': 'Resume Information',
    'resume.subtitle': 'Fill out your information step by step',
    'progress.complete': 'Complete',
    'section.of': 'of',
    'section.number': 'Section',
    
    // Sections
    'section.personalInfo': 'Personal Info',
    'section.experience': 'Experience',
    'section.education': 'Education',
    'section.personalInfo.desc': 'Basic contact information',
    'section.experience.desc': 'Work history and achievements',
    'section.education.desc': 'Academic background',
    
    // Form Fields - Personal Info
    'field.firstName': 'First Name',
    'field.lastName': 'Last Name',
    'field.email': 'Email',
    'field.phone': 'Phone Number',
    'field.address': 'Address',
    'field.city': 'City',
    'field.state': 'State',
    'field.zipCode': 'ZIP Code',
    'field.country': 'Country',
    'field.website': 'Website',
    'field.linkedin': 'LinkedIn',
    'field.github': 'GitHub',
    'field.summary': 'Professional Summary',
    
    // Form Fields - Experience
    'field.company': 'Company Name',
    'field.position': 'Job Title',
    'field.startDate': 'Start Date',
    'field.endDate': 'End Date',
    'field.location': 'Location',
    'field.description': 'Job Description',
    'field.isCurrentPosition': 'This is my current position',
    
    // Form Fields - Education
    'field.institution': 'Institution Name',
    'field.degree': 'Degree',
    'field.fieldOfStudy': 'Field of Study',
    'field.gpa': 'GPA',
    
    // Placeholders
    'placeholder.firstName': 'Enter your first name',
    'placeholder.lastName': 'Enter your last name',
    'placeholder.email': 'your.email@example.com',
    'placeholder.phone': '(555) 123-4567',
    'placeholder.address': '123 Main Street',
    'placeholder.city': 'City',
    'placeholder.state': 'State',
    'placeholder.zipCode': '12345',
    'placeholder.country': 'Country',
    'placeholder.website': 'https://yourwebsite.com',
    'placeholder.linkedin': 'https://linkedin.com/in/yourprofile',
    'placeholder.github': 'https://github.com/yourusername',
    'placeholder.summary': 'Write a brief summary of your professional background and career objectives...',
    'placeholder.company': 'Enter company name',
    'placeholder.position': 'Enter your job title',
    'placeholder.location': 'City, State',
    'placeholder.description': 'Describe your role and responsibilities...',
    'placeholder.institution': 'Enter university or school name',
    'placeholder.degree': 'Bachelor of Science',
    'placeholder.fieldOfStudy': 'Computer Science',
    'placeholder.gpa': '3.5',
    
    // Buttons & Actions
    'button.save.continue': 'Save & Continue',
    'button.save.preview': 'Save & Go to Preview',
    'button.preview': 'Preview & Templates',
    'button.continue.preview': 'Continue to Preview',
    'button.my.resumes': 'My Resumes',
    
    // Status Messages
    'status.saving': 'Saving...',
    'status.saved': 'Saved',
    'status.unsaved': 'Unsaved changes',
    
    // Tips
    'tips.title': 'Pro Tips',
    'tips.personal': 'Fill out your personal info first',
    'tips.verbs': 'Use action verbs in experience descriptions',
    'tips.numbers': 'Quantify achievements with numbers',
    'tips.concise': 'Keep descriptions concise and relevant',
    'tips.save': 'Save frequently to avoid losing work',
    
    // Footer
    'footer.info': 'Resume Form • Click \'Save & Continue\' to save your changes',
    
    // Language
    'language.en': 'English',
    'language.zh': '中文',
  },
  zh: {
    // Navigation & Headers
    'resume.title': '简历信息',
    'resume.subtitle': '逐步填写您的信息',
    'progress.complete': '完成',
    'section.of': '共',
    'section.number': '第',
    
    // Sections
    'section.personalInfo': '个人信息',
    'section.experience': '工作经历',
    'section.education': '教育背景',
    'section.personalInfo.desc': '基本联系信息',
    'section.experience.desc': '工作历史和成就',
    'section.education.desc': '学术背景',
    
    // Form Fields - Personal Info
    'field.firstName': '名',
    'field.lastName': '姓',
    'field.email': '邮箱',
    'field.phone': '电话',
    'field.address': '地址',
    'field.city': '城市',
    'field.state': '省/州',
    'field.zipCode': '邮编',
    'field.country': '国家',
    'field.website': '网站',
    'field.linkedin': 'LinkedIn',
    'field.github': 'GitHub',
    'field.summary': '专业简介',
    
    // Form Fields - Experience
    'field.company': '公司名称',
    'field.position': '职位',
    'field.startDate': '开始日期',
    'field.endDate': '结束日期',
    'field.location': '地点',
    'field.description': '工作描述',
    'field.isCurrentPosition': '这是我的当前职位',
    
    // Form Fields - Education
    'field.institution': '学校名称',
    'field.degree': '学位',
    'field.fieldOfStudy': '专业',
    'field.gpa': 'GPA',
    
    // Placeholders
    'placeholder.firstName': '输入您的名字',
    'placeholder.lastName': '输入您的姓氏',
    'placeholder.email': '您的邮箱@example.com',
    'placeholder.phone': '(555) 123-4567',
    'placeholder.address': '主街123号',
    'placeholder.city': '城市',
    'placeholder.state': '省/州',
    'placeholder.zipCode': '12345',
    'placeholder.country': '国家',
    'placeholder.website': 'https://您的网站.com',
    'placeholder.linkedin': 'https://linkedin.com/in/您的档案',
    'placeholder.github': 'https://github.com/您的用户名',
    'placeholder.summary': '写一个简短的专业背景和职业目标总结...',
    'placeholder.company': '输入公司名称',
    'placeholder.position': '输入您的职位',
    'placeholder.location': '城市, 省/州',
    'placeholder.description': '描述您的角色和职责...',
    'placeholder.institution': '输入大学或学校名称',
    'placeholder.degree': '理学学士',
    'placeholder.fieldOfStudy': '计算机科学',
    'placeholder.gpa': '3.5',
    
    // Buttons & Actions
    'button.save.continue': '保存并继续',
    'button.save.preview': '保存并预览',
    'button.preview': '预览和模板',
    'button.continue.preview': '继续预览',
    'button.my.resumes': '我的简历',
    
    // Status Messages
    'status.saving': '保存中...',
    'status.saved': '已保存',
    'status.unsaved': '未保存的更改',
    
    // Tips
    'tips.title': '专业提示',
    'tips.personal': '首先填写您的个人信息',
    'tips.verbs': '在经验描述中使用动作动词',
    'tips.numbers': '用数字量化成就',
    'tips.concise': '保持描述简洁相关',
    'tips.save': '经常保存以避免丢失工作',
    
    // Footer
    'footer.info': '简历表单 • 点击"保存并继续"保存您的更改',
    
    // Language
    'language.en': 'English',
    'language.zh': '中文',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load language from localStorage or default to Chinese
    const saved = localStorage.getItem('resume-language');
    return (saved as Language) || 'zh';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('resume-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};