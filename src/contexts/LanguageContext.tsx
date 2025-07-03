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
    
    // HomePage
    'home.title': 'Create Professional Resumes in Minutes',
    'home.subtitle': 'Build your perfect resume with our intelligent form builder and professional templates',
    'home.cta.start': 'Start Building Now',
    'home.cta.templates': 'Browse Templates',
    'home.features.title': 'Everything You Need',
    'home.features.forms': 'Dynamic Forms',
    'home.features.forms.desc': 'Create resumes with intelligent forms that adapt to your needs',
    'home.features.templates': 'Professional Templates', 
    'home.features.templates.desc': 'Choose from 10+ carefully designed templates',
    'home.features.export': 'Multiple Export Formats',
    'home.features.export.desc': 'Export your resume to PDF, Word, or HTML',
    'home.features.wechat': 'WeChat Mini App Ready',
    'home.features.wechat.desc': 'Optimized for WeChat Mini App deployment',
    'home.features.admin': 'Admin Panel',
    'home.features.admin.desc': 'Powerful admin panel for managing configurations',
    'home.features.performance': 'Performance Optimized',
    'home.features.performance.desc': 'Built with modern React and TypeScript',
    
    // TemplateSelector
    'templates.title': 'Choose Your Template',
    'templates.subtitle': 'Select a professional template that matches your style',
    'templates.filter.all': 'All',
    'templates.preview': 'Preview',
    'templates.select': 'Select Template',
    'templates.category.traditional': 'Traditional',
    'templates.category.modern': 'Modern',
    'templates.category.creative': 'Creative',
    'templates.category.technical': 'Technical',
    'templates.category.executive': 'Executive',
    
    // MyResumes
    'myresumes.title': 'My Resumes',
    'myresumes.create': 'Create New Resume',
    'myresumes.empty': 'No resumes yet',
    'myresumes.empty.desc': 'Start creating your first professional resume',
    'myresumes.filter.all': 'All',
    'myresumes.filter.draft': 'Draft',
    'myresumes.filter.published': 'Published',
    'myresumes.actions.edit': 'Edit',
    'myresumes.actions.preview': 'Preview',
    'myresumes.actions.export': 'Export',
    'myresumes.actions.duplicate': 'Duplicate',
    'myresumes.actions.delete': 'Delete',
    'myresumes.status.draft': 'Draft',
    'myresumes.status.published': 'Published',
    'myresumes.lastupdated': 'Last updated',
    
    // ResumePreview
    'preview.title': 'Resume Preview',
    'preview.backtoform': 'Back to Form',
    'preview.templates': 'Change Template',
    'preview.publish': 'Publish Resume',
    'preview.publishing': 'Publishing...',
    'preview.published': 'Published Successfully!',
    'preview.share': 'Share Resume',
    'preview.exportas': 'Export As',
    
    // ExportPage
    'export.title': 'Export Resume',
    'export.subtitle': 'Download your resume in multiple formats',
    'export.format.pdf': 'PDF Document',
    'export.format.pdf.desc': 'Universal format, preserves formatting perfectly',
    'export.format.word': 'Word Document',
    'export.format.word.desc': 'Editable format for further customization',
    'export.format.html': 'HTML File',
    'export.format.html.desc': 'Web-ready format with embedded styling',
    'export.download': 'Download',
    'export.exporting': 'Exporting...',
    'export.success': 'Exported Successfully!',
    'export.tips.title': 'Export Tips',
    'export.tips.pdf': 'Use PDF for most job applications',
    'export.tips.word': 'Use Word if editing is required',
    'export.tips.html': 'Use HTML for online portfolios',
    'export.history': 'Export History',
    'export.history.empty': 'No exports yet',
    
    // PublicResume
    'public.title': 'Professional Resume',
    'public.loading': 'Loading Resume...',
    'public.notfound': 'Resume Not Found',
    'public.notfound.desc': 'The resume you are looking for does not exist or has been removed',
    'public.backhome': 'Back to Home',
    'public.actions.download': 'Download PDF',
    'public.actions.share': 'Share',
    'public.share.title': 'Share Resume',
    'public.share.copy': 'Copy Link',
    'public.share.copied': 'Link Copied!',
    
    // ResumeBuilder
    'builder.title': 'Resume Builder',
    'builder.progress': 'Progress',
    'builder.complete': 'Complete',
    'builder.tips': 'Pro Tips',
    'builder.section': 'Section',
    'builder.of': 'of',
    
    // Navigation
    'nav.home': 'Home',
    'nav.templates': 'Templates',
    'nav.builder': 'Builder',
    'nav.myresumes': 'My Resumes',
    'nav.export': 'Export',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
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
    
    // HomePage
    'home.title': '几分钟内创建专业简历',
    'home.subtitle': '使用我们的智能表单生成器和专业模板构建您的完美简历',
    'home.cta.start': '立即开始构建',
    'home.cta.templates': '浏览模板',
    'home.features.title': '您所需的一切',
    'home.features.forms': '动态表单',
    'home.features.forms.desc': '使用适应您需求的智能表单创建简历',
    'home.features.templates': '专业模板',
    'home.features.templates.desc': '从10多个精心设计的模板中选择',
    'home.features.export': '多种导出格式',
    'home.features.export.desc': '将您的简历导出为PDF、Word或HTML格式',
    'home.features.wechat': '微信小程序就绪',
    'home.features.wechat.desc': '针对微信小程序部署进行了优化',
    'home.features.admin': '管理面板',
    'home.features.admin.desc': '强大的管理面板用于管理配置',
    'home.features.performance': '性能优化',
    'home.features.performance.desc': '使用现代React和TypeScript构建',
    
    // TemplateSelector
    'templates.title': '选择您的模板',
    'templates.subtitle': '选择符合您风格的专业模板',
    'templates.filter.all': '全部',
    'templates.preview': '预览',
    'templates.select': '选择模板',
    'templates.category.traditional': '传统',
    'templates.category.modern': '现代',
    'templates.category.creative': '创意',
    'templates.category.technical': '技术',
    'templates.category.executive': '高管',
    
    // MyResumes
    'myresumes.title': '我的简历',
    'myresumes.create': '创建新简历',
    'myresumes.empty': '还没有简历',
    'myresumes.empty.desc': '开始创建您的第一份专业简历',
    'myresumes.filter.all': '全部',
    'myresumes.filter.draft': '草稿',
    'myresumes.filter.published': '已发布',
    'myresumes.actions.edit': '编辑',
    'myresumes.actions.preview': '预览',
    'myresumes.actions.export': '导出',
    'myresumes.actions.duplicate': '复制',
    'myresumes.actions.delete': '删除',
    'myresumes.status.draft': '草稿',
    'myresumes.status.published': '已发布',
    'myresumes.lastupdated': '最后更新',
    
    // ResumePreview
    'preview.title': '简历预览',
    'preview.backtoform': '返回表单',
    'preview.templates': '更改模板',
    'preview.publish': '发布简历',
    'preview.publishing': '发布中...',
    'preview.published': '发布成功！',
    'preview.share': '分享简历',
    'preview.exportas': '导出为',
    
    // ExportPage
    'export.title': '导出简历',
    'export.subtitle': '以多种格式下载您的简历',
    'export.format.pdf': 'PDF文档',
    'export.format.pdf.desc': '通用格式，完美保留格式',
    'export.format.word': 'Word文档',
    'export.format.word.desc': '可编辑格式，便于进一步定制',
    'export.format.html': 'HTML文件',
    'export.format.html.desc': '带有嵌入样式的网页格式',
    'export.download': '下载',
    'export.exporting': '导出中...',
    'export.success': '导出成功！',
    'export.tips.title': '导出提示',
    'export.tips.pdf': '大多数求职申请使用PDF',
    'export.tips.word': '需要编辑时使用Word',
    'export.tips.html': '在线作品集使用HTML',
    'export.history': '导出历史',
    'export.history.empty': '还没有导出记录',
    
    // PublicResume
    'public.title': '专业简历',
    'public.loading': '加载简历中...',
    'public.notfound': '未找到简历',
    'public.notfound.desc': '您要查找的简历不存在或已被删除',
    'public.backhome': '返回首页',
    'public.actions.download': '下载PDF',
    'public.actions.share': '分享',
    'public.share.title': '分享简历',
    'public.share.copy': '复制链接',
    'public.share.copied': '链接已复制！',
    
    // ResumeBuilder
    'builder.title': '简历构建器',
    'builder.progress': '进度',
    'builder.complete': '完成',
    'builder.tips': '专业提示',
    'builder.section': '部分',
    'builder.of': '共',
    
    // Navigation
    'nav.home': '首页',
    'nav.templates': '模板',
    'nav.builder': '构建器',
    'nav.myresumes': '我的简历',
    'nav.export': '导出',
    'nav.admin': '管理',
    'nav.logout': '退出',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.back': '返回',
    'common.next': '下一步',
    'common.finish': '完成',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
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