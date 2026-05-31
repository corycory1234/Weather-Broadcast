import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { LogoATMOS } from './LogoATMOS';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (city: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  language: string;
  onLanguageToggle: () => void;
}

export function Header(props: HeaderProps) {
  const { searchValue, onSearchChange, onSearch, isDark, onThemeToggle, language, onLanguageToggle } = props;

  return (
    <header className="animate-fade-in-down sticky top-0 z-50 bg-wx-base border-b border-wx">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4 min-w-0">
        <LogoATMOS className="shrink-0" />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <SearchBar value={searchValue} onChange={onSearchChange} onSearch={onSearch} />
          <LanguageToggle language={language} onToggle={onLanguageToggle} />
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
}
