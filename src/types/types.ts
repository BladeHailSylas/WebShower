// types.ts (또는 전역 타입 정의부)
export type BlockType = 'CONTAINER' | 'CARD' | 'LIST' | 'LIST_ITEM' | 'SLIDER_ZONE' | 'SLIDE_ITEM' | 'H1' | 'P' | 'A' | 'IMAGE' | 'HR' | 'PASSWORD_ZONE' | 'TOGGLE_ZONE' | 'GRID_ZONE' | 'SPACER'; // IMAGE 추가

export interface StyleProps {
  className?: string; // 예: 'text-red-500 bg-slate-100' (Tailwind 기반)
  inherit?: boolean;  // '공통으로 적용' 여부 (Phase 3에서 활성화)
  // 아이들이 드롭다운과 체크박스로 선택할 스타일 원자 단위
  textColor?: 'black' | 'gray' | 'red' | 'blue' | 'green';
  bgColor?: 'none' | 'white' | 'slate' | 'red' | 'blue' | 'green' | 'yellow';
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'small' | 'normal' | 'large' | 'xlarge';
  fontFamily?: 'default' | 'sans' | 'serif' | 'mono';
  lineHeight?: 'default' | 'tight' | 'normal' | 'relaxed' | 'loose';
  letterSpacing?: 'default' | 'tight' | 'normal' | 'wide';
  isBold?: boolean;    // 두껍게 여부
  isRounded?: boolean; // legacy: rounded가 없을 때만 사용
  shadow?: 'default' | 'none' | 'small' | 'medium' | 'large';
  rounded?: 'default' | 'none' | 'small' | 'medium' | 'large' | 'full';
  borderWidth?: 'default' | 'none' | 'thin' | 'medium' | 'thick';
  borderColor?: 'default' | 'slate' | 'black' | 'red' | 'blue' | 'green';
  paddingSize?: 'default' | 'none' | 'sm' | 'md' | 'lg' | 'xl';
  marginSize?: 'default' | 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gridCols?: 2 | 3 | 4;
}

export interface HtmlBlock {
  id: string;
  type: BlockType;
  content?: string;
  src?: string;
  link?: string;
  correctAnswer?: string; // 🌟 비밀번호 매크로 블록 정답 필드
  styles?: StyleProps;
  children?: HtmlBlock[];
  defaultChildren?: HtmlBlock[];   // 🌟 명세서 사양: [잠겼을 때] 슬롯 트랙
  conditionalChildren?: HtmlBlock[]; // 🌟 명세서 사양: [풀렸을 때] 슬롯 트랙
}
