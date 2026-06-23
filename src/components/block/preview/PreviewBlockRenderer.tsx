import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";
import { resolveGuiInlineStyleObject } from "../../../features/block-studio/blocks/html/resolveGuiInlineStyles";
import { transformGuiToTailwind } from "../../../features/block-studio/blocks/html/transformGuiToTailwind";
import PasswordPreviewItem from "./PasswordPreviewItem";
import SliderPreviewItem from "./SliderPreviewItem";
import TogglePreviewItem from "./TogglePreviewItem";

interface PreviewBlockRendererProps {
  block: HtmlBlock;
  disableLinks?: boolean;
}

interface RenderPreviewBlockOptions {
  disableLinks?: boolean;
}

function getGridZoneStyle(block: HtmlBlock): CSSProperties {
  const gridCols = block.styles?.gridCols ?? 2;

  return {
    display: "grid",
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    gap: "12px",
  };
}

function getBlockInlineStyle(block: HtmlBlock): CSSProperties {
  const colorStyles = resolveGuiInlineStyleObject(block.styles);
  if (block.type !== "GRID_ZONE") return colorStyles;

  return {
    ...colorStyles,
    ...getGridZoneStyle(block),
  };
}

function renderPreviewBlock(block: HtmlBlock, options: RenderPreviewBlockOptions = {}): ReactNode {
  const classes = transformGuiToTailwind(block.styles, block.type);
  const inlineStyle = getBlockInlineStyle(block);
  const renderChild = (child: HtmlBlock) => renderPreviewBlock(child, options);

  switch (block.type) {
    case "CONTAINER":
    case "CARD":
      return (
        <div key={block.id} className={classes} style={inlineStyle}>
          {block.children?.map(renderChild)}
        </div>
      );
    case "LIST":
      return (
        <ul key={block.id} className={classes} style={inlineStyle}>
          {block.children?.map(renderChild)}
        </ul>
      );
    case "LIST_ITEM":
      return (
        <li key={block.id} className={classes} style={inlineStyle}>
          {block.children?.map(renderChild)}
        </li>
      );
    case "SLIDER_ZONE":
      return (
        <SliderPreviewItem
          key={block.id}
          block={block}
          renderBlock={renderChild}
          className={classes}
          style={inlineStyle}
        />
      );
    case "SLIDE_ITEM":
      return (
        <article key={block.id} className={classes} style={inlineStyle}>
          {block.children?.map(renderChild)}
        </article>
      );
    case "GRID_ZONE":
      return (
        <div key={block.id} className={classes} style={inlineStyle}>
          {block.children?.map(renderChild)}
        </div>
      );
    case "H1":
      return (
        <h1 key={block.id} className={classes} style={inlineStyle}>
          {block.content}
        </h1>
      );
    case "P":
      return (
        <p key={block.id} className={classes} style={inlineStyle}>
          {block.content}
        </p>
      );
    case "HR":
      return <hr key={block.id} className={classes} style={inlineStyle} />;
    case "IMAGE":
      return <img key={block.id} src={block.src} alt="미리보기" className={classes} style={inlineStyle} />;
    case "A": {
      const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (options.disableLinks) event.preventDefault();
      };

      return (
        <a
          key={block.id}
          href={block.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          style={inlineStyle}
          onClick={handleLinkClick}
        >
          {block.content}
        </a>
      );
    }
    case "PASSWORD_ZONE":
      return (
        <PasswordPreviewItem
          key={block.id}
          block={block}
          renderBlock={renderChild}
          className={classes}
          style={inlineStyle}
        />
      );
    case "TOGGLE_ZONE":
      return (
        <TogglePreviewItem
          key={block.id}
          block={block}
          renderBlock={renderChild}
          className={classes}
          style={inlineStyle}
        />
      );
    default:
      return null;
  }
}

export default function PreviewBlockRenderer({ block, disableLinks = false }: PreviewBlockRendererProps) {
  return renderPreviewBlock(block, { disableLinks });
}
