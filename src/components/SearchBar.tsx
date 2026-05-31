import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (city: string) => void;
}

export function SearchBar(props: SearchBarProps) {
  const { value, onChange, onSearch } = props;
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch(value);
  };

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        className="wx-search-input"
        placeholder={t('search.placeholder')}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={t('search.label')}
      />
      <button
        className="wx-search-btn"
        onClick={() => onSearch(value)}
        aria-label={t('search.button')}
      >
        ↗
      </button>
    </div>
  );
}
