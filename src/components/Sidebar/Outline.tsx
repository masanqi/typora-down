export interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

interface OutlineProps {
  headings: HeadingItem[];
  onHeadingClick: (id: string) => void;
}

export default function Outline({ headings, onHeadingClick }: OutlineProps) {
  return (
    <div className="outline">
      {headings.length === 0 && (
        <div className="outline-empty">No headings</div>
      )}
      {headings.map((h) => (
        <div
          key={h.id}
          className="outline-item"
          style={{ paddingLeft: (h.level - 1) * 12 }}
          onClick={() => onHeadingClick(h.id)}
        >
          {h.text}
        </div>
      ))}
    </div>
  );
}
