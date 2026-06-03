import { useState, useRef, useEffect } from "react";
import { CONSTANT_CHORDS, type NoteInfo, PIANO_NOTES } from "../../constants/pianoContants";

// MIDI 규격 매핑 헬퍼 (C4 = 60)
const getMidiNoteCode = (pitchName: string, octave: string, isBlack: boolean): number => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const baseNote = notes.indexOf(pitchName + (isBlack ? '#' : ''));
  const oct = parseInt(octave, 10);
  return baseNote > -1 ? (oct + 1) * 12 + baseNote : 60;
};

// 확장된 음표 데이터 타입 (박자 길이 포함)
export interface ComposerNote extends NoteInfo {
  length: number; // 1(8분음표), 2(4분음표), 4(2분음표), 8(온음표)
}
export default function PianoComposerHub() {
  const TOTAL_MEASURES = 4;
  const STEPS_PER_MEASURE = 8;
  const TOTAL_STEPS = TOTAL_MEASURES * STEPS_PER_MEASURE;
  
  const [timeline, setTimeline] = useState<(ComposerNote[] | null)[]>(Array.from({ length: TOTAL_STEPS }, () => []));
  const [activeStep, setActiveStep] = useState<number>(0);
  const [playbackStep, setPlaybackStep] = useState<number | null>(null); // 현재 재생 중인 스텝 마커
  const [selectedLength, setSelectedLength] = useState<number>(2); 
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<number | null>(null); //NodeJS.Timeout을 찾을 수 없음; 임시로 number 사용

  // 실시간 루프 내부에서 최신 타임라인 상태를 참조하기 위한 Ref 바인딩
  const timelineRefData = useRef(timeline);
  useEffect(() => {
    timelineRefData.current = timeline;
  }, [timeline]);

  // 컴포넌트 언마운트 시 재생 인터벌 청소 예외 처리
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- [핵심 오디오 소스 엔진] 단일 주파수 발진 함수 고도화 ---
  const playTone = (frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'triangle') => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    // 부드러운 감쇄 곡선(Exponential Decay)을 적용하여 전자음 유출 현상 차단 및 타격감 확보
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const handleNoteInput = (note: NoteInfo) => {
    const availableSpace = TOTAL_STEPS - activeStep;
    const actualLength = Math.min(selectedLength, availableSpace);

    if (actualLength < selectedLength) {
      showToast('⚠️ 남은 공간이 부족하여 음표의 길이가 자동으로 조절되었습니다.');
    }

    playTone(note.frequency, actualLength * 0.25, 0.3, 'triangle');
    
    setTimeline((prev) => {
      const newTimeline = [...prev];
      newTimeline[activeStep] = [{ ...note, length: actualLength }];
      for (let i = 1; i < actualLength; i++) {
        newTimeline[activeStep + i] = null;
      }
      return newTimeline;
    });

    const nextStep = (activeStep + actualLength) % TOTAL_STEPS;
    setActiveStep(nextStep);

    if (timelineRef.current) {
      const scrollAmount = (nextStep / TOTAL_STEPS) * timelineRef.current.scrollWidth;
      timelineRef.current.scrollTo({ left: scrollAmount - 100, behavior: 'smooth' });
    }
  };

  // --- [확장 추가] 실시간 앙상블 들어보기(Playback) 제어 엔진 ---
  // SHOW STUDENTS: 미디 코드를 주파수로 정밀 변환하는 수학적 공식 적용
  // 수식 법칙: $f = 440 \times 2^{\frac{d - 69}{12}}$
  const midiToFreq = (code: number) => 440 * Math.pow(2, (code - 69) / 12);

  const stopPlayback = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setPlaybackStep(null);
    showToast('🛑 연주를 정지했습니다.');
  };

  const startPlayback = () => {
    if (playbackIntervalRef.current) {
      stopPlayback();
      return;
    }

    let currentStep = 0;
    setPlaybackStep(0);
    showToast('🎶 실시간 코딩 밴드 연주를 시작합니다!');

    // 8분음표 기준 타임 스케줄러 가동 (BPM 120 기준 스텝당 250ms)
    const intervalId = setInterval(() => {
      if (currentStep >= TOTAL_STEPS) {
        stopPlayback();
        return;
      }

      // 1. 오른손 멜로디 트랙 실시간 연주 파싱
      const notes = timelineRefData.current[currentStep];
      if (notes && notes.length > 0) {
        notes.forEach((note) => {
          playTone(note.frequency, note.length * 0.25, 0.25, 'triangle');
        });
      }

      // 2. 왼손 자동 아르페지오 반주 트랙 실시간 수학적 합성
      const measure = Math.floor(currentStep / STEPS_PER_MEASURE);
      const stepInMeasure = currentStep % STEPS_PER_MEASURE;
      const chord = CONSTANT_CHORDS[measure];
      const bassNoteCode = chord[stepInMeasure % 4];
      const bassFreq = midiToFreq(bassNoteCode);

      // 왼손 반주는 멜로디를 방해하지 않도록 은은하고 부드러운 사인파(sine) 기법으로 블렌딩
      playTone(bassFreq, 0.23, 0.12, 'sine');

      currentStep++;
      
      if (currentStep < TOTAL_STEPS) {
        setPlaybackStep(currentStep);
        // 재생 헤드 위치에 맞추어 타임라인 뷰포트 자동 트래킹 스크롤
        if (timelineRef.current) {
          const scrollAmount = (currentStep / TOTAL_STEPS) * timelineRef.current.scrollWidth;
          timelineRef.current.scrollTo({ left: scrollAmount - 100, behavior: 'smooth' });
        }
      } else {
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
          playbackIntervalRef.current = null;
        }
        setPlaybackStep(null);
        showToast('✨ 전체 연주가 완료되었습니다!');
      }
    }, 250);

    playbackIntervalRef.current = intervalId;
  };

  const clearTimeline = () => {
    stopPlayback();
    setTimeline(Array.from({ length: TOTAL_STEPS }, () => []));
    setActiveStep(0);
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 멀티 트랙 MIDI 파일 추출 엔진 ---
  const exportToMIDI = () => {
    showToast('⚙️ 바이너리 멀티 트랙 데이터 연산 중...');

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

    const TICKS_PER_STEP = 48; 
    interface MidiEvent { type: number; tick: number; noteCode: number; channel: number; }
    
    const track1Events: MidiEvent[] = []; 
    const track2Events: MidiEvent[] = []; 

    timeline.forEach((notes, index) => {
      if (!notes || notes.length === 0) return;
      notes.forEach((note) => {
        const noteCode = getMidiNoteCode(note.pitchName, note.key.slice(-1), note.isBlack);
        const startTick = index * TICKS_PER_STEP;
        const endTick = (index + note.length) * TICKS_PER_STEP;
        
        track1Events.push({ type: 0x90, tick: startTick, noteCode, channel: 0 }); 
        track1Events.push({ type: 0x80, tick: endTick, noteCode, channel: 0 });   
      });
    });

    for (let measure = 0; measure < TOTAL_MEASURES; measure++) {
      const chord = CONSTANT_CHORDS[measure];
      for (let step = 0; step < STEPS_PER_MEASURE; step++) {
        const noteCode = chord[step % 4]; 
        const absoluteStep = (measure * STEPS_PER_MEASURE) + step;
        const startTick = absoluteStep * TICKS_PER_STEP;
        const endTick = startTick + TICKS_PER_STEP;

        track2Events.push({ type: 0x91, tick: startTick, noteCode, channel: 1 }); 
        track2Events.push({ type: 0x81, tick: endTick, noteCode, channel: 1 });   
      }
    }

    const buildTrackData = (events: MidiEvent[]) => {
      events.sort((a, b) => a.tick - b.tick || a.type - b.type);
      const track: number[] = [];
      let lastTick = 0;

      events.forEach(ev => {
        const delta = ev.tick - lastTick;
        writeVLQ(track, delta);
        track.push(ev.type, ev.noteCode, ev.type >= 0x90 ? 0x50 : 0x00); 
        lastTick = ev.tick;
      });

      writeVLQ(track, 0);
      track.push(0xFF, 0x2F, 0x00); 
      
      const len = track.length;
      return [0x4d, 0x54, 0x72, 0x6b, (len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff, ...track];
    };

    const track1Data = buildTrackData(track1Events);
    const track2Data = buildTrackData(track2Events);

    const header = [0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x01, 0x00, 0x02, 0x00, 0x30]; 
    const midiArray = new Uint8Array([...header, ...track1Data, ...track2Data]);
    
    setTimeout(() => {
      const blob = new Blob([midiArray], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, 'my_masterpiece_with_auto_band.mid');
      URL.revokeObjectURL(url);
      showToast('🎹 왼손 자동 반주 트랙 합성 완료! MIDI 파일이 추출되었습니다.');
    }, 1000); 
  };

  return (
    <div className="w-full mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6 select-none relative">
      
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="px-5 py-3 bg-slate-800 text-white rounded-lg shadow-2xl text-sm font-semibold tracking-wide flex items-center gap-2 border border-slate-700">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="text-center w-full flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-800">디지털 밴드 스튜디오</h2>
          <p className="text-sm text-slate-500 mt-1">4마디 스텝 시퀀서 및 알고리즘 기반 멀티 트랙 자동 반주 시스템</p>
        </div>
        <div className="flex gap-2">
          {/* [신규 추가] 실시간 연주 들어보기 제어 토글 버튼 */}
          <button 
            onClick={startPlayback} 
            className={`btn btn-sm font-bold px-4 shadow-md border-none ${
              playbackStep !== null ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {playbackStep !== null ? '⏹️ 정지' : '▶️ 들어보기'}
          </button>
          <button onClick={exportToMIDI} className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 border-none text-white font-bold px-4 shadow-md">
            MIDI 파일 추출
          </button>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500">타임라인 (4/4박자 4마디)</span>
          <button onClick={clearTimeline} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">전체 지우기</button>
        </div>
        
        <div 
          ref={timelineRef}
          className="flex overflow-x-auto w-full custom-scrollbar pb-2 snap-x snap-mandatory"
        >
          {Array.from({ length: TOTAL_MEASURES }).map((_, measureIdx) => (
            <div key={`measure-${measureIdx}`} className="flex-shrink-0 flex items-center snap-start">
              <div className="h-20 flex flex-col justify-between px-2 text-[10px] text-slate-400 font-mono border-r border-slate-200 mr-1">
                <span>M{measureIdx + 1}</span>
              </div>
              
              <div className="grid gap-1 mr-4" style={{ gridTemplateColumns: `repeat(${STEPS_PER_MEASURE}, minmax(40px, 40px))` }}>
                {Array.from({ length: STEPS_PER_MEASURE }).map((_, stepIdx) => {
                  const absoluteIdx = (measureIdx * STEPS_PER_MEASURE) + stepIdx;
                  const notes = timeline[absoluteIdx];
                  
                  if (notes === null) return null; 
                  
                  const isOccupied = notes.length > 0;
                  const spanLength = isOccupied ? notes[0].length : 1;
                  const isLastMeasureOverflow = absoluteIdx + spanLength > TOTAL_STEPS;
                  const adjustedSpan = isLastMeasureOverflow ? TOTAL_STEPS - absoluteIdx : spanLength;

                  // [시각적 타격감 교체] 들어보기 연주 중인 스텝은 초록색(emerald) 레이아웃으로 실시간 트래킹 하이라이팅 처리
                  const isCurrentPlaying = playbackStep !== null && playbackStep >= absoluteIdx && playbackStep < absoluteIdx + adjustedSpan;
                  const isActiveInput = activeStep === absoluteIdx;

                  return (
                    <div 
                      key={absoluteIdx}
                      onClick={() => { if(playbackStep === null) setActiveStep(absoluteIdx); }}
                      style={{ gridColumn: `span ${adjustedSpan}` }}
                      className={`h-16 flex flex-col items-center justify-center rounded border transition-all duration-100 ${
                        isCurrentPlaying 
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black scale-105 shadow-md z-10'
                          : isActiveInput 
                            ? 'bg-blue-100 border-primary shadow-inner scale-[1.02]' 
                            : isOccupied ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {isOccupied ? (
                        <div className={`text-xs font-bold text-center flex flex-col items-center ${isCurrentPlaying ? 'text-emerald-800' : 'text-indigo-700'}`}>
                          <span>{notes.map(n => n.nameName + (n.isBlack ? '#' : '')).join(',')}</span>
                          <span className={`text-[9px] mt-0.5 ${isCurrentPlaying ? 'text-emerald-500' : 'text-indigo-400 opacity-80'}`}>({adjustedSpan}칸)</span>
                        </div>
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isCurrentPlaying ? 'bg-emerald-400 scale-150' : 'bg-slate-200'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-slate-100 p-2 rounded-lg flex items-center justify-center gap-4 border border-slate-200 shadow-inner">
        <span className="text-xs font-bold text-slate-500">입력할 박자 선택:</span>
        <div className="btn-group flex gap-1">
          <button onClick={() => setSelectedLength(1)} className={`btn btn-sm ${selectedLength === 1 ? 'bg-slate-700 text-white hover:bg-slate-800' : 'btn-outline bg-white'}`}>8분 (1칸)</button>
          <button onClick={() => setSelectedLength(2)} className={`btn btn-sm ${selectedLength === 2 ? 'bg-slate-700 text-white hover:bg-slate-800' : 'btn-outline bg-white'}`}>4분 (2칸)</button>
          <button onClick={() => setSelectedLength(4)} className={`btn btn-sm ${selectedLength === 4 ? 'bg-slate-700 text-white hover:bg-slate-800' : 'btn-outline bg-white'}`}>2분 (4칸)</button>
          <button onClick={() => setSelectedLength(8)} className={`btn btn-sm ${selectedLength === 8 ? 'bg-slate-700 text-white hover:bg-slate-800' : 'btn-outline bg-white'}`}>온음표 (8칸)</button>
        </div>
      </div>

      <div className="w-full flex justify-center overflow-x-auto pb-4 custom-scrollbar bg-white rounded-lg border border-slate-100 p-2">
        <div className="flex relative min-w-max h-40 px-2 pt-2">
          {PIANO_NOTES.map((note, index) => {
            if (note.isBlack) {
              return (
                <button
                  key={note.key}
                  onMouseDown={() => { if(playbackStep === null) handleNoteInput(note); }}
                  className="w-6 h-24 bg-slate-800 border border-slate-900 rounded-b-md absolute z-20 hover:bg-primary transition-colors shadow-md"
                  style={{ left: `${(PIANO_NOTES.filter((n, i) => !n.isBlack && index > i).length * 48) - 4}px` }}
                />
              );
            } else {
              return (
                <button
                  key={note.key}
                  onMouseDown={() => { if(playbackStep === null) handleNoteInput(note); }}
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
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; border: 2px solid #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}