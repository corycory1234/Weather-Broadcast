import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  language: string;
  onToggle: () => void;
}

export function LanguageToggle(props: LanguageToggleProps) {
  const { onToggle } = props;
  const { t } = useTranslation();

  return (
    <button
      onClick={onToggle}
      className="px-3 py-1 rounded-full font-body font-bold cursor-pointer border border-wx text-wx-muted hover:text-wx-accent transition-colors duration-200 tracking-widest shrink-0"
      style={{ fontSize: '0.65rem' }}
      aria-label="Toggle language"
    >
      {t('ui.langToggle')}
    </button>
  );
}
