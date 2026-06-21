import { useMemo, useState } from "react";
import type { HtmlBlock } from "../../../../types/types";
import { tutorialMissions } from "../data/tutorialMissions";
import { buildTutorialBaseline } from "../evaluator/buildTutorialBaseline";
import { buildTutorialTreeIndex } from "../evaluator/buildTutorialTreeIndex";
import { evaluateTutorialMissions } from "../evaluator/evaluateTutorialMissions";
import type { TutorialUiSignal, TutorialUiSignals } from "../types/tutorial.types";

const initialUiSignals: TutorialUiSignals = {
  previewOpened: false,
  codeViewOpened: false,
  templateInserted: false,
};

function mergeSets(left: ReadonlySet<string>, right: ReadonlySet<string>) {
  return new Set([...left, ...right]);
}

export function useTutorialProgress({ blocks }: { blocks: readonly HtmlBlock[] }) {
  const [baseline] = useState(() => buildTutorialBaseline(blocks));
  const tree = useMemo(() => buildTutorialTreeIndex(blocks), [blocks]);
  const [completedMissionIds, setCompletedMissionIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [skippedMissionIds, setSkippedMissionIds] = useState<ReadonlySet<string>>(() => new Set());
  const [isHidden, setIsHidden] = useState(false);
  const [uiSignals, setUiSignals] = useState<TutorialUiSignals>(initialUiSignals);
  const [successFeedbackMissionId, setSuccessFeedbackMissionId] = useState<string | null>(null);

  const satisfiedMissionIds = useMemo(
    () =>
      evaluateTutorialMissions(tutorialMissions, {
        tree,
        baseline,
        uiSignals,
      }),
    [baseline, tree, uiSignals],
  );

  const settledMissionIds = useMemo(
    () => mergeSets(completedMissionIds, skippedMissionIds),
    [completedMissionIds, skippedMissionIds],
  );
  const activeMissionBeforeEvaluation = tutorialMissions.find(
    (mission) => !settledMissionIds.has(mission.id),
  );

  const [lastEvaluatedMissionIds, setLastEvaluatedMissionIds] = useState(satisfiedMissionIds);
  if (lastEvaluatedMissionIds !== satisfiedMissionIds) {
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
  const activeMission = tutorialMissions.find((mission) => !processedMissionIds.has(mission.id));
  const successMission = tutorialMissions.find(
    (mission) => mission.id === successFeedbackMissionId,
  );
  const successMissionNumber = successMission
    ? tutorialMissions.findIndex((mission) => mission.id === successMission.id) + 1
    : undefined;

  const skipActiveMission = () => {
    if (!activeMission || successMission) return;
    setSkippedMissionIds((current) => new Set(current).add(activeMission.id));
  };

  const recordUiSignal = (signal: TutorialUiSignal) => {
    setUiSignals((current) => (current[signal] ? current : { ...current, [signal]: true }));
  };

  return {
    missions: tutorialMissions,
    activeMission,
    successMission,
    successMissionNumber,
    completedMissionIds: visibleCompletedMissionIds,
    skippedMissionIds,
    processedCount: processedMissionIds.size,
    isComplete: processedMissionIds.size === tutorialMissions.length,
    isHidden,
    hide: () => setIsHidden(true),
    show: () => setIsHidden(false),
    skipActiveMission,
    continueAfterSuccess: () => setSuccessFeedbackMissionId(null),
    recordUiSignal,
  };
}
