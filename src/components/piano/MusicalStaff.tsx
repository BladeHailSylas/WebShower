import React from 'react';
import { PIANO_NOTES } from '../../constants/pianoContants';

interface MusicalStaffProps {
  activeNotes: string[];
}

export default function MusicalStaff({ activeNotes }: MusicalStaffProps) {
  // 높은음자리표 라인 좌표 (E4, G4, B4, D5, F5 -> Step: 2, 4, 6, 8, 10)
  const trebleLines = [10, 8, 6, 4, 2];
  // 낮은음자리표 라인 좌표 (A3, F3, D3, B2, G2 -> Step: -2, -4, -6, -8, -10)
  const bassLines = [-2, -4, -6, -8, -10];

  const STEP_HEIGHT = 6; // 스텝당 픽셀(px) 간격 조정 (UI 크기에 맞춰 조절 가능)

  return (
    <div className="w-full max-w-2xl h-48 relative flex flex-col justify-center items-center py-4 select-none overflow-hidden bg-white rounded-lg border border-slate-100 shadow-inner">
      
      {/* --- 기준선 (가운데 가온 도 위치: 0) 시각적 가이드라인 보이지 않게 배치 --- */}
      <div className="relative w-full flex items-center justify-center">
        
        {/* 높은음자리표 렌더링 */}
        <div className="absolute left-8 bottom-[12px] text-5xl font-serif text-slate-400 font-bold z-10">𝄞</div>
        {trebleLines.map((step) => (
          <div key={`treble-${step}`} className="absolute w-full h-[1px] bg-slate-300" style={{ bottom: `${step * STEP_HEIGHT}px` }} />
        ))}

        {/* 낮은음자리표 렌더링 */}
        <div className="absolute left-8 top-[12px] text-5xl font-serif text-slate-400 font-bold z-10">𝄢</div>
        {bassLines.map((step) => (
          <div key={`bass-${step}`} className="absolute w-full h-[1px] bg-slate-300" style={{ bottom: `${step * STEP_HEIGHT}px` }} />
        ))}

        {/* --- 눌린 건반 음표 렌더링 영역 --- */}
        {activeNotes.map((noteKey) => {
          const noteInfo = PIANO_NOTES.find((n) => n.key === noteKey);
          if (!noteInfo) return null;

          return (
            <div 
              key={noteKey}
              className="absolute left-1/2 flex flex-col items-center transition-transform duration-100 ease-out"
              style={{ bottom: `${(noteInfo.grandStaffStep - 1) * (STEP_HEIGHT)}px`, marginLeft: '-8px' }}
              //예외 처리하기는 싫었지만, 시간은 유한하고 고칠 것은 명확하다... 음계가 하나 아래로 내려가면 정확히 맞음
            >
              {/* 계이름 안내 레이블 (모던한 말풍선 형태) */}
              <div className="absolute -top-7 px-2 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded-md shadow-sm whitespace-nowrap">
                {noteInfo.nameName}{noteInfo.isBlack ? '#' : ''}
              </div>

              {/* 가온 도(C4, step: 0) 및 범위를 벗어나는 음의 덧줄(Ledger Line) 자동 생성 로직 */}
              {(noteInfo.grandStaffStep === 0 || noteInfo.grandStaffStep >= 12 || noteInfo.grandStaffStep <= -12) && (
                <div className="absolute w-8 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2" />
              )}

              {/* 음표 머리 */}
              <div className="w-4 h-3 bg-slate-800 rounded-[50%] transform -rotate-12 flex items-center justify-center relative">
                {noteInfo.isBlack && <span className="absolute -left-4 text-sm font-bold text-slate-800">#</span>}
              </div>

              {/* 음표 기둥 (높이에 따라 기둥이 위로 향할지 아래로 향할지 자동 결정) */}
              <div className={`absolute w-0.5 h-8 bg-slate-800 ${
                noteInfo.grandStaffStep >= 0 
                  ? 'left-[14px] bottom-[4px]'  // 기둥 아래로
                  : 'left-[0px] top-[4px]'      // 기둥 위로
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}