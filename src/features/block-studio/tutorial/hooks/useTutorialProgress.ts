import { useMemo, useState } from "react";
import type { HtmlBlock } from "../../../../types/types";
import { buildTutorialBaseline } from "../evaluator/buildTutorialBaseline";
import { buildTutorialTreeIndex } from "../evaluator/buildTutorialTreeIndex";
import { evaluateTutorialMissions } from "../evaluator/evaluateTutorialMissions";
import type {
  TutorialMission,
  TutorialUiSignal,
  TutorialUiSignals,
} from "../types/tutorial.types";

const initialUiSignals: TutorialUiSignals = {
  previewOpened: false,
  codeViewOpened: false,
  templateInserted: false,
};
const noMissions: readonly TutorialMission[] = [];

function mergeSets(left: ReadonlySet<string>, right: ReadonlySet<string>) {
  return new Set([...left, ...right]);
}

interface UseTutorialProgressOptions {
  blocks: readonly HtmlBlock[];
  missions: readonly TutorialMission[];
  sessionKey: string | null;
  enabled: boolean;
}

export function useTutorialProgress({
  blocks,
  missions,
  sessionKey,
  enabled,
}: UseTutorialProgressOptions) {
  const [activeSessionKey, setActiveSessionKey] = useState(sessionKey);
  const [baseline, setBaseline] = useState(() => buildTutorialBaseline(blocks));
  const tree = useMemo(() => buildTutorialTreeIndex(blocks), [blocks]);
  const [completedMissionIds, setCompletedMissionIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [skippedMissionIds, setSkippedMissionIds] = useState<ReadonlySet<string>>(() => new Set());
  const [isHidden, setIsHidden] = useState(false);
  const [uiSignals, setUiSignals] = useState<TutorialUiSignals>(initialUiSignals);
  const [successFeedbackMissionId, setSuccessFeedbackMissionId] = useState<string | null>(null);

  const evaluatedMissions = enabled ? missions : noMissions;

  const satisfiedMissionIds = useMemo(
    () =>
      evaluateTutorialMissions(evaluatedMissions, {
        tree,
        baseline,
        uiSignals,
      }),
    [baseline, evaluatedMissions, tree, uiSignals],
  );

  const settledMissionIds = useMemo(
    () => mergeSets(completedMissionIds, skippedMissionIds),
    [completedMissionIds, skippedMissionIds],
  );
  const activeMissionBeforeEvaluation = evaluatedMissions.find(
    (mission) => !settledMissionIds.has(mission.id),
  );

  const [lastEvaluatedMissionIds, setLastEvaluatedMissionIds] = useState(satisfiedMissionIds);
  if (activeSessionKey !== sessionKey) {
    setActiveSessionKey(sessionKey);
    setBaseline(buildTutorialBaseline(blocks));
    setCompletedMissionIds(new Set());
    setSkippedMissionIds(new Set());
    setIsHidden(false);
    setUiSignals(initialUiSignals);
    setSuccessFeedbackMissionId(null);
    setLastEvaluatedMissionIds(new Set());
  } else if (lastEvaluatedMissionIds !== satisfiedMissionIds) {
    setLastEvaluatedMissionIds(satisfiedMissionIds);
    if (
      successFeedbackMissionId === null &&
      activeMissionBeforeEvaluation &&
      !completedMissionIds.has(activeMissionBeforeEvaluation.id) &&
      satisfiedMissionIds.has(activeMissionBeforeEvaluation.id)
    ) {
      setSuccessFeedbackMissionId(activeMissionBeforeEvaluation.id);
    }
    setCompletedMissionIds((current) => {
      const hasNewCompletion = [...satisfiedMissionIds].some((missionId) => !current.has(missionId));
      return hasNewCompletion ? mergeSets(current, satisfiedMissionIds) : current;
    });
  }

  const visibleCompletedMissionIds = useMemo(
    () => mergeSets(completedMissionIds, satisfiedMissionIds),
    [completedMissionIds, satisfiedMissionIds],
  );
  const processedMissionIds = useMemo(
    () => mergeSets(visibleCompletedMissionIds, skippedMissionIds),
    [skippedMissionIds, visibleCompletedMissionIds],
  );
  const activeMission = evaluatedMissions.find((mission) => !processedMissionIds.has(mission.id));
  const successMission = evaluatedMissions.find(
    (mission) => mission.id === successFeedbackMissionId,
  );
  const successMissionNumber = successMission
    ? evaluatedMissions.findIndex((mission) => mission.id === successMission.id) + 1
    : undefined;

  const skipActiveMission = () => {
    if (!activeMission || successMission) return;
    setSkippedMissionIds((current) => new Set(current).add(activeMission.id));
  };

  const recordUiSignal = (signal: TutorialUiSignal) => {
    if (!enabled) return;
    setUiSignals((current) => (current[signal] ? current : { ...current, [signal]: true }));
  };

  return {
    missions: evaluatedMissions,
    activeMission,
    successMission,
    successMissionNumber,
    completedMissionIds: visibleCompletedMissionIds,
    skippedMissionIds,
    processedCount: processedMissionIds.size,
    isComplete:
      enabled && evaluatedMissions.length > 0 && processedMissionIds.size === evaluatedMissions.length,
    isHidden,
    hide: () => setIsHidden(true),
    show: () => setIsHidden(false),
    skipActiveMission,
    continueAfterSuccess: () => setSuccessFeedbackMissionId(null),
    recordUiSignal,
  };
}
