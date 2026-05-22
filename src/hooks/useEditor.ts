import { useState, useCallback } from 'react';
import type { HeadingItem } from '../components/Sidebar/Outline';

export function useEditor() {
  const [sourceMode, setSourceMode] = useState(false);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  const toggleSourceMode = useCallback(() => {
    setSourceMode((prev) => !prev);
  }, []);

  return {
    sourceMode,
    toggleSourceMode,
    headings,
    setHeadings,
  };
}
