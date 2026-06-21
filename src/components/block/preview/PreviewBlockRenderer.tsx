import type { CSSProperties, ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";
import { transformGuiToTailwind } from "../../../features/block-studio/blocks/html/transformGuiToTailwind";
import PasswordPreviewItem from "./PasswordPreviewItem";
import SliderPreviewItem from "./SliderPreviewItem";
import TogglePreviewItem from "./TogglePreviewItem";

interface PreviewBlockRendererProps {
  block: HtmlBlock;
}

function getGridZoneStyle(block: HtmlBlock): CSSProperties {
  const gridCols = block.styles?.gridCols ?? 2;

  return {
    display: "grid",
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    gap: "12px",
  };
}

function renderPreviewBlock(block: HtmlBlock): ReactNode {
  const classes = transformGuiToTailwind(block.styles, block.type);

  switch (block.type) {
    case "CONTAINER":
    case "CARD":
      return (
        <div key={block.id} className={classes}>
          {block.children?.map((child) => renderPreviewBlock(child))}
        </div>
      );
    case "LIST":
      return (
        <ul key={block.id} className={classes}>
          {block.children?.map((child) => renderPreviewBlock(child))}
        </ul>
      );
    case "LIST_ITEM":
      return (
        <li key={block.id} className={classes}>
          {block.children?.map((child) => renderPreviewBlock(child))}
        </li>
      );
    case "SLIDER_ZONE":
      return <SliderPreviewItem key={block.id} block={block} renderBlock={renderPreviewBlock} className={classes} />;
    case "SLIDE_ITEM":
      return (
        <article key={block.id} className={classes}>
          {block.children?.map((child) => renderPreviewBlock(child))}
        </article>
      );
    case "GRID_ZONE":
      return (
        <div key={block.id} className={classes} style={getGridZoneStyle(block)}>
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
    case "HR":
      return <hr key={block.id} className={classes} />;
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
