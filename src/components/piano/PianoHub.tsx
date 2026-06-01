import React, { useState, useEffect, useRef } from 'react';
import { type NoteInfo, KEYBOARD_MAP, PIANO_NOTES } from '../../constants/pianoContants';
import MusicalStaff from './MusicalStaff';
import VirtualPiano from './VirtualPiano';

export default function PianoHub() {
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Record<string, OscillatorNode>>({});

  // 1. Web Audio API 초기화 및 브라우저 예외 처리
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsAudioUnlocked(true);
  };

  // 2. 소리 재생 로직 (합성기 구동)
  const startTone = (note: NoteInfo) => {
    if (!audioCtxRef.current) return;
    initAudio(); // 미연의 차단 방지 안전장치

    // 이미 재생 중인 동일 음이 있다면 중복 생성 방지 예외 처리
    if (oscillatorsRef.current[note.key]) return;

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // 부드러운 피아노 음색 아날로그 모사 (수정 가능한 핵심 변수)
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(note.frequency, ctx.currentTime);

    // 볼륨 엔벨로프 설정 (소리가 딱딱하게 끊기지 않고 부드럽게 사라지도록)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    oscillatorsRef.current[note.key] = osc;

    setActiveNotes((prev) => [...prev, note.key]);
  };

  // 3. 소리 정지 로직
  const stopTone = (noteKey: string) => {
    const osc = oscillatorsRef.current[noteKey];
    if (osc) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // 이미 정지된 오디오 노드에 대한 예외 처리
      }
      delete oscillatorsRef.current[noteKey];
    }
    setActiveNotes((prev) => prev.filter((k) => k !== noteKey));
  };

  // 4. 컴퓨터 키보드 인터랙션 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // 꾹 누르고 있을 때의 중복 이벤트 예외 처리
      const noteKey = KEYBOARD_MAP[e.key.toLowerCase()];
      if (noteKey) {
        const note = PIANO_NOTES.find((n) => n.key === noteKey);
        if (note) startTone(note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const noteKey = KEYBOARD_MAP[e.key.toLowerCase()];
      if (noteKey) stopTone(noteKey);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isAudioUnlocked]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
      {/* 인터랙티브 브라우저 예외 안내 */}
      {!isAudioUnlocked && (
        <div className="alert bg-blue-50 border border-blue-200 text-slate-700 text-sm flex justify-between items-center rounded-xl p-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-blue-600 shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>브라우저 보안 정책으로 인해 소리를 들으려면 활성화 버튼이 필요합니다.</span>
          </div>
          <button onClick={initAudio} className="btn btn-sm btn-primary text-white font-bold">오디오 활성화</button>
        </div>
      )}

      {/* [상단 구성] 오선보 학습 시각화 영역 */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px]">
        <MusicalStaff activeNotes={activeNotes} />
      </div>

      {/* [하단 구성] 모던 피아노 건반 영역 */}
      <VirtualPiano 
        activeNotes={activeNotes} 
        onNoteStart={startTone} 
        onNoteEnd={stopTone} 
      />

      <div className="text-center text-xs text-slate-400">
        * 마우스로 건반을 클릭해보세요.
      </div>
    </div>
  );
}