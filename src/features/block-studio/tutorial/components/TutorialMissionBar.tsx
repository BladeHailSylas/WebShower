import type { TutorialMission } from "../types/tutorial.types";

interface TutorialMissionBarProps {
  trackTitle: string;
  mission?: TutorialMission;
  successMission?: TutorialMission;
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  incompleteMessage?: string;
  onCompleteMission: () => void;
  onSkip: () => void;
  onNextMission: () => void;
  onHide: () => void;
  onExit: () => void;
}

const defaultSuccessComment = "좋습니다! 다음 미션으로 넘어가 볼까요?";

export default function TutorialMissionBar({
  trackTitle,
  mission,
  successMission,
  processedCount,
  totalCount,
  isComplete,
  incompleteMessage,
  onCompleteMission,
  onSkip,
  onNextMission,
  onHide,
  onExit,
}: TutorialMissionBarProps) {
  const isShowingSuccess = successMission !== undefined;
  const isShowingComplete = isComplete && !isShowingSuccess;

  return (
    <section
      className={`pointer-events-auto flex w-fit max-w-[calc(100%-1rem)] min-w-0 items-center gap-3 rounded-2xl border bg-slate-950/95 px-4 py-3 text-slate-100 shadow-2xl backdrop-blur-sm transition-all ${
        isShowingSuccess ? "border-emerald-300/70 ring-2 ring-emerald-400/20" : "border-emerald-400/30"
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          isShowingSuccess || isShowingComplete
            ? "bg-emerald-400 text-emerald-950"
            : "bg-emerald-500/15 text-emerald-300"
        }`}
        aria-hidden="true"
      >
        {isShowingSuccess || isShowingComplete ? "✓" : processedCount + 1}
      </div>

      <div className="min-w-0 max-w-xl">
        <div className="flex min-w-0 items-center gap-2">
          <span className="max-w-36 truncate text-[10px] font-bold text-slate-500 @max-[520px]:hidden">
            {trackTitle}
          </span>
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
            {isShowingSuccess ? `성공 ${processedCount}/${totalCount}` : isShowingComplete ? "완료" : `진행 ${processedCount}/${totalCount}`}
          </span>
          <h2 className="truncate text-sm font-black text-white">
            {isShowingSuccess ? "잘 했어요!" : isShowingComplete ? "모든 미션 완료" : mission?.title}
          </h2>
        </div>
        {isShowingSuccess ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-emerald-100">
            {successMission.commentOnSuccess ?? defaultSuccessComment}
          </p>
        ) : (
          <div>
            <p className="mt-0.5 truncate text-sm text-slate-300 @max-[420px]:hidden">
              {isShowingComplete
                ? `${totalCount}개의 미션을 모두 처리했습니다.`
                : mission?.description}
            </p>
            {!isShowingComplete && mission?.comment && (
              <p className="text-xs text-slate-500 @max-[420px]:hidden">{mission.comment}</p>
            )}
            {!isShowingComplete && incompleteMessage && (
              <p className="mt-1 text-xs font-bold text-amber-300" role="alert">
                {incompleteMessage}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="ml-1 flex shrink-0 items-center gap-1.5">
        {isShowingSuccess ? (
          <button
            type="button"
            className="rounded-lg bg-emerald-400 px-3 py-1.5 text-[11px] font-black text-emerald-950 transition-colors hover:bg-emerald-300"
            onClick={onNextMission}
          >
            다음 미션
          </button>
        ) : !isShowingComplete ? (
          <>
            {mission?.instantSuccess === false && (
              <button
                type="button"
                className="rounded-lg bg-emerald-400 px-3 py-1.5 text-[11px] font-black text-emerald-950 transition-colors hover:bg-emerald-300"
                onClick={onCompleteMission}
              >
                완료
              </button>
            )}
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-bold text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              onClick={onSkip}
            >
              건너뛰기
            </button>
          </>
        ) : null}
        <button
          type="button"
          className="rounded-lg px-2 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          onClick={onHide}
          aria-label="튜토리얼 숨기기"
          title="튜토리얼 숨기기"
        >
          닫기
        </button>
        <button
          type="button"
          className="rounded-lg px-2 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          onClick={onExit}
        >
          나가기
        </button>
      </div>
    </section>
  );
}
