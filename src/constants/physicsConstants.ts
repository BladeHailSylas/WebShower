// =================================================================
// SHOW STUDENTS: 강사 시연용 물리 세상의 법칙 변수
// 수치를 슬라이더로 조절하거나 코드로 직접 변경하며 물리 세상의 변화를 시연합니다.
// =================================================================
export const PHYSICS_CONFIG = {
  INITIAL_GRAVITY: 0.5,
  INITIAL_ELASTICITY: 0.7,
  BALL_COLLISION_BOOST: 1.2,
  FRICTION: 0.99,
  ENABLE_COLOR_JUICE: false, 
};

export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
}

export const BALL_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#06b6d4'];