import type { HtmlBlock } from "../../../../types/types";

export interface LearningTemplate {
  id: string;
  title: string;
  description: string;
  blocks: HtmlBlock[];
  learningPoints: string[];
}
