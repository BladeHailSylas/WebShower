interface EditorConnectorLineProps {
  lineStart: { x: number; y: number };
  popupPos: { x: number; y: number };
}

export default function EditorConnectorLine({ lineStart, popupPos }: EditorConnectorLineProps) {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
      <path
        d={`M ${lineStart.x} ${lineStart.y} C ${lineStart.x + 80} ${lineStart.y}, ${
          popupPos.x - 80
        } ${popupPos.y + 30}, ${popupPos.x} ${popupPos.y + 30}`}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="3"
        strokeDasharray="6 4"
        className="animate-[dash_1s_linear_infinite]"
      />
    </svg>
  );
}
