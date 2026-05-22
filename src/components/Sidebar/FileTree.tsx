import { useState } from 'react';
import type { DirEntry } from '../../services/ipc';

interface FileTreeProps {
  entries: DirEntry[];
  onFileSelect: (path: string) => void;
  activeFile: string | null;
}

function FileTreeItem({ entry, onFileSelect, activeFile }: {
  entry: DirEntry;
  onFileSelect: (path: string) => void;
  activeFile: string | null;
}) {
  const [expanded, setExpanded] = useState(true);

  if (!entry.is_dir && !entry.name.endsWith('.md')) {
    return null;
  }

  return (
    <div className="file-tree-item">
      <div
        className={`file-tree-row ${entry.path === activeFile ? 'active' : ''}`}
        onClick={() => entry.is_dir ? setExpanded(!expanded) : onFileSelect(entry.path)}
      >
        <span className="file-tree-icon">
          {entry.is_dir ? (expanded ? 'v' : '>') : '-'}
        </span>
        <span className="file-tree-name">{entry.name}</span>
      </div>
      {entry.is_dir && expanded && (
        <div className="file-tree-children">
          {entry.children.map((child) => (
            <FileTreeItem
              key={child.path}
              entry={child}
              onFileSelect={onFileSelect}
              activeFile={activeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ entries, onFileSelect, activeFile }: FileTreeProps) {
  return (
    <div className="file-tree">
      {entries.map((entry) => (
        <FileTreeItem
          key={entry.path}
          entry={entry}
          onFileSelect={onFileSelect}
          activeFile={activeFile}
        />
      ))}
    </div>
  );
}
