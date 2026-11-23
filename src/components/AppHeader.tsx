import { Logo } from "../shared";

interface AppHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function AppHeader({ query, onQueryChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <span className="logo">
        <Logo className="logo-svg" />
        <h1 className="logo-text">pulsea</h1>
      </span>
      <input
        type="search"
        className="search"
        placeholder="Поиск по имени или телефону"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </header>
  );
}
