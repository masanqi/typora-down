import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import FileTree from './FileTree';
import type { HeadingItem } from './Outline';
import Outline from './Outline';
import type { DirEntry } from '../../services/ipc';

type SidebarTab = 'files' | 'outline';

interface SidebarProps {
  entries: DirEntry[];
  onFileSelect: (path: string) => void;
  activeFile: string | null;
  headings: HeadingItem[];
  onHeadingClick: (id: string) => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export default function Sidebar({
  entries,
  onFileSelect,
  activeFile,
  headings,
  onHeadingClick,
  width,
  onWidthChange,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('files');
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    setResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(120, Math.min(400, startWidth + delta));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="sidebar" style={{ width }}>
      <div className="sidebar-icon-bar">
        <button
          className={`sidebar-icon ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
          title="Files"
        >
          F
        </button>
        <button
          className={`sidebar-icon ${activeTab === 'outline' ? 'active' : ''}`}
          onClick={() => setActiveTab('outline')}
          title="Outline"
        >
          O
        </button>
      </div>
      <div className="sidebar-panel">
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Files
          </button>
          <button
            className={`sidebar-tab ${activeTab === 'outline' ? 'active' : ''}`}
            onClick={() => setActiveTab('outline')}
          >
            Outline
          </button>
        </div>
        <div className="sidebar-content">
          {activeTab === 'files' ? (
            <FileTree entries={entries} onFileSelect={onFileSelect} activeFile={activeFile} />
          ) : (
            <Outline headings={headings} onHeadingClick={onHeadingClick} />
          )}
        </div>
      </div>
      <div
        className={`sidebar-resizer ${resizing ? 'active' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
