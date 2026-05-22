import { useState, useRef, useEffect } from "react";

interface ToolbarProps {
  sourceMode: boolean;
  onToggleSourceMode: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  themeList: string[];
  activeTheme: string;
  onThemeChange: (name: string) => void;
  onThemeDirPick: () => void;
  onCopyAsMarkdown: () => void;
}

export default function Toolbar({
  sourceMode,
  onToggleSourceMode,
  onOpenFile,
  onOpenFolder,
  themeList,
  activeTheme,
  onThemeChange,
  onThemeDirPick,
  onCopyAsMarkdown,
}: ToolbarProps) {
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const editMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(e.target as Node)
      ) {
        setEditMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [editMenuOpen]);

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onOpenFile} title="Open File">
          File
        </button>
        <button
          className="toolbar-btn"
          onClick={onOpenFolder}
          title="Open Folder"
        >
          Folder
        </button>
      </div>
      <div className="toolbar-group">
        <div className="toolbar-menu" ref={editMenuRef}>
          <button
            className="toolbar-btn"
            onClick={() => setEditMenuOpen((v) => !v)}
          >
            Edit
          </button>
          {editMenuOpen && (
            <div className="toolbar-dropdown">
              <button
                className="toolbar-dropdown-item"
                onClick={() => {
                  onCopyAsMarkdown();
                  setEditMenuOpen(false);
                }}
              >
                Copy as Markdown
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="toolbar-group">
        {themeList.length > 0 && (
          <select
            className="toolbar-select"
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
          >
            <option value="">Default</option>
            {themeList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
        <button
          className="toolbar-btn"
          onClick={onThemeDirPick}
          title="Import Theme Directory"
        >
          Themes Dir
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${sourceMode ? "active" : ""}`}
          onClick={onToggleSourceMode}
          title="Toggle Source Mode (Cmd+/)"
        >
          {sourceMode ? "WYSIWYG" : "Source"}
        </button>
      </div>
    </div>
  );
}
