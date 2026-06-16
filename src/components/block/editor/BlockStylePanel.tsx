import type { HtmlBlock } from "../../../types/types";
import { getBlockDefinition } from "../../../features/block-studio/blocks/definitions";
import EditableFieldControl from "./EditableFieldControl";

interface BlockStylePanelProps {
  targetBlock: HtmlBlock;
  onUpdate: (fields: Partial<HtmlBlock>) => void;
  onDelete: () => void;
}

export default function BlockStylePanel({ targetBlock, onUpdate, onDelete }: BlockStylePanelProps) {
  const definition = getBlockDefinition(targetBlock.type);
  const checkboxFields = definition.editableFields.filter((field) => field.control === "checkbox");
  const otherFields = definition.editableFields.filter((field) => field.control !== "checkbox");

  return (
    <div className="flex flex-col gap-4 text-sm font-medium border-t border-amber-200/60 pt-1 mt-1">
      <div className="flex justify-end">
        <button className="hover:cursor-pointer bg-red-300 rounded-lg p-2" onClick={onDelete} title="삭제">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z"
              stroke="#460809"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z"
              stroke="#460809"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 6H22" stroke="#460809" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 11V16" stroke="#460809" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11V16" stroke="#460809" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="text-xs font-black text-amber-900/70 uppercase tracking-wider flex items-center gap-1">
        블록 꾸미기
      </div>

      {otherFields.map((field) => (
        <EditableFieldControl key={field.path} field={field} targetBlock={targetBlock} onUpdate={onUpdate} />
      ))}

      {checkboxFields.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-1">
          {checkboxFields.map((field) => (
            <EditableFieldControl key={field.path} field={field} targetBlock={targetBlock} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
