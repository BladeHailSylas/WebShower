import React, { useRef, useState } from 'react';
import { INITIAL_PALETTE, GRID_SIZE, HEART_TEMPLATE } from '../../constants/pixelConstants';

export default function PixelStudio() {
  const [palette, setPalette] = useState<string[]>(INITIAL_PALETTE);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const [grid, setGrid] = useState<number[][]>(() => 
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
  );

  // 무음 환경을 위한 시각적 타격감(알림) 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- [그리기 로직] ---
  const drawPixel = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(arr => [...arr]);
      newGrid[row][col] = selectedColorIdx;
      return newGrid;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    drawPixel(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) drawPixel(row, col);
  };

  const handleMouseUp = () => setIsDrawing(false);
  const loadTemplate = () => { setGrid(HEART_TEMPLATE); showToast('❤️ 도안을 불러왔습니다.'); };
  const clearGrid = () => { setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))); showToast('🧹 캔버스가 초기화되었습니다.'); };

  const handleCustomColorChange = (indexToChange: number, newColorHex: string) => {
    setPalette((prev) => {
      const newPalette = [...prev];
      newPalette[indexToChange] = newColorHex;
      return newPalette;
    });
  };

  // 공통 다운로드 트리거 함수
  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- [확장 기능 1] 컴퓨터의 언어: JSON 데이터 내보내기 ---
  const exportToJSON = () => {
    const dataToSave = { palette, grid };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    // 텍스트 데이터를 Blob 객체로 변환하여 메모리 상의 파일로 취급
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    triggerDownload(url, 'pixel-data.json');
    URL.revokeObjectURL(url);
    showToast('💾 JSON 데이터 파일이 성공적으로 생성되었습니다!');
  };

  // --- [확장 기능 2] 컴퓨터의 기억 복구: JSON 데이터 불러오기 ---
  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const parsedData = JSON.parse(result);
          if (parsedData.grid && parsedData.palette) {
            setPalette(parsedData.palette);
            setGrid(parsedData.grid);
            showToast('✨ 컴퓨터가 기억하던 도안을 성공적으로 복원했습니다!');
          } else {
            showToast('⚠️ 올바르지 않은 JSON 포맷입니다.');
          }
        }
      } catch (error) {
        showToast('⚠️ 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    // 동일한 파일을 다시 불러올 수 있도록 input 초기화
    event.target.value = '';
  };

  // --- [확장 기능 3] 인간의 언어: 실물 PNG 파일 내보내기 ---
  const exportToPNG = () => {
    // SHOW STUDENTS: 1픽셀을 20배(20px)로 뻥튀기하여 고해상도(320x320) 이미지로 추출하는 핵심 변수
    const EXPORT_SCALE = 20; 
    
    const canvas = document.createElement('canvas');
    canvas.width = GRID_SIZE * EXPORT_SCALE;
    canvas.height = GRID_SIZE * EXPORT_SCALE;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 인덱스 데이터를 순회하며 Canvas에 직접 렌더링 매핑
    grid.forEach((row, rIndex) => {
      row.forEach((colorIdx, cIndex) => {
        if (colorIdx !== 0) { // 0번 인덱스(배경)는 투명하게 유지
          ctx.fillStyle = palette[colorIdx];
          ctx.fillRect(cIndex * EXPORT_SCALE, rIndex * EXPORT_SCALE, EXPORT_SCALE, EXPORT_SCALE);
        }
      });
    });

    const url = canvas.toDataURL('image/png');
    triggerDownload(url, 'my-pixel-art.png');
    showToast('🖼️ 고해상도 PNG 이미지 파일이 앨범에 저장되었습니다!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6 select-none relative">
      
      {/* 무음 환경 대체용 시각적 타격감 (Toast Notification) */}
      {toastMessage && (
        <div className="toast toast-top toast-center z-50 animate-fade-in-down">
          <div className="alert bg-slate-800 text-white shadow-xl rounded-lg font-medium text-sm">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">픽셀 아트 스튜디오</h2>
        <p className="text-sm text-slate-500 mt-1">팔레트 데이터 매핑 및 하이브리드 파일 추출 실험실</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start w-full justify-center">
        
        {/* [왼쪽 영역] 캔버스 및 그리기 컨트롤 */}
        <div className="flex flex-col gap-3">
          <div 
            className="border-2 border-slate-300 bg-white shadow-sm touch-none"
            onMouseLeave={handleMouseUp}
            style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, width: 'fit-content' }}
          >
            {grid.map((row, rowIndex) =>
              row.map((colorIndex, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  className="w-5 h-5 sm:w-6 sm:h-6 border-r border-b border-slate-100 last:border-r-0 cursor-crosshair transition-colors duration-75"
                  style={{ backgroundColor: palette[colorIndex] }}
                />
              ))
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={loadTemplate} className="btn btn-sm btn-outline btn-primary font-bold">하트 도안</button>
            <button onClick={clearGrid} className="btn btn-sm btn-ghost bg-slate-200 text-slate-600 font-bold">지우기</button>
          </div>
        </div>

        {/* [오른쪽 영역] 팔레트 에디터 및 추출 컨트롤 패널 */}
        <div className="flex flex-col gap-6 w-full max-w-sm">
          
          <div className="p-5 bg-white border border-slate-200 rounded-lg">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1"><span>🎨</span> 실시간 팔레트 커스텀</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {palette.map((color, index) => (
                <button
                  key={`select-${index}`}
                  onClick={() => setSelectedColorIdx(index)}
                  className={`w-8 h-8 rounded-md border-2 transition-transform ${
                    selectedColorIdx === index ? 'border-slate-800 scale-110 shadow-md' : 'border-slate-200'
                  } ${index === 0 ? 'bg-slate-100 border-dashed relative' : ''}`}
                  style={{ backgroundColor: index !== 0 ? color : 'transparent' }}
                  title={index === 0 ? '지우개' : `인덱스 ${index}`}
                >
                  {index === 0 && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400">지움</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {palette.map((color, index) => {
                if (index === 0) return null;
                return (
                  <div key={`edit-${index}`} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">인덱스 {index}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 uppercase w-16 text-right">{color}</span>
                      <input 
                        type="color" value={color} onChange={(e) => handleCustomColorChange(index, e.target.value)}
                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* [핵심 기능] 하이브리드 파일 관리 패널 */}
          <div className="p-5 bg-slate-200 border border-slate-300 rounded-lg text-white">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-1"><span>💾</span> 데이터 저장 및 변환</h3>
            <p className="text-[11px] text-slate-800 mb-4 leading-relaxed">
              작업물을 컴퓨터가 이해하는 데이터 구조(JSON)로 저장하거나, 실제 앨범에 소장할 수 있는 고해상도 그림(PNG)으로 변환합니다.
            </p>
            
            <div className="flex flex-col gap-2">
              <button onClick={exportToPNG} className="btn btn-sm btn-primary border-none text-white w-full">
                실물 소장용 이미지 (PNG) 다운로드
              </button>
              
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-600">
                <button onClick={exportToJSON} className="btn btn-sm btn-outline text-slate-800 border-slate-500 hover:bg-slate-700">
                  데이터로 저장
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-outline text-slate-800 border-slate-500 hover:bg-slate-700">
                  데이터 불러오기
                </button>
                <input 
                  type="file" accept=".json" ref={fileInputRef} onChange={importFromJSON} 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}