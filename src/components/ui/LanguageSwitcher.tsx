
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguagesIcon } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Language type definition
export type Language = 'en' | 'ar';

// Language provider props
interface LanguageSwitcherProps {
  onLanguageChange?: (language: Language) => void;
}

const LanguageSwitcher = ({ onLanguageChange }: LanguageSwitcherProps) => {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    // Get stored language preference or default to English
    const storedLang = localStorage.getItem('language') as Language || 'en';
    setCurrentLang(storedLang);
    
    // Apply RTL direction for Arabic
    if (storedLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, []);

  const changeLanguage = (language: Language) => {
    localStorage.setItem('language', language);
    setCurrentLang(language);
    
    // Apply RTL direction for Arabic
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
    
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <LanguagesIcon className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLang === 'en' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={currentLang === 'ar' ? 'bg-accent' : ''}
        >
          <span className="mr-2">🇸🇦</span>
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
