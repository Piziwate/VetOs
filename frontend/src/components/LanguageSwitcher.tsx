import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex gap-2 justify-center mt-4">
      {languages.map((lng) => (
        <Button
          key={lng.code}
          variant={i18n.language.startsWith(lng.code) ? "default" : "outline"}
          size="sm"
          onClick={() => i18n.changeLanguage(lng.code)}
          className="w-10 h-10 p-0"
        >
          {lng.label}
        </Button>
      ))}
    </div>
  );
}
