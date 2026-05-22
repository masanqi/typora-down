import { useState, useCallback, useEffect, useRef } from 'react';
import { listThemes, loadTheme, getDefaultThemeDir } from '../services/ipc';

export function useTheme() {
  const [themeDir, setThemeDir] = useState('');
  const [themeList, setThemeList] = useState<string[]>([]);
  const [activeTheme, setActiveTheme] = useState('');
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    getDefaultThemeDir().then((dir) => {
      if (dir) {
        setThemeDir(dir);
        listThemes(dir).then(setThemeList);
      }
    });
  }, []);

  const switchTheme = useCallback(async (name: string) => {
    if (!themeDir) return;
    if (!name) {
      setActiveTheme('');
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
      return;
    }
    const css = await loadTheme(themeDir, name);
    setActiveTheme(name);

    if (styleRef.current) {
      styleRef.current.remove();
    }
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-theme', name);
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    styleRef.current = styleEl;
  }, [themeDir]);

  const setCustomThemeDir = useCallback(async (dir: string) => {
    setThemeDir(dir);
    const themes = await listThemes(dir);
    setThemeList(themes);
  }, []);

  return {
    themeList,
    activeTheme,
    switchTheme,
    setCustomThemeDir,
  };
}
