import MilkdownEditor from './MilkdownEditor';
import SourceMode from './SourceMode';

interface EditorProps {
  value: string;
  onChange: (markdown: string) => void;
  sourceMode: boolean;
}

export default function Editor({ value, onChange, sourceMode }: EditorProps) {
  return (
    <div className="editor-wrapper">
      <div className="editor-content">
        {sourceMode ? (
          <SourceMode value={value} onChange={onChange} />
        ) : (
          <MilkdownEditor value={value} onChange={onChange} />
        )}
      </div>
    </div>
  );
}
