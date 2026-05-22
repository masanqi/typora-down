import { useState, useEffect, useCallback, useRef } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { useFile } from "./hooks/useFile";
import { useTheme } from "./hooks/useTheme";
import { useEditor } from "./hooks/useEditor";
import { open } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

export default function App() {
  const file = useFile();
  const theme = useTheme();
  const editor = useEditor();
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenFile = useCallback(async () => {
    const path = await open({
      filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
    });
    if (typeof path === "string") {
      file.openFile(path);
      const lastSlash = path.lastIndexOf("/");
      if (lastSlash > 0) {
        const dir = path.substring(0, lastSlash);
        file.openDir(dir);
      }
    }
  }, [file.openFile, file.openDir]);

  const handleOpenFolder = useCallback(async () => {
    const dir = await open({ directory: true });
    if (typeof dir === "string") {
      file.openDir(dir);
    }
  }, [file.openDir]);

  const handleThemeDirPick = useCallback(async () => {
    const dir = await open({ directory: true });
    if (typeof dir === "string") {
      theme.setCustomThemeDir(dir);
    }
  }, [theme.setCustomThemeDir]);

  const handleCopyAsMarkdown = useCallback(async () => {
    if (!file.content) return;
    await writeText(file.content);
  }, [file.content]);

  const handleHeadingClick = useCallback((id: string) => {
    // Query the editor container for heading elements with the matching data attribute
    const container = editorContainerRef.current;
    if (!container) return;

    const headingEl = container.querySelector(`[data-heading-id="${id}"]`);
    if (headingEl) {
      headingEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const unlisten = listen<string>("menu-event", (event) => {
      const action = event.payload;
      switch (action) {
        case "new_file":
          file.openFile("");
          break;
        case "open_file":
          handleOpenFile();
          break;
        case "open_folder":
          handleOpenFolder();
          break;
        case "save_file":
          file.saveFile();
          break;
        case "save_as":
          break;
        case "copy_as_markdown":
          handleCopyAsMarkdown();
          break;
        case "source_mode":
          editor.toggleSourceMode();
          break;
        case "toggle_sidebar":
          if (file.rootDir) {
            file.openDir("");
          } else if (file.currentFile) {
            const lastSlash = file.currentFile.lastIndexOf("/");
            if (lastSlash > 0) {
              file.openDir(file.currentFile.substring(0, lastSlash));
            }
          }
          break;
        case "import_theme_dir":
          handleThemeDirPick();
          break;
        case "theme_default":
          theme.switchTheme("");
          break;
        case "about":
          break;
        default:
          if (action.startsWith("theme_")) {
            const themeName = action.slice(6).replace(/_/g, " ");
            theme.switchTheme(themeName);
          }
          break;
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [
    file,
    editor,
    theme,
    handleOpenFile,
    handleOpenFolder,
    handleThemeDirPick,
    handleCopyAsMarkdown,
  ]);

  const updateThemeMenu = useCallback(async () => {
    try {
      await invoke("update_theme_menu", {
        themes: theme.themeList,
        activeTheme: theme.activeTheme,
      });
    } catch {
      // Ignore if menu not available yet
    }
  }, [theme.themeList, theme.activeTheme]);

  useEffect(() => {
    updateThemeMenu();
  }, [updateThemeMenu]);

  useEffect(() => {
    const title = file.currentFile
      ? `${file.currentFile.split("/").pop()} - Typora-Down`
      : "Typora-Down";
    document.title = title;
  }, [file.currentFile]);

  return (
    <div className="app-layout">
      <div className="app-body">
        {file.rootDir && (
          <Sidebar
            entries={file.dirEntries}
            onFileSelect={file.openFile}
            activeFile={file.currentFile}
            headings={editor.headings}
            onHeadingClick={handleHeadingClick}
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
          />
        )}
        <div ref={editorContainerRef} className="editor-area">
          <Editor
            value={file.content}
            onChange={file.onContentChange}
            sourceMode={editor.sourceMode}
            onHeadingsChange={editor.setHeadings}
            currentFile={file.currentFile}
          />
        </div>
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
