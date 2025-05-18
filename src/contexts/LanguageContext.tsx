
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Language type
export type Language = 'en' | 'ar';

// Interface for the context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
}

// Basic translations - can be expanded with more translations
const translationsData = {
  en: {
    // General
    'app.name': 'AL-WAFI Quality Hub',
    'app.dashboard': 'Dashboard',
    'app.logout': 'Logout',
    
    // Modules
    'module.capa': 'CAPA Management',
    'module.nonconformance': 'Non-Conformance',
    'module.documents': 'Document Control',
    'module.products': 'Product Management',
    'module.complaints': 'Complaints',
    'module.audits': 'Audits',
    'module.changecontrol': 'Change Control',
    'module.suppliers': 'Suppliers',
    'module.risk': 'Risk Management',
    'module.training': 'Training',
    
    // Statuses
    'status.open': 'Open',
    'status.inprogress': 'In Progress',
    'status.closed': 'Closed',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.pending': 'Pending',
    
    // Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.create': 'Create',
    'action.submit': 'Submit',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
  },
  ar: {
    // General
    'app.name': 'منصة الوافي للجودة',
    'app.dashboard': 'لوحة التحكم',
    'app.logout': 'تسجيل الخروج',
    
    // Modules
    'module.capa': 'إدارة الإجراءات التصحيحية والوقائية',
    'module.nonconformance': 'عدم المطابقة',
    'module.documents': 'التحكم في الوثائق',
    'module.products': 'إدارة المنتجات',
    'module.complaints': 'الشكاوى',
    'module.audits': 'التدقيق',
    'module.changecontrol': 'ضبط التغيير',
    'module.suppliers': 'الموردين',
    'module.risk': 'إدارة المخاطر',
    'module.training': 'التدريب',
    
    // Statuses
    'status.open': 'مفتوح',
    'status.inprogress': 'قيد التنفيذ',
    'status.closed': 'مغلق',
    'status.approved': 'معتمد',
    'status.rejected': 'مرفوض',
    'status.pending': 'قيد الإنتظار',
    
    // Actions
    'action.save': 'حفظ',
    'action.cancel': 'إلغاء',
    'action.delete': 'حذف',
    'action.edit': 'تعديل',
    'action.create': 'إنشاء',
    'action.submit': 'إرسال',
    'action.approve': 'موافقة',
    'action.reject': 'رفض',
  }
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState(translationsData.en);

  useEffect(() => {
    // Get stored language preference or default to English
    const storedLang = localStorage.getItem('language') as Language || 'en';
    setLanguage(storedLang);
  }, []);

  // Function to set language and update translations
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
    setTranslations(translationsData[newLanguage]);
    
    // Set document direction
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
