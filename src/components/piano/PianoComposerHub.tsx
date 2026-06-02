import { useState, useRef } from "react";
import { type NoteInfo, PIANO_NOTES } from "../../constants/pianoContants";

// MIDI 규격 매핑 헬퍼 (C4 = 60)
const getMidiNoteCode = (pitchName: string, octave: string, isBlack: boolean): number => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const baseNote = notes.indexOf(pitchName + (isBlack ? '#' : ''));
  const oct = parseInt(octave, 10);
  return baseNote > -1 ? (oct + 1) * 12 + baseNote : 60;
};

export default function PianoComposerHub() {
  const TOTAL_STEPS = 16; // 4/4박자 2마디 (8분음표 기준 16개 스텝)
  
  const [timeline, setTimeline] = useState<NoteInfo[][]>(Array.from({ length: TOTAL_STEPS }, () => []));
  const [activeStep, setActiveStep] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const playNote = (note: NoteInfo) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  };

  // 피아노 건반 입력 핸들러 (음 재생 및 타임라인 기록)
  const handleNoteInput = (note: NoteInfo) => {
    playNote(note);
    
    setTimeline((prev) => {
      const newTimeline = [...prev];
      // 단음 멜로디 기록 (기존 화음 덮어쓰기)
      newTimeline[activeStep] = [note];
      return newTimeline;
    });

    // 다음 스텝으로 자동 이동 (편리한 작곡 UX)
    setActiveStep((prev) => (prev + 1) % TOTAL_STEPS);
  };

  const clearTimeline = () => {
    setTimeline(Array.from({ length: TOTAL_STEPS }, () => []));
    setActiveStep(0);
    showToast('🧹 작곡 타임라인이 초기화되었습니다.');
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- [확장 1] 가상 캔버스를 활용한 PNG 악보 추출 로직 ---
  const exportToPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 배경 흰색 채우기
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const STEP_HEIGHT = 6;

    // 오선보 라인 그리기 (높은음/낮은음)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    const trebleLines = [10, 8, 6, 4, 2];
    const bassLines = [-2, -4, -6, -8, -10];
    
    [...trebleLines, ...bassLines].forEach((step) => {
      ctx.beginPath();
      // Y축은 스크린에서 아래로 향하므로, 오프셋을 빼줍니다.
      const y = centerY - (step * STEP_HEIGHT);
      ctx.moveTo(40, y);
      ctx.lineTo(760, y);
      ctx.stroke();
    });

    // 높은음자리표, 낮은음자리표 텍스트 드로잉
    ctx.fillStyle = '#94a3b8';
    ctx.font = '40px serif';
    ctx.fillText('𝄞', 50, centerY - 12 * STEP_HEIGHT + 35);
    ctx.fillText('𝄢', 50, centerY + 2 * STEP_HEIGHT + 35);

    // 타임라인 음표 드로잉
    const slotWidth = 700 / TOTAL_STEPS;
    ctx.fillStyle = '#1e293b';

    timeline.forEach((notes, index) => {
      if (notes.length === 0) return;
      const x = 100 + (index * slotWidth);
      
      notes.forEach((note) => {
        // [핵심] 현장에서 검증된 오프셋(-1) 적용 연산 바인딩
        const y = centerY - ((note.grandStaffStep) * STEP_HEIGHT);

        // 덧줄(Ledger Line) 처리
        if (note.grandStaffStep === 0 || note.grandStaffStep >= 12 || note.grandStaffStep <= -12) {
          ctx.beginPath();
          ctx.moveTo(x - 12, centerY); // C4는 centerY 기준
          ctx.lineTo(x + 12, centerY);
          ctx.stroke();
        }

        // 음표 머리
        ctx.beginPath();
        ctx.ellipse(x, y, 7, 5, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // 흑건 임시표(#)
        if (note.isBlack) {
          ctx.font = '14px Arial';
          ctx.fillText('#', x - 18, y + 4);
        }

        // 음표 기둥
        ctx.beginPath();
        if (note.grandStaffStep >= 0) {
          ctx.moveTo(x + 5, y);
          ctx.lineTo(x + 5, y + 25);
        } else {
          ctx.moveTo(x - 5, y);
          ctx.lineTo(x - 5, y - 25);
        }
        ctx.stroke();
      });
    });

    const url = canvas.toDataURL('image/png');
    triggerDownload(url, 'my_sheet_music.png');
    showToast('🖨️ PNG 고해상도 악보가 생성되었습니다!');
  };

  // --- [확장 2] 순수 프론트엔드 환경 MIDI 바이너리 추출 스크립트 ---
  const exportToMIDI = () => {
    // 가변 길이 양(VLQ) 바이트 인코딩 헬퍼 함수
    const writeVLQ = (arr: number[], val: number) => {
      const bytes = [];
      bytes.push(val & 0x7F);
      val >>= 7;
      while (val > 0) {
        bytes.push((val & 0x7F) | 0x80);
        val >>= 7;
      }
      for (let i = bytes.length - 1; i >= 0; i--) arr.push(bytes[i]);
    };

    const header = [0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x00, 0x00, 0x01, 0x00, 0x60];
    const track: number[] = [];
    const TICKS_PER_STEP = 48; // 8분음표 기준 델타 타임
    let waitTicks = 0;

    timeline.forEach((notes) => {
      if (notes.length === 0) {
        waitTicks += TICKS_PER_STEP;
      } else {
        // Note On (0x90)
        notes.forEach((note, idx) => {
          writeVLQ(track, idx === 0 ? waitTicks : 0);
          track.push(0x90, getMidiNoteCode(note.pitchName, note.key.slice(-1), note.isBlack), 0x64);
        });
        waitTicks = TICKS_PER_STEP;
        // Note Off (0x80)
        notes.forEach((note, idx) => {
          writeVLQ(track, idx === 0 ? waitTicks : 0);
          track.push(0x80, getMidiNoteCode(note.pitchName, note.key.slice(-1), note.isBlack), 0x00);
        });
        waitTicks = 0;
      }
    });

    // 트랙 종료 시그널 (FF 2F 00)
    writeVLQ(track, waitTicks);
    track.push(0xFF, 0x2F, 0x00);

    const trackLength = track.length;
    const trackHeader = [0x4d, 0x54, 0x72, 0x6b, (trackLength >> 24) & 0xff, (trackLength >> 16) & 0xff, (trackLength >> 8) & 0xff, trackLength & 0xff];

    const midiArray = new Uint8Array([...header, ...trackHeader, ...track]);
    const blob = new Blob([midiArray], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    
    triggerDownload(url, 'my_melody.mid');
    URL.revokeObjectURL(url);
    showToast('🎹 DAW 호환 MIDI 파일이 추출되었습니다!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6 select-none relative">
      
      {/* 시각적 타격감 토스트 */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow-lg text-sm font-medium">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="text-center w-full flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-800">디지털 비주얼 작곡가</h2>
          <p className="text-sm text-slate-500 mt-1">4/4박자 스텝 시퀀서 및 MIDI/PNG 실물 추출 시스템</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToPNG} className="btn btn-sm btn-outline btn-primary">PNG 악보 추출</button>
          <button onClick={exportToMIDI} className="btn btn-sm btn-primary text-white">MIDI 파일 추출</button>
        </div>
      </div>

      {/* --- 작곡 스텝 시퀀서 UI --- */}
      <div className="w-full bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-slate-500">타임라인 (1마디 8스텝 x 2)</span>
          <button onClick={clearTimeline} className="text-xs text-slate-400 hover:text-slate-600">전체 지우기</button>
        </div>
        <div className="grid grid-cols-16 gap-1 overflow-x-auto w-full" style={{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, minmax(40px, 1fr))` }}>
          {timeline.map((notes, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-16 flex flex-col items-center justify-center rounded border transition-colors cursor-pointer ${
                activeStep === idx 
                  ? 'bg-blue-100 border-primary shadow-inner' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {notes.length > 0 ? (
                <div className="text-xs font-bold text-slate-700 text-center">
                  {notes.map(n => n.nameName + (n.isBlack ? '#' : '')).join(',')}
                </div>
              ) : (
                <div className="text-[10px] text-slate-300">-</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          작성할 칸을 클릭한 후 아래의 건반을 누르면 음표가 기록됩니다. (건반 클릭 시 자동 다음 칸 이동)
        </p>
      </div>

      {/* --- 가상 피아노 건반 재사용부 (약식 포함) --- */}
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar bg-white rounded-lg border border-slate-100 p-2">
        <div className="flex relative min-w-[max-content] h-40 px-2 pt-2">
          {PIANO_NOTES.map((note, index) => {
            if (note.isBlack) {
              return (
                <button
                  key={note.key}
                  onMouseDown={() => handleNoteInput(note)}
                  className="w-8 h-24 bg-slate-800 border border-slate-900 rounded-b-md absolute z-20 hover:bg-primary transition-colors shadow-md"
                  style={{ left: `${(PIANO_NOTES.filter((n, i) => !n.isBlack && index > i).length * 48) - 16}px` }}
                />
              );
            } else {
              return (
                <button
                  key={note.key}
                  onMouseDown={() => handleNoteInput(note)}
                  className="w-12 h-36 bg-white border border-slate-200 rounded-b-lg flex flex-col justify-end pb-2 items-center hover:bg-blue-50 transition-colors shadow-sm"
                >
                  <span className="text-[10px] font-bold text-slate-400">{note.nameName}</span>
                </button>
              );
            }
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  );
}