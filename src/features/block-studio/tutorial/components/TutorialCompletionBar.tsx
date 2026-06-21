import type { TutorialTrack } from "../types/tutorial.types";

interface TutorialCompletionBarProps {
  track: TutorialTrack;
  onRestart: () => void;
  onExit: () => void;
}

export default function TutorialCompletionBar({
  track,
  onRestart,
  onExit,
}: TutorialCompletionBarProps) {
  return (
    <section
      className="pointer-events-auto flex w-fit max-w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border border-emerald-300/70 bg-slate-950/95 px-4 py-3 text-slate-100 shadow-2xl ring-2 ring-emerald-400/20 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-emerald-950">
        ✓
      </div>
      <div className="min-w-0 max-w-md">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
          튜토리얼 완료
        </span>
        <h2 className="truncate text-sm font-black text-white">{track.title}</h2>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
        <button
          type="button"
          className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={onRestart}
        >
          다시 시작
        </button>
        <button
          type="button"
          className="rounded-lg bg-emerald-400 px-3 py-1.5 text-[11px] font-black text-emerald-950 hover:bg-emerald-300"
          onClick={onExit}
        >
          선택으로 돌아가기
        </button>
      </div>
    </section>
  );
}

