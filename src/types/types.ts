// types.ts (또는 전역 타입 정의부)
export type BlockType = 'CONTAINER' | 'H1' | 'P' | 'IMAGE'; // IMAGE 추가

export interface StyleProps {
  className?: string; // 예: 'text-red-500 bg-slate-100' (Tailwind 기반)
  inherit?: boolean;  // '공통으로 적용' 여부 (Phase 3에서 활성화)
}

export interface HtmlBlock {
  id: string;
  type: BlockType;
  content?: string;
  src?: string; // [추가] 이미지 요소용 URL 데이터
  styles?: StyleProps;
  children?: HtmlBlock[]; // 구조 요소 내부에 삽입될 자식 블록들
}