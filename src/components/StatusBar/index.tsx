interface StatusBarProps {
  lineCount: number;
  wordCount: number;
  encoding: string;
  themeName: string;
}

export default function StatusBar({
  lineCount,
  wordCount,
  encoding,
  themeName,
}: StatusBarProps) {
  return (
    <div className="statusbar">
      <span>Lines: {lineCount}</span>
      <span>Words: {wordCount}</span>
      <span>{encoding}</span>
      <span>{themeName || 'Default'}</span>
    </div>
  );
}
