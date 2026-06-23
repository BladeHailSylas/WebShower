import type { BlockType, HtmlBlock, StyleProps } from "../../../../types/types";
import type { BlockChildField } from "../../blocks/types/childField.types";

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
  correctAnswer?: string;
  styles: { [Key in TutorialTrackedStyleKey]?: StyleProps[Key] };
};

export interface TutorialBaseline {
  initialBlockIds: ReadonlySet<string>;
  initialBlockById: ReadonlyMap<string, TutorialPropertySnapshot>;
}

export type TutorialCondition =
  | { type: "hasAddedBlock"; blockType?: BlockType; min?: number }
  | { type: "hasAddedNestedBlock"; parentType: BlockType; childType: BlockType }
  | { type: "hasContainerNamed"; containerName: string }
  | {
      type: "hasNestedBlockInNamedContainer";
      containerName: string;
      childType: BlockType;
    }
  | {
      type: "hasStructure";
      parentType: BlockType;
      directChildType: BlockType;
      minChildren?: number;
    }
  | { type: "hasContentChanged"; blockType: "H1" | "P" | "A" }
  | {
      type: "hasNestedContentChanged";
      parentType: BlockType;
      childTypes: readonly ("H1" | "P")[];
      childField?: BlockChildField;
    }
  | { type: "hasAttributeChanged"; blockType: "IMAGE"; field: "src" }
  | { type: "hasAttributeChanged"; blockType: "A"; field: "link" }
  | {
      type: "hasAttributeChanged";
      blockType: "PASSWORD_ZONE";
      field: "correctAnswer";
    }
  | { type: "hasStyleChanged"; blockType: BlockType; styleKey: TutorialTrackedStyleKey }
  | {
      type: "hasStyleChangedInNamedContainer";
      containerName: string;
      styleKey: TutorialTrackedStyleKey;
    }
  | { type: "uiSignal"; signal: TutorialUiSignal };

export interface TutorialMission {
  id: string;
  title: string;
  description: string;
  condition: TutorialCondition;
  comment?: string;
  commentOnSuccess?: string;
  commentOnIncomplete?: string;
  instantSuccess?: boolean;
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
