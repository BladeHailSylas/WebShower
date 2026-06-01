export interface NoteInfo {
  key: string;
  nameName: string;   // 계이름 (도, 레, 미...)
  pitchName: string;  // 음이름 (C, D, E...)
  frequency: number;  // 주파수 (Hz)
  isBlack: boolean;   // 흑건 여부
  grandStaffStep: number; // 가온 도(C4) = 0 기준, 오선보 상의 줄/칸 상대 위치
}

export const PIANO_NOTES: NoteInfo[] = [
  // =================================================================
  // [1옥타브] 낮은음자리표 영역 (C3 ~ B3)
  // =================================================================
  { key: 'C3', nameName: '도', pitchName: 'C', frequency: 130.81, isBlack: false, grandStaffStep: -7 },
  { key: 'C#3', nameName: '도#', pitchName: 'C#', frequency: 138.59, isBlack: true, grandStaffStep: -7 },
  { key: 'D3', nameName: '레', pitchName: 'D', frequency: 146.83, isBlack: false, grandStaffStep: -6 },
  { key: 'D#3', nameName: '레#', pitchName: 'D#', frequency: 155.56, isBlack: true, grandStaffStep: -6 },
  { key: 'E3', nameName: '미', pitchName: 'E', frequency: 164.81, isBlack: false, grandStaffStep: -5 },
  { key: 'F3', nameName: '파', pitchName: 'F', frequency: 174.61, isBlack: false, grandStaffStep: -4 },
  { key: 'F#3', nameName: '파#', pitchName: 'F#', frequency: 185.00, isBlack: true, grandStaffStep: -4 },
  { key: 'G3', nameName: '솔', pitchName: 'G', frequency: 196.00, isBlack: false, grandStaffStep: -3 },
  { key: 'G#3', nameName: '솔#', pitchName: 'G#', frequency: 207.65, isBlack: true, grandStaffStep: -3 },
  { key: 'A3', nameName: '라', pitchName: 'A', frequency: 220.00, isBlack: false, grandStaffStep: -2 },
  { key: 'A#3', nameName: '라#', pitchName: 'A#', frequency: 233.08, isBlack: true, grandStaffStep: -2 },
  { key: 'B3', nameName: '시', pitchName: 'B', frequency: 246.94, isBlack: false, grandStaffStep: -1 },

  // =================================================================
  // [2옥타브] 가온 도 영역 (C4 ~ B4)
  // =================================================================
  { key: 'C4', nameName: '도', pitchName: 'C', frequency: 261.63, isBlack: false, grandStaffStep: 0 },
  { key: 'C#4', nameName: '도#', pitchName: 'C#', frequency: 277.18, isBlack: true, grandStaffStep: 0 },
  { key: 'D4', nameName: '레', pitchName: 'D', frequency: 293.66, isBlack: false, grandStaffStep: 1 },
  { key: 'D#4', nameName: '레#', pitchName: 'D#', frequency: 311.13, isBlack: true, grandStaffStep: 1 },
  { key: 'E4', nameName: '미', pitchName: 'E', frequency: 329.63, isBlack: false, grandStaffStep: 2 },
  { key: 'F4', nameName: '파', pitchName: 'F', frequency: 349.23, isBlack: false, grandStaffStep: 3 },
  { key: 'F#4', nameName: '파#', pitchName: 'F#', frequency: 369.99, isBlack: true, grandStaffStep: 3 },
  { key: 'G4', nameName: '솔', pitchName: 'G', frequency: 392.00, isBlack: false, grandStaffStep: 4 },
  { key: 'G#4', nameName: '솔#', pitchName: 'G#', frequency: 415.30, isBlack: true, grandStaffStep: 4 },
  { key: 'A4', nameName: '라', pitchName: 'A', frequency: 440.00, isBlack: false, grandStaffStep: 5 },
  { key: 'A#4', nameName: '라#', pitchName: 'A#', frequency: 466.16, isBlack: true, grandStaffStep: 5 },
  { key: 'B4', nameName: '시', pitchName: 'B', frequency: 493.88, isBlack: false, grandStaffStep: 6 },

  // =================================================================
  // [3옥타브] 높은음자리표 확장 영역 (C5 ~ B5)
  // =================================================================
  { key: 'C5', nameName: '도', pitchName: 'C', frequency: 523.25, isBlack: false, grandStaffStep: 7 },
  { key: 'C#5', nameName: '도#', pitchName: 'C#', frequency: 554.37, isBlack: true, grandStaffStep: 7 },
  { key: 'D5', nameName: '레', pitchName: 'D', frequency: 587.33, isBlack: false, grandStaffStep: 8 },
  { key: 'D#5', nameName: '레#', pitchName: 'D#', frequency: 622.25, isBlack: true, grandStaffStep: 8 },
  { key: 'E5', nameName: '미', pitchName: 'E', frequency: 659.25, isBlack: false, grandStaffStep: 9 },
  { key: 'F5', nameName: '파', pitchName: 'F', frequency: 698.46, isBlack: false, grandStaffStep: 10 },
  { key: 'F#5', nameName: '파#', pitchName: 'F#', frequency: 739.99, isBlack: true, grandStaffStep: 10 },
  { key: 'G5', nameName: '솔', pitchName: 'G', frequency: 783.99, isBlack: false, grandStaffStep: 11 },
  { key: 'G#5', nameName: '솔#', pitchName: 'G#', frequency: 830.61, isBlack: true, grandStaffStep: 11 },
  { key: 'A5', nameName: '라', pitchName: 'A', frequency: 880.00, isBlack: false, grandStaffStep: 12 },
  { key: 'A#5', nameName: '라#', pitchName: 'A#', frequency: 932.33, isBlack: true, grandStaffStep: 12 },
  { key: 'B5', nameName: '시', pitchName: 'B', frequency: 987.77, isBlack: false, grandStaffStep: 13 },
];

// 컴퓨터 키보드와 피아노 건반 매핑 (A, S, D, F, G, H, J, K...)
export const KEYBOARD_MAP: Record<string, string> = {
  a: 'C4', w: 'C#4', s: 'D4', e: 'D#4', d: 'E4', f: 'F4', t: 'F#4', g: 'G4', y: 'G#4', h: 'A4', u: 'A#4', j: 'B4', k: 'C5'
};