import React from 'react';
import { type NoteInfo, PIANO_NOTES } from '../../constants/pianoContants';

interface VirtualPianoProps {
  activeNotes: string[];
  onNoteStart: (note: NoteInfo) => void;
  onNoteEnd: (noteKey: string) => void;
}

export default function VirtualPiano({ activeNotes, onNoteStart, onNoteEnd }: VirtualPianoProps) {
  // 백건과 흑건의 배치를 분리하지 않고, flex-row 내부 absolute 정렬로 모던하게 구현
  return (
    <div className="flex justify-center bg-slate-100 p-4 rounded-xl relative h-48 select-none">
        
      <div className="flex relative h-40">
        {PIANO_NOTES.map((note) => {
          const isActive = activeNotes.includes(note.key);

          if (note.isBlack) {
            // 흑건(Black Key) 스타일링 및 위치 연산 (모던 디자인 배치)
            // 인덱스 기반 마진 오프셋 대신 간결한 포지셔닝 구조
            return (
              <button
                key={note.key}
                onMouseDown={() => onNoteStart(note)}
                onMouseUp={() => onNoteEnd(note.key)}
                onMouseLeave={() => onNoteEnd(note.key)}
                className={`w-6 h-24 bg-slate-800 border border-slate-900 rounded-b-md absolute z-20 transition-all duration-75 shadow-md ${
                  isActive ? 'bg-primary border-primary h-[94px]' : 'hover:bg-slate-700'
                }`}
                style={{
                  // 백건들의 너비와 유기적으로 물리도록 위치 오프셋 계산 조정
                  left: `${(PIANO_NOTES.filter((n, i) => !n.isBlack && PIANO_NOTES.indexOf(note) > i).length * 48) - 12}px`
                }}
              />
            );
          } else {
            // 백건(White Key) 스타일링
            return (
              <button
                key={note.key}
                onMouseDown={() => onNoteStart(note)}
                onMouseUp={() => onNoteEnd(note.key)}
                onMouseLeave={() => onNoteEnd(note.key)}
                className={`w-12 h-40 bg-white border border-slate-200 rounded-b-lg flex flex-col justify-end pb-2 items-center transition-all duration-75 shadow-sm ${
                  isActive ? 'bg-blue-50 border-blue-300 pt-2 h-[156px] shadow-inner' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  {note.nameName}
                </span>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}