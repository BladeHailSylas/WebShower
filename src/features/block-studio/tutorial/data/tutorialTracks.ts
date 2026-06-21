import { promotionTutorialMissions, tutorialMissions } from "./tutorialMissions";
import type { TutorialTrack } from "../types/tutorial.types";

export const tutorialTracks = [
  {
    id: "block-studio-basics",
    title: "Block Studio 기초 익히기",
    description: "블록을 추가하고 꾸민 뒤 미리보기와 HTML 코드를 확인합니다.",
    missions: tutorialMissions,
  },
  {
    id: "promotion-page",
    title: "홍보 페이지 만들기",
    description:
      "동아리, 행사, 프로젝트처럼 사람들에게 알리고 싶은 내용을 홍보 페이지로 만들어 봅니다.",
    missions: promotionTutorialMissions,
  },
] as const satisfies readonly TutorialTrack[];
