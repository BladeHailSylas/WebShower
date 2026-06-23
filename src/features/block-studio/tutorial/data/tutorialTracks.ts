import {
  invitationTutorialMissions,
  promotionTutorialMissions,
  tutorialMissions,
} from "./tutorialMissions";
import {
  blockStudioBasicsIntro,
  invitationPageIntro,
  promotionPageIntro,
} from "./tutorialTrackIntros";
import type { TutorialTrack } from "../types/tutorial.types";

export const tutorialTracks = [
  {
    id: "block-studio-basics",
    title: "Block Studio 기초 익히기",
    description: "블록을 추가하고 꾸민 뒤 미리보기와 HTML 코드를 확인합니다.",
    intro: blockStudioBasicsIntro,
    missions: tutorialMissions,
  },
  {
    id: "promotion-page",
    title: "홍보 페이지 만들기",
    description:
      "동아리, 행사, 프로젝트처럼 사람들에게 알리고 싶은 내용을 홍보 페이지로 만들어 봅니다.",
    intro: promotionPageIntro,
    missions: promotionTutorialMissions,
  },
  {
    id: "invitation-page",
    title: "초대장 페이지 만들기",
    description:
      "제목, 이미지, 일정 목록, 접히는 안내, 비밀번호로 열리는 비밀 메시지를 사용해 특별한 초대장을 만들어 봅니다.",
    intro: invitationPageIntro,
    missions: invitationTutorialMissions,
  },
] as const satisfies readonly TutorialTrack[];
