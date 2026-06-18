export interface HtmlSchemaDefinition {
  tag: "div" | "h1" | "p" | "img" | "a" | "hr";
  contentField?: "content";
  childField?: "children";
  srcField?: "src";
  hrefField?: "link";
  selfClosing?: boolean;
}

export type HtmlExporterKey = "passwordZone" | "toggleZone";
