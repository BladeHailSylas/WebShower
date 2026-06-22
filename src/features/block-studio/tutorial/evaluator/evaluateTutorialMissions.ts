import type { TutorialEvaluationContext, TutorialMission } from "../types/tutorial.types";
import {
  hasAttributeChanged,
  hasContentChanged,
  hasStyleChanged,
} from "./tutorialPropertyComparison";

function isAdded(blockId: string, initialBlockIds: ReadonlySet<string>) {
  return !initialBlockIds.has(blockId);
}

function hasDescendantOfType(
  roots: readonly { id: string; type: string }[],
  childType: string,
  context: TutorialEvaluationContext,
): boolean {
  return roots.some(
    (block) =>
      block.type === childType ||
      hasDescendantOfType(
        context.tree.directChildrenByParentId.get(block.id) ?? [],
        childType,
        context,
      ),
  );
}

function isMissionComplete(mission: TutorialMission, context: TutorialEvaluationContext): boolean {
  const { condition } = mission;
  const { baseline } = context;

  switch (condition.type) {
    case "hasAddedBlock": {
      const candidates = condition.blockType
        ? (context.tree.blocksByType.get(condition.blockType) ?? [])
        : context.tree.blocksById.values();
      const addedCount = Array.from(candidates).filter((block) =>
        isAdded(block.id, baseline.initialBlockIds),
      ).length;
      return addedCount >= (condition.min ?? 1);
    }
    case "hasAddedNestedBlock": {
      const parents = context.tree.blocksByType.get(condition.parentType) ?? [];
      return parents.some(
        (parent) =>
          isAdded(parent.id, baseline.initialBlockIds) &&
          hasDescendantOfType(
            context.tree.directChildrenByParentId.get(parent.id) ?? [],
            condition.childType,
            context,
          ),
      );
    }
    case "hasStructure": {
      const parents = context.tree.blocksByType.get(condition.parentType) ?? [];
      return parents.some((parent) => {
        if (!isAdded(parent.id, baseline.initialBlockIds)) return false;
        const matchingChildren = (context.tree.directChildrenByParentId.get(parent.id) ?? []).filter(
          (child) => child.type === condition.directChildType,
        );
        return matchingChildren.length >= (condition.minChildren ?? 1);
      });
    }
    case "hasContentChanged":
      return (context.tree.blocksByType.get(condition.blockType) ?? []).some((block) =>
        hasContentChanged(block, baseline.initialBlockById.get(block.id)),
      );
    case "hasNestedContentChanged": {
      const parents = context.tree.blocksByType.get(condition.parentType) ?? [];
      return parents.some((parent) => {
        const children = condition.childField
          ? (parent[condition.childField] ?? [])
          : (context.tree.directChildrenByParentId.get(parent.id) ?? []);
        const hasChangedContent = (candidates: typeof children): boolean =>
          candidates.some(
            (child) =>
              (condition.childTypes.includes(child.type as "H1" | "P") &&
                hasContentChanged(child, baseline.initialBlockById.get(child.id))) ||
              hasChangedContent(context.tree.directChildrenByParentId.get(child.id) ?? []),
          );
        return hasChangedContent(children);
      });
    }
    case "hasAttributeChanged":
      return (context.tree.blocksByType.get(condition.blockType) ?? []).some((block) =>
        hasAttributeChanged(block, baseline.initialBlockById.get(block.id), condition.field),
      );
    case "hasStyleChanged":
      return (context.tree.blocksByType.get(condition.blockType) ?? []).some((block) =>
        hasStyleChanged(block, baseline.initialBlockById.get(block.id), condition.styleKey),
      );
    case "uiSignal":
      return context.uiSignals[condition.signal];
  }
}

export function evaluateTutorialMissions(
  missions: readonly TutorialMission[],
  context: TutorialEvaluationContext,
): ReadonlySet<string> {
  return new Set(
    missions.filter((mission) => isMissionComplete(mission, context)).map((mission) => mission.id),
  );
}
