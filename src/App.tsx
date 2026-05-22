import { useState, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import StatusBar from './components/StatusBar';
import { useFile } from './hooks/useFile';
import { useTheme } from './hooks/useTheme';
import { useEditor } from './hooks/useEditor';
import { open } from '@tauri-apps/plugin-dialog';

export default function App() {
  const file = useFile();
  const theme = useTheme();
  const editor = useEditor();
  const [sidebarWidth, setSidebarWidth] = useState(200);

  const handleOpenFile = useCallback(async () => {
    const path = await open({
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
    });
    if (typeof path === 'string') {
      file.openFile(path);
      const lastSlash = path.lastIndexOf('/');
      if (lastSlash > 0) {
        const dir = path.substring(0, lastSlash);
        file.openDir(dir);
      }
    }
  }, [file.openFile, file.openDir]);

  const handleOpenFolder = useCallback(async () => {
    const dir = await open({ directory: true });
    if (typeof dir === 'string') {
      file.openDir(dir);
    }
  }, [file.openDir]);

  const handleThemeDirPick = useCallback(async () => {
    const dir = await open({ directory: true });
    if (typeof dir === 'string') {
      theme.setCustomThemeDir(dir);
    }
  }, [theme.setCustomThemeDir]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        file.saveFile();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        handleOpenFile();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        editor.toggleSourceMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [file.saveFile, handleOpenFile, editor.toggleSourceMode]);

  useEffect(() => {
    const title = file.currentFile
      ? `${file.currentFile.split('/').pop()} - Typora-Down`
      : 'Typora-Down';
    document.title = title;
  }, [file.currentFile]);

  return (
    <div className="app-layout">
      <Toolbar
        sourceMode={editor.sourceMode}
        onToggleSourceMode={editor.toggleSourceMode}
        onOpenFile={handleOpenFile}
        onOpenFolder={handleOpenFolder}
        themeList={theme.themeList}
        activeTheme={theme.activeTheme}
        onThemeChange={theme.switchTheme}
        onThemeDirPick={handleThemeDirPick}
      />
      <div className="app-body">
        {file.rootDir && (
          <Sidebar
            entries={file.dirEntries}
            onFileSelect={file.openFile}
            activeFile={file.currentFile}
            headings={editor.headings}
            onHeadingClick={() => {}}
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
          />
        )}
        <Editor
          value={file.content}
          onChange={file.onContentChange}
          sourceMode={editor.sourceMode}
        />
      </div>
      <StatusBar
        lineCount={file.lineCount}
        wordCount={file.wordCount}
        encoding="UTF-8"
        themeName={theme.activeTheme}
      />
    </div>
  );
}
