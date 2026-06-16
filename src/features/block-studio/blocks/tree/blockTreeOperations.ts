import type { HtmlBlock } from "../../../../types/types";
import type { BlockChildField } from "../types/childField.types";
import { getExistingChildFields, setChildBlocks } from "./blockChildFields";

export function findBlockById(nodes: HtmlBlock[], targetId: string): HtmlBlock | undefined {
  for (const node of nodes) {
    if (node.id === targetId) return node;

    for (const field of getExistingChildFields(node)) {
      const found = findBlockById(node[field] ?? [], targetId);
      if (found) return found;
    }
  }

  return undefined;
}

export function updateBlockById(
  nodes: HtmlBlock[],
  targetId: string,
  updater: (block: HtmlBlock) => HtmlBlock,
): HtmlBlock[] {
  return nodes.map((node) => {
    if (node.id === targetId) return updater(node);

    return getExistingChildFields(node).reduce<HtmlBlock>((nextNode, field) => {
      const children = nextNode[field];
      return children ? setChildBlocks(nextNode, field, updateBlockById(children, targetId, updater)) : nextNode;
    }, node);
  });
}

export function removeBlockById(nodes: HtmlBlock[], targetId: string): HtmlBlock[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) =>
      getExistingChildFields(node).reduce<HtmlBlock>((nextNode, field) => {
        const children = nextNode[field];
        return children ? setChildBlocks(nextNode, field, removeBlockById(children, targetId)) : nextNode;
      }, node),
    );
}

export function replaceBlockById(
  nodes: HtmlBlock[],
  targetId: string,
  replacement: HtmlBlock,
): HtmlBlock[] {
  return nodes.map((node) => {
    if (node.id === targetId) return replacement;

    return getExistingChildFields(node).reduce<HtmlBlock>((nextNode, field) => {
      const children = nextNode[field];
      return children ? setChildBlocks(nextNode, field, replaceBlockById(children, targetId, replacement)) : nextNode;
    }, node);
  });
}

export function insertBlockIntoChildField(
  nodes: HtmlBlock[],
  parentId: string,
  field: BlockChildField,
  block: HtmlBlock,
): HtmlBlock[] {
  return updateBlockById(nodes, parentId, (node) =>
    setChildBlocks(node, field, [...(node[field] ?? []), block]),
  );
}

export function insertBlockBeforeTarget(
  nodes: HtmlBlock[],
  targetId: string,
  block: HtmlBlock,
): HtmlBlock[] {
  const targetIndex = nodes.findIndex((node) => node.id === targetId);
  if (targetIndex >= 0) {
    const nextNodes = [...nodes];
    nextNodes.splice(targetIndex, 0, block);
    return nextNodes;
  }

  return nodes.map((node) =>
    getExistingChildFields(node).reduce<HtmlBlock>((nextNode, field) => {
      const children = nextNode[field];
      return children ? setChildBlocks(nextNode, field, insertBlockBeforeTarget(children, targetId, block)) : nextNode;
    }, node),
  );
}
