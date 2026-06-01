// =================================================================
// SHOW STUDENTS: 강사 시연용 설정 값
// 현장에서 이 수치들을 변경하여 코딩의 '변수'와 '연산'의 힘을 드라마틱하게 보여줄 수 있습니다.
// =================================================================
export const CHEAT_CONFIG = {
  CLICKER_CLICK_MULTIPLIER: 1,      // 클릭당 기본 획득 점수 배율 (예: 100으로 변경 시 100배씩 상승)
  AUTO_CLICK_INTERVAL_MS: 1000, // 자동 클릭 작동 주기 (밀리초 단위, 기본 1초)
  CLICKER_INITIAL_SCORE: 0,         // 시작 점수 (시연을 위해 대량의 점수를 주고 시작할 때 수정)
};

// 안전한 환경을 위한 최소 제한 기준 (예외 처리용)
export const CLICKER_SAFETY_LIMITS = {
  MIN_INTERVAL_MS: 100,     // 무한 루프 및 브라우저 다운 방지를 위한 최소 주기
};

export interface ClickerShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  costMultiplier: number;
  level: number;
  effect: number;
  type: 'click' | 'auto';
}