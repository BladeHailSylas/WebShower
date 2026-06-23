import type { HtmlBlock, StyleProps } from "../../../types/types";
import type {
  EditableFieldDefinition,
  EditableFieldPath,
} from "../../../features/block-studio/blocks/types/editableField.types";

interface EditableFieldControlProps {
  field: EditableFieldDefinition;
  targetBlock: HtmlBlock;
  onUpdate: (fields: Partial<HtmlBlock>) => void;
}

type HtmlEditableFieldPath = Exclude<EditableFieldPath, `styles.${keyof StyleProps}`>;

function getFieldValue(block: HtmlBlock, path: EditableFieldDefinition["path"]) {
  if (path.startsWith("styles.")) {
    const styleKey = path.replace("styles.", "") as keyof StyleProps;
    return block.styles?.[styleKey];
  }

  return block[path as HtmlEditableFieldPath];
}

function coerceValue(field: EditableFieldDefinition, value: string | boolean): string | number | boolean {
  if (field.control === "checkbox") return Boolean(value);

  const matchedOption = field.options?.find((option) => String(option.value) === String(value));
  if (typeof matchedOption?.value === "number") return Number(value);
  if (typeof matchedOption?.value === "boolean") return value === "true";

  return String(value);
}

function updatePath(
  block: HtmlBlock,
  field: EditableFieldDefinition,
  rawValue: string | boolean,
): Partial<HtmlBlock> {
  const value = coerceValue(field, rawValue);

  if (field.path.startsWith("styles.")) {
    const styleKey = field.path.replace("styles.", "") as keyof StyleProps;
    return {
      styles: {
        ...block.styles,
        [styleKey]: value,
      },
    };
  }

  return { [field.path as HtmlEditableFieldPath]: value };
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

export default function EditableFieldControl({ field, targetBlock, onUpdate }: EditableFieldControlProps) {
  const value = getFieldValue(targetBlock, field.path) ?? field.defaultValue ?? "";

  if (field.control === "checkbox") {
    return (
      <label className="flex items-center gap-2 bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onUpdate(updatePath(targetBlock, field, event.target.checked))}
          className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
        />
        <span className="text-xs font-bold text-slate-700">{field.label}</span>
      </label>
    );
  }

  if (field.control === "select") {
    const isGridField = field.path === "styles.gridCols";

    return (
      <label
        className={`flex items-center justify-between gap-2 ${
          isGridField ? "bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 mt-1" : ""
        }`}
      >
        <span className={`text-xs font-bold ${isGridField ? "text-indigo-950" : "text-slate-600"}`}>
          {field.label}
        </span>
        <select
          value={String(value)}
          onChange={(event) => onUpdate(updatePath(targetBlock, field, event.target.value))}
          className={`bg-white border rounded-lg px-2 py-1.5 text-xs outline-none cursor-pointer ${
            isGridField
              ? "border-indigo-300 font-bold text-indigo-900 hover:border-indigo-400"
              : "border-amber-300 text-slate-700 focus:ring-2 ring-amber-400"
          }`}
        >
          {field.options?.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.control === "color") {
    const colorValue = isHexColor(value) ? value : "#000000";
    const hasCustomColor = isHexColor(value);

    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-600 font-bold">{field.label}</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorValue}
            onChange={(event) => onUpdate(updatePath(targetBlock, field, event.target.value))}
            className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-amber-300 bg-white p-1"
          />
          <span className="min-w-20 flex-1 rounded-lg border border-amber-200 bg-amber-50/60 px-2 py-1.5 font-mono text-xs text-slate-700">
            {hasCustomColor ? value : "기본값"}
          </span>
          <button
            type="button"
            onClick={() => onUpdate(updatePath(targetBlock, field, ""))}
            disabled={!hasCustomColor}
            className="rounded-lg border border-amber-300 px-2 py-1.5 text-xs font-bold text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            초기화
          </button>
        </div>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-600 font-bold">{field.label}</span>
      <input
        type={field.control === "url" ? "url" : "text"}
        value={String(value)}
        onChange={(event) => onUpdate(updatePath(targetBlock, field, event.target.value))}
        className="bg-white border border-amber-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:ring-2 ring-amber-400"
      />
    </label>
  );
}
