import { useState } from "react";
import { learningTemplates } from "../data/learningTemplates";
import type { LearningTemplate } from "../types/learningTemplate.types";

interface LearningTemplateGalleryProps {
  onAddTemplate: (template: LearningTemplate) => void;
}

export default function LearningTemplateGallery({ onAddTemplate }: LearningTemplateGalleryProps) {
  const [statusMessage, setStatusMessage] = useState("");

  const addTemplate = (template: LearningTemplate) => {
    onAddTemplate(template);
    setStatusMessage(`‘${template.title}’의 root 블록 ${template.blocks.length}개를 추가했습니다.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs leading-relaxed text-slate-400">
        예시를 추가한 뒤 캔버스와 HTML 코드가 어떻게 연결되는지 살펴보세요.
      </p>

      {learningTemplates.map((template) => (
        <article key={template.id} className="rounded-xl border border-slate-600 bg-slate-700/70 p-4 shadow-sm">
          <h3 className="text-sm font-black text-white">{template.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{template.description}</p>
          <ul className="mt-3 space-y-1 text-[11px] leading-relaxed text-emerald-200">
            {template.learningPoints.map((point) => (
              <li key={point} className="flex gap-1.5">
                <span aria-hidden="true">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-emerald-400 active:bg-emerald-600"
            onClick={() => addTemplate(template)}
          >
            이 템플릿 추가하기
          </button>
        </article>
      ))}

      <p className="min-h-4 text-center text-[11px] font-bold text-emerald-300" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}
