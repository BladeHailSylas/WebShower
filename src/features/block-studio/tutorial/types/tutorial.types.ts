import type { BlockType, HtmlBlock, StyleProps } from "../../../../types/types";

export type TutorialUiSignal = "previewOpened" | "codeViewOpened" | "templateInserted";

export type TutorialTrackedStyleKey =
  | "bgColor"
  | "textColor"
  | "paddingSize"
  | "marginSize"
  | "borderColor"
  | "borderWidth"
  | "shadow"
  | "sliderHeight";

export type TutorialPropertySnapshot = {
  content?: string;
  src?: string;
  link?: string;
  styles: { [Key in TutorialTrackedStyleKey]?: StyleProps[Key] };
};

export interface TutorialBaseline {
  initialBlockIds: ReadonlySet<string>;
  initialBlockById: ReadonlyMap<string, TutorialPropertySnapshot>;
}

export type TutorialCondition =
  | { type: "hasAddedBlock"; blockType?: BlockType; min?: number }
  | { type: "hasAddedNestedBlock"; parentType: BlockType; childType: BlockType }
  | {
      type: "hasStructure";
      parentType: BlockType;
      directChildType: BlockType;
      minChildren?: number;
    }
  | { type: "hasContentChanged"; blockType: "H1" | "P" | "A" }
  | { type: "hasAttributeChanged"; blockType: "IMAGE"; field: "src" }
  | { type: "hasAttributeChanged"; blockType: "A"; field: "link" }
  | { type: "hasStyleChanged"; blockType: BlockType; styleKey: TutorialTrackedStyleKey }
  | { type: "uiSignal"; signal: TutorialUiSignal };

export interface TutorialMission {
  id: string;
  title: string;
  description: string;
  condition: TutorialCondition;
  comment?: string;
  commentOnSuccess?: string;
}

export interface TutorialTrack {
  id: string;
  title: string;
  description: string;
  missions: readonly TutorialMission[];
}

export type TutorialModeState =
  | { status: "selecting" }
  | { status: "active"; trackId: string }
  | { status: "completed"; trackId: string };

export type TutorialUiSignals = Record<TutorialUiSignal, boolean>;

export interface TutorialTreeIndex {
  blocksById: ReadonlyMap<string, HtmlBlock>;
  blocksByType: ReadonlyMap<BlockType, readonly HtmlBlock[]>;
  directChildrenByParentId: ReadonlyMap<string, readonly HtmlBlock[]>;
}

export interface TutorialEvaluationContext {
  tree: TutorialTreeIndex;
  baseline: TutorialBaseline;
  uiSignals: Readonly<TutorialUiSignals>;
}
