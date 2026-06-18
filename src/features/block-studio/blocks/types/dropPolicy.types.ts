import type { BlockType } from "../../../../types/types";
import type { BlockChildField } from "./childField.types";

export interface DropPolicyDefinition {
  acceptsChildren?: boolean;
  childFields?: BlockChildField[];
  allowRoot?: boolean;
  allowedParentTypes?: BlockType[];
  internalOnly?: boolean;
}

export type DropTargetKind = "root" | "child-field" | "block";

export interface RootDropTarget {
  kind: "root";
}

export interface ChildFieldDropTarget {
  kind: "child-field";
  blockId: string;
  field: BlockChildField;
}

export interface BlockDropTarget {
  kind: "block";
  blockId: string;
}

export type DropTarget = RootDropTarget | ChildFieldDropTarget | BlockDropTarget;
