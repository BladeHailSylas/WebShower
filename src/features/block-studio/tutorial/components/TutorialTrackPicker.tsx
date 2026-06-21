import type { TutorialTrack } from "../types/tutorial.types";

interface TutorialTrackPickerProps {
  tracks: readonly TutorialTrack[];
  completedTrackIds: ReadonlySet<string>;
  onStartTrack: (trackId: string) => void;
  onClose: () => void;
}

export default function TutorialTrackPicker({
  tracks,
  completedTrackIds,
  onStartTrack,
  onClose,
}: TutorialTrackPickerProps) {
  return (
    <section className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-emerald-400/30 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-sm">
      <div className="flex justify-between">
        <div>
          <h2 className="text-sm font-black text-white">무엇을 만들어 볼까요?</h2>
          <p className="mt-1 text-xs text-slate-400 @max-[420px]:hidden">
            원하는 튜토리얼을 골라 직접 블록을 조립해 보세요.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="mx-2 px-2 py-1 text-sm text-slate-300"
            onClick={onClose}
            aria-label="튜토리얼 선택 닫기"
          >
            닫기
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {tracks.map((track) => (
          <article
            key={track.id}
            className="flex min-w-64 flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-xs font-black text-white">{track.title}</h3>
                {completedTrackIds.has(track.id) && (
                  <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                    완료
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                {track.description}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg bg-emerald-400 px-3 py-2 text-[11px] font-black text-emerald-950 transition-colors hover:bg-emerald-300"
              onClick={() => onStartTrack(track.id)}
            >
              시작하기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
