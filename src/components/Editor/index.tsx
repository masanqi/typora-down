import MilkdownEditor from './MilkdownEditor';
import SourceMode from './SourceMode';
import type { HeadingItem } from '../Sidebar/Outline';

interface EditorProps {
  value: string;
  onChange: (markdown: string) => void;
  sourceMode: boolean;
  onHeadingsChange: (headings: HeadingItem[]) => void;
  currentFile: string | null;
}

export default function Editor({ value, onChange, sourceMode, onHeadingsChange, currentFile }: EditorProps) {
  return (
    <div className="editor-wrapper">
      <div className="editor-content">
        {sourceMode ? (
          <SourceMode value={value} onChange={onChange} />
        ) : (
          <MilkdownEditor value={value} onChange={onChange} onHeadingsChange={onHeadingsChange} currentFile={currentFile} />
        )}
      </div>
    </div>
  );
}
