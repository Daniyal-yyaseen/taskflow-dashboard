import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('taskflow-theme', 'light', value => ['light', 'dark'].includes(value));
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const toggleTheme = useCallback(() => setTheme(previous => previous === 'light' ? 'dark' : 'light'), [setTheme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
