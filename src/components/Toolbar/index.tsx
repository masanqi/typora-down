interface ToolbarProps {
  sourceMode: boolean;
  onToggleSourceMode: () => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
  themeList: string[];
  activeTheme: string;
  onThemeChange: (name: string) => void;
  onThemeDirPick: () => void;
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
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onOpenFile} title="Open File">
          Open
        </button>
        <button className="toolbar-btn" onClick={onOpenFolder} title="Open Folder">
          Folder
        </button>
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
        <button className="toolbar-btn" onClick={onThemeDirPick} title="Set Theme Directory">
          Themes Dir
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-btn ${sourceMode ? 'active' : ''}`}
          onClick={onToggleSourceMode}
          title="Toggle Source Mode"
        >
          {sourceMode ? 'WYSIWYG' : 'Source'}
        </button>
      </div>
    </div>
  );
}
