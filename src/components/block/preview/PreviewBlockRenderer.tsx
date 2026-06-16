import type { ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";
import { transformGuiToTailwind } from "../../../features/block-studio/blocks/html/transformGuiToTailwind";
import PasswordPreviewItem from "./PasswordPreviewItem";
import TogglePreviewItem from "./TogglePreviewItem";

interface PreviewBlockRendererProps {
  block: HtmlBlock;
}

function renderPreviewBlock(block: HtmlBlock): ReactNode {
  const classes = transformGuiToTailwind(block.styles, block.type);

  switch (block.type) {
    case "CONTAINER":
    case "GRID_ZONE":
      return (
        <div key={block.id} className={classes}>
          {block.children?.map((child) => renderPreviewBlock(child))}
        </div>
      );
    case "H1":
      return (
        <h1 key={block.id} className={classes}>
          {block.content}
        </h1>
      );
    case "P":
      return (
        <p key={block.id} className={classes}>
          {block.content}
        </p>
      );
    case "IMAGE":
      return <img key={block.id} src={block.src} alt="미리보기" className={classes} />;
    case "A":
      return (
        <a key={block.id} href={block.link || "#"} target="_blank" rel="noopener noreferrer" className={classes}>
          {block.content}
        </a>
      );
    case "PASSWORD_ZONE":
      return <PasswordPreviewItem key={block.id} block={block} renderBlock={renderPreviewBlock} className={classes} />;
    case "TOGGLE_ZONE":
      return <TogglePreviewItem key={block.id} block={block} renderBlock={renderPreviewBlock} className={classes} />;
    default:
      return null;
  }
}

export default function PreviewBlockRenderer({ block }: PreviewBlockRendererProps) {
  return renderPreviewBlock(block);
}
