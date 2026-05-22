import { useState, useCallback, useRef } from 'react';
import { readFile, writeFile, readDir, addRecentFile } from '../services/ipc';
import type { DirEntry } from '../services/ipc';

export function useFile() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [dirEntries, setDirEntries] = useState<DirEntry[]>([]);
  const [rootDir, setRootDir] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);
  const currentFileRef = useRef(currentFile);

  // Keep refs in sync so the auto-save callback always uses latest values
  contentRef.current = content;
  currentFileRef.current = currentFile;

  const openFile = useCallback(async (path: string) => {
    const text = await readFile(path);
    setCurrentFile(path);
    setContent(text);
    await addRecentFile(path);
  }, []);

  const openDir = useCallback(async (path: string) => {
    const entries = await readDir(path);
    setDirEntries(entries);
    setRootDir(path);
  }, []);

  const saveFile = useCallback(async () => {
    if (!currentFileRef.current) return;
    await writeFile(currentFileRef.current, contentRef.current);
  }, []);

  const onContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    contentRef.current = newContent;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const file = currentFileRef.current;
      if (!file) return;
      try {
        await writeFile(file, newContent);
      } catch {
        // Auto-save failure is intentionally silent to avoid disrupting the user
      }
    }, 300);
  }, []);

  const lineCount = content.split('\n').length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return {
    currentFile,
    content,
    dirEntries,
    rootDir,
    openFile,
    openDir,
    saveFile,
    onContentChange,
    lineCount,
    wordCount,
  };
}
