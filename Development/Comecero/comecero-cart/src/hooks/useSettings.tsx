import { useState, useEffect, createContext, useContext } from 'react';
import SettingsService from '../SettingsService';
import { Lang, Settings } from '../types';

const langArray: Lang[] = [
  { code: "en", name: "English" },
  { code: "cs", name: "Čeština" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "es", name: "Español" },
  { code: "fi", name: "Suomalainen" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polskie" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "sv", name: "Svenska" },
  { code: "zh-CN", name: "中文" }
];

const SettingsContext = createContext<{
  settings: Settings | null;
  languages: Lang[];
  selectedLanguage: Lang;
  setSelectedLanguage: (lang: Lang) => void;
} | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [languages, setLanguages] = useState<Lang[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>(langArray[0])

  useEffect(() => {
    const getSetting = async () => {
      const fetchedSettings = await SettingsService.get();
      setSettings(fetchedSettings);
  
      if (fetchedSettings.app.enable_languages) {
        setLanguages(langArray);
      }
  
      if (!fetchedSettings.app.company_name) {
        fetchedSettings.app.company_name = fetchedSettings.account.company_name;
      }
  
      const favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('type', 'image/x-icon');
      favicon.setAttribute('href', fetchedSettings?.style?.favicon_full || 'public/vite.svg');
      document.head.appendChild(favicon);
    }    

    getSetting()
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, languages, selectedLanguage, setSelectedLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};