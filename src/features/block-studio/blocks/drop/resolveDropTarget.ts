import { CANVAS_ROOT_DROP_ID, getChildFieldDropPrefix } from "./dropTargetIds";
import type { DropTarget } from "../types/dropPolicy.types";
import type { BlockChildField } from "../types/childField.types";

const childFields: BlockChildField[] = ["children", "defaultChildren", "conditionalChildren"];

export function resolveDropTarget(overId: string): DropTarget {
  if (overId === CANVAS_ROOT_DROP_ID) return { kind: "root" };

  for (const field of childFields) {
    const prefix = getChildFieldDropPrefix(field);
    if (overId.startsWith(prefix)) {
      return {
        kind: "child-field",
        field,
        blockId: overId.slice(prefix.length),
      };
    }
  }

  return { kind: "block", blockId: overId };
}
