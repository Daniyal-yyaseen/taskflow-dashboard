import { useTheme } from '../../context/ThemeContext';
import Icon from './Icon';
export default function ThemeToggle({ onLog }) {
  const { theme, toggleTheme } = useTheme();
  return <button className="theme-toggle" onClick={() => { toggleTheme(); onLog(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'theme'); }}><Icon name={theme === 'light' ? 'moon' : 'sun'} /><span>{theme === 'light' ? 'Dark' : 'Light'} mode</span><span className="key-hint">◐</span></button>;
}
