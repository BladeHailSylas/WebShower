// =================================================================
// SHOW STUDENTS: 강사 시연용 물리 세상의 법칙 변수
// 수치를 슬라이더로 조절하거나 코드로 직접 변경하며 물리 세상의 변화를 시연합니다.
// =================================================================
export const PHYSICS_CONFIG = {
  INITIAL_GRAVITY: 0.5,       // 기본 중력 가속도 (Y축 방향 아래로 당기는 힘)
  INITIAL_ELASTICITY: 0.7,    // 기본 반발력 계수 (e: 벽 충돌 시 속도 보존율, 0~1)
  BALL_COLLISION_BOOST: 1.2,  // 공끼리 충돌 시 반발력 가중치 상수 (손실을 줄여 더 통통 튕기게 만듦)
  FRICTION: 0.99,             // 공기 저항 및 바닥 마찰 (매 프레임마다 속도를 미세하게 감쇄)
};

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

// 공 생성 시 무작위로 부여할 모던 네온 테마 컬러 세트
export const BALL_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#06b6d4'];