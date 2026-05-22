import { useRef, useEffect } from 'react';

interface SourceModeProps {
  value: string;
  onChange: (markdown: string) => void;
}

export default function SourceMode({ value, onChange }: SourceModeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      className="source-mode-textarea"
      defaultValue={value}
      onChange={handleChange}
      spellCheck={false}
    />
  );
}
