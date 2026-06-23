import PreviewBlockRenderer from "../../../../components/block/preview/PreviewBlockRenderer";
import type { TutorialTrack } from "../types/tutorial.types";

export type TutorialTrackIntroMode = "start" | "review" | "restart";

interface TutorialTrackIntroModalProps {
  track: TutorialTrack;
  mode: TutorialTrackIntroMode;
  onPrimaryAction: () => void;
  onClose: () => void;
}

const introGuidance = [
  "옆은 이 튜토리얼을 따라가면 만들 수 있는 예시입니다.",
  "문구와 이미지는 자유롭게 바꿔도 됩니다.",
  "예시와 완전히 똑같이 만들 필요는 없습니다.",
];

function getPrimaryLabel(mode: TutorialTrackIntroMode) {
  if (mode === "restart") return "다시 시작하기";
  if (mode === "review") return "미션으로 돌아가기";
  return "시작하기";
}

function getSecondaryLabel(mode: TutorialTrackIntroMode) {
  return mode === "start" ? "다른 튜토리얼 보기" : "닫기";
}

export default function TutorialTrackIntroModal({
  track,
  mode,
  onPrimaryAction,
  onClose,
}: TutorialTrackIntroModalProps) {
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-track-intro-title"
    >
      <section className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-emerald-300/30 bg-slate-950 text-slate-100 shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              {track.title}
            </p>
            <h2 id="tutorial-track-intro-title" className="mt-1 text-xl font-black text-white">
              이 튜토리얼에서 만들 것
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              {track.intro.summary}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            onClick={onClose}
            aria-label="튜토리얼 예시 닫기"
          >
            닫기
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-800 p-5 lg:border-b-0 lg:border-r">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-white">먼저 편하게 둘러보세요</h3>
                <div className="mt-2 space-y-2">
                  {introGuidance.map((text) => (
                    <p key={text} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-slate-300">
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-white">이번 튜토리얼에서 배울 내용</h3>
                <ul className="mt-2 space-y-2">
                  {track.intro.learningPoints.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm leading-relaxed text-slate-300"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-300" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-hidden bg-slate-100 p-4">
            <div className="flex h-full min-h-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
              <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[10px] font-bold text-slate-400">
                    completed_example_preview
                  </span>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-md select-none space-y-4">
                  {track.intro.previewBlocks.map((block) => (
                    <PreviewBlockRenderer key={block.id} block={block} disableLinks />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-800 px-5 py-4">
          <button
            type="button"
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-900 hover:text-white"
            onClick={onClose}
          >
            {getSecondaryLabel(mode)}
          </button>
          <button
            type="button"
            className="rounded-lg bg-emerald-400 px-4 py-2 text-xs font-black text-emerald-950 transition-colors hover:bg-emerald-300"
            onClick={onPrimaryAction}
          >
            {getPrimaryLabel(mode)}
          </button>
        </footer>
      </section>
    </div>
  );
}
