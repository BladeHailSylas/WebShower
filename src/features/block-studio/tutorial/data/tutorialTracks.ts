import { tutorialMissions } from "./tutorialMissions";
import type { TutorialTrack } from "../types/tutorial.types";

export const tutorialTracks = [
  {
    id: "block-studio-basics",
    title: "Block Studio 기초 익히기",
    description: "블록을 추가하고 꾸민 뒤 미리보기와 HTML 코드를 확인합니다.",
    missions: tutorialMissions,
  },
] as const satisfies readonly TutorialTrack[];

