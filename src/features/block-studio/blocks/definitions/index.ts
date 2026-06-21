import type { BlockType } from "../../../../types/types";
import type { BlockDefinition } from "../types/blockDefinition.types";
import { cardDefinition } from "./card.definition";
import { containerDefinition } from "./container.definition";
import { gridZoneDefinition } from "./gridZone.definition";
import { headingDefinition } from "./heading.definition";
import { hrDefinition } from "./hr.definition";
import { imageDefinition } from "./image.definition";
import { linkDefinition } from "./link.definition";
import { listDefinition } from "./list.definition";
import { listItemDefinition } from "./listItem.definition";
import { paragraphDefinition } from "./paragraph.definition";
import { passwordZoneDefinition } from "./passwordZone.definition";
import { slideItemDefinition } from "./slideItem.definition";
import { sliderZoneDefinition } from "./sliderZone.definition";
import { spacerDefinition } from "./spacer.definition";
import { toggleZoneDefinition } from "./toggleZone.definition";

export const blockDefinitions = {
  CONTAINER: containerDefinition,
  CARD: cardDefinition,
  LIST: listDefinition,
  LIST_ITEM: listItemDefinition,
  SLIDER_ZONE: sliderZoneDefinition,
  SLIDE_ITEM: slideItemDefinition,
  GRID_ZONE: gridZoneDefinition,
  H1: headingDefinition,
  P: paragraphDefinition,
  IMAGE: imageDefinition,
  HR: hrDefinition,
  TOGGLE_ZONE: toggleZoneDefinition,
  PASSWORD_ZONE: passwordZoneDefinition,
  A: linkDefinition,
  SPACER: spacerDefinition,
} satisfies Record<BlockType, BlockDefinition>;

export const blockDefinitionList: BlockDefinition[] = Object.values(blockDefinitions).sort(
  (a, b) => a.palette.order - b.palette.order,
);

export const visiblePaletteDefinitions = blockDefinitionList.filter(
  (definition) => !definition.internal && !definition.palette.hidden,
);

export function getBlockDefinition(type: BlockType): BlockDefinition {
  return blockDefinitions[type];
}
