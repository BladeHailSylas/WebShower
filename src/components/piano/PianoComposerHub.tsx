import { useState, useRef, useEffect } from 'react';
import { type NoteInfo, PIANO_NOTES } from '../../constants/pianoContants';

export interface ComposerNote extends NoteInfo {
  length: number; 
}

// 표준 MIDI 노트 번호 생성 헬퍼
const getMidiNoteCode = (pitchName: string, octave: string, isBlack: boolean): number => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const baseNote = notes.indexOf(pitchName + (isBlack ? '#' : ''));
  const oct = parseInt(octave, 10);
  return baseNote > -1 ? (oct + 1) * 12 + baseNote : 60;
};

// =================================================================
// SHOW STUDENTS: 규칙 기반 AI 화성학 엔진을 위한 지능형 코드 데이터 풀
// =================================================================
const CHORD_POOL = [
  { name: 'C Major',  pitches: ['C', 'E', 'G'], pattern: [48, 55, 64, 55] }, // C3, G3, E4, G3
  { name: 'D Minor',  pitches: ['D', 'F', 'A'], pattern: [50, 57, 65, 57] }, // D3, A3, F4, A3
  { name: 'E Minor',  pitches: ['E', 'G', 'B'], pattern: [52, 59, 67, 59] }, // E3, B3, G4, B3
  { name: 'F Major',  pitches: ['F', 'A', 'C'], pattern: [41, 48, 57, 48] }, // F2, C3, A3, C3
  { name: 'G Major',  pitches: ['G', 'B', 'D'], pattern: [43, 50, 59, 50] }, // G2, D3, B3, D3
  { name: 'A Minor',  pitches: ['A', 'C', 'E'], pattern: [45, 52, 60, 52] }, // A2, E3, C4, E3
];

export default function PianoComposerHub() {
  const TOTAL_MEASURES = 4;
  const STEPS_PER_MEASURE = 8;
  const TOTAL_STEPS = TOTAL_MEASURES * STEPS_PER_MEASURE;
  
  const [timeline, setTimeline] = useState<(ComposerNote[] | null)[]>(Array.from({ length: TOTAL_STEPS }, () => []));
  const [analyzedChords, setAnalyzedChords] = useState<string[]>(['C Major', 'C Major', 'C Major', 'C Major']);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [playbackStep, setPlaybackStep] = useState<number | null>(null); 
  const [selectedLength, setSelectedLength] = useState<number>(2); 
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =================================================================
  // CORE ALGORITHM: 가중치 기반 지능형 화음 분석 엔진 (Harmonizer)
  // =================================================================
  useEffect(() => {
    const newChords = Array.from({ length: TOTAL_MEASURES }).map((_, measureIdx) => {
      const scoreBoard: { [key: string]: number } = { 'C Major': 0, 'D Minor': 0, 'E Minor': 0, 'F Major': 0, 'G Major': 0, 'A Minor': 0 };
      const pitchWeights: { [key: string]: number } = {};

      // 1. 해당 마디 내부의 모든 음표를 순회하며 위치/길이 가중치 스코어링
      for (let stepIdx = 0; stepIdx < STEPS_PER_MEASURE; stepIdx++) {
        const absoluteIdx = (measureIdx * STEPS_PER_MEASURE) + stepIdx;
        const notes = timeline[absoluteIdx];

        if (notes && notes.length > 0) {
          // 규칙 A: 1번째 스텝(강박)과 5번째 스텝(중강박)에 위치한 음은 3배 가중치
          const positionWeight = (stepIdx === 0 || stepIdx === 4) ? 3 : 1;

          notes.forEach((note) => {
            const pName = note.pitchName; // 'C', 'D', 'E' 등
            // 규칙 B: 음표의 길이(length)에 정비례하여 누적 가중치 연산
            const totalWeight = positionWeight * note.length;
            pitchWeights[pName] = (pitchWeights[pName] || 0) + totalWeight;
          });
        }
      }

      // 2. 누적된 음계 점수를 바탕으로 코드 풀 대조 매칭 진행
      CHORD_POOL.forEach((chord) => {
        chord.pitches.forEach((pitch) => {
          if (pitchWeights[pitch]) {
            scoreBoard[chord.name] += pitchWeights[pitch];
          }
        });
      });

      // 3. 가장 높은 점수를 획득한 화음 선별 (동점 혹은 무음 시 C Major Fallback)
      let bestChordName = 'C Major';
      let maxScore = 0;
      
      Object.entries(scoreBoard).forEach(([chordName, score]) => {
        if (score > maxScore) {
          maxScore = score;
          bestChordName = chordName;
        }
      });

      return bestChordName;
    });

    setAnalyzedChords(newChords);
  }, [timeline]);

  // --- [오디오 출력 엔진] ---
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

  // --- [실시간 연주 들어보기 제어 엔진] ---
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
    showToast('🎶 분석된 AI 코드로 실시간 아르페지오 협연을 시작합니다!');

    const intervalId = setInterval(() => {
      if (currentStep >= TOTAL_STEPS) {
        stopPlayback();
        return;
      }

      // 1. 오른손 선율 실시간 재생
      const notes = timeline[currentStep];
      if (notes && notes.length > 0) {
        notes.forEach((note) => {
          playTone(note.frequency, note.length * 0.25, 0.25, 'triangle');
        });
      }

      // 2. 분석 엔진이 채택한 코드를 바탕으로 왼손 아르페지오 동적 합성 연주
      const measureIdx = Math.floor(currentStep / STEPS_PER_MEASURE);
      const stepInMeasure = currentStep % STEPS_PER_MEASURE;
      const currentChordName = analyzedChords[measureIdx];
      
      const targetChord = CHORD_POOL.find(c => c.name === currentChordName) || CHORD_POOL[0];
      const bassNoteCode = targetChord.pattern[stepInMeasure % 4];
      
      playTone(midiToFreq(bassNoteCode), 0.23, 0.14, 'sine');

      currentStep++;
      
      if (currentStep < TOTAL_STEPS) {
        setPlaybackStep(currentStep);
        if (timelineRef.current) {
          const scrollAmount = (currentStep / TOTAL_STEPS) * timelineRef.current.scrollWidth;
          timelineRef.current.scrollTo({ left: scrollAmount - 100, behavior: 'smooth' });
        }
      } else {
        if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
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

  // --- [지능형 멀티 트랙 MIDI 파일 내보내기 엔진] ---
  const exportToMIDI = () => {
    showToast('⚙️ 분석 알고리즘 기반 멀티 트랙 데이터 연산 중...');

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

    // 트랙 1: 오른손 커스텀 선율
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

    // 트랙 2: 선율을 역산 추적하여 매칭된 화음 아르페지오 합성
    for (let measure = 0; measure < TOTAL_MEASURES; measure++) {
      const currentChordName = analyzedChords[measure];
      const targetChord = CHORD_POOL.find(c => c.name === currentChordName) || CHORD_POOL[0];

      for (let step = 0; step < STEPS_PER_MEASURE; step++) {
        const noteCode = targetChord.pattern[step % 4]; 
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
      triggerDownload(url, 'intelligent_harmony_composition.mid');
      URL.revokeObjectURL(url);
      showToast('🎹 분석 매칭된 완벽한 2차 트랙 합성이 완료되었습니다!');
    }, 1000); 
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6 select-none relative">
      
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="px-5 py-3 bg-slate-800 text-white rounded-lg shadow-2xl text-sm font-semibold tracking-wide border border-slate-700">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="text-center w-full flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-800">지능형 밴드 크리에이터</h2>
          <p className="text-sm text-slate-500 mt-1">멜로디 수학적 역산 분석 및 규칙 기반 실시간 반주 매칭 스튜디오</p>
        </div>
        <div className="flex gap-2">
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

      {/* --- 작곡 스텝 시퀀서 및 AI 분석 화음 시각화 대시보드 --- */}
      <div className="w-full bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-3 shadow-inner">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500">타임라인 및 실시간 화성학 분석 결과</span>
          <button onClick={clearTimeline} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">전체 지우기</button>
        </div>
        
        <div 
          ref={timelineRef}
          className="flex overflow-x-auto w-full custom-scrollbar pb-2 snap-x snap-mandatory"
        >
          {Array.from({ length: TOTAL_MEASURES }).map((_, measureIdx) => (
            <div key={`measure-${measureIdx}`} className="shrink-0 flex flex-col snap-start bg-slate-50/50 p-2 rounded-lg border border-slate-100 mr-4">
              
              {/* [확장 연출 핵심] 컴퓨터가 분석해낸 화음 명칭 실시간 시각 표출 영역 */}
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[11px] font-mono font-bold text-slate-400">MEASURE {measureIdx + 1}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-black tracking-wide shadow-sm animate-fade-in-down">
                  🎸 {analyzedChords[measureIdx]}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${STEPS_PER_MEASURE}, minmax(42px, 42px))` }}>
                  {Array.from({ length: STEPS_PER_MEASURE }).map((_, stepIdx) => {
                    const absoluteIdx = (measureIdx * STEPS_PER_MEASURE) + stepIdx;
                    const notes = timeline[absoluteIdx];
                    
                    if (notes === null) return null; 
                    
                    const isOccupied = notes.length > 0;
                    const spanLength = isOccupied ? notes[0].length : 1;
                    const isLastMeasureOverflow = absoluteIdx + spanLength > TOTAL_STEPS;
                    const adjustedSpan = isLastMeasureOverflow ? TOTAL_STEPS - absoluteIdx : spanLength;

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
                              : isOccupied ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-100'
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

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar bg-white rounded-lg border border-slate-100 p-2">
        <div className="flex relative min-w-max h-40 px-2 pt-2">
          {PIANO_NOTES.map((note, index) => {
            if (note.isBlack) {
              return (
                <button
                  key={note.key}
                  onMouseDown={() => { if(playbackStep === null) handleNoteInput(note); }}
                  className="w-8 h-24 bg-slate-800 border border-slate-900 rounded-b-md absolute z-20 hover:bg-primary transition-colors shadow-md"
                  style={{ left: `${(PIANO_NOTES.filter((n, i) => !n.isBlack && index > i).length * 48) - 16}px` }}
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
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; border: 2px solid #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}