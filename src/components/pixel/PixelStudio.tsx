import React, { useState } from 'react';
import { INITIAL_PALETTE, GRID_SIZE, HEART_TEMPLATE } from '../../constants/pixelConstants';

export default function PixelStudio() {
  const [palette, setPalette] = useState<string[]>(INITIAL_PALETTE);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const [grid, setGrid] = useState<number[][]>(() => 
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
  );

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

  const loadTemplate = () => setGrid(HEART_TEMPLATE);
  const clearGrid = () => setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)));

  // [핵심 추가] 사용자가 직접 팔레트의 색상을 변경하는 핸들러
  const handleCustomColorChange = (indexToChange: number, newColorHex: string) => {
    setPalette((prev) => {
      const newPalette = [...prev];
      newPalette[indexToChange] = newColorHex;
      return newPalette;
    });
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">픽셀 아트 스튜디오</h2>
        <p className="text-sm text-slate-500 mt-1">팔레트의 인덱스를 참조하여 그림을 그리는 데이터 매핑 실험실</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start w-full justify-center">
        {/* [왼쪽 영역] 캔버스 및 제어 버튼 */}
        <div className="flex flex-col gap-3">
          <div 
            className="border-2 border-slate-300 bg-white shadow-sm touch-none"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: 'fit-content'
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((colorIndex, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  className="w-5 h-5 sm:w-6 sm:h-6 border-r border-b border-slate-100 last:border-r-0 cursor-crosshair transition-colors duration-75"
                  style={{ backgroundColor: palette[colorIndex] }}
                />
              ))
            )}
          </div>
          
          <div className="flex gap-2 justify-center">
            <button onClick={loadTemplate} className="btn btn-sm btn-outline btn-primary font-bold">하트 도안 불러오기</button>
            <button onClick={clearGrid} className="btn btn-sm btn-ghost bg-slate-200 text-slate-600 font-bold">전체 지우기</button>
          </div>
        </div>

        {/* [오른쪽 영역] 팔레트 컨트롤 및 커스텀 에디터 */}
        <div className="flex flex-col gap-6 w-full max-w-xs p-5 bg-white border border-slate-200 rounded-lg">
          
          {/* 1. 그리기용 색상 선택 */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1">
              <span>🖌️</span> 사용 색상 선택
            </h3>
            <div className="flex flex-wrap gap-2">
              {palette.map((color, index) => (
                <button
                  key={`select-${index}`}
                  onClick={() => setSelectedColorIdx(index)}
                  className={`w-8 h-8 rounded-md border-2 transition-transform ${
                    selectedColorIdx === index ? 'border-slate-800 scale-110 shadow-md' : 'border-slate-200'
                  } ${index === 0 ? 'bg-slate-100 border-dashed relative' : ''}`}
                  style={{ backgroundColor: index !== 0 ? color : 'transparent' }}
                  title={index === 0 ? '지우개' : `${index}번째 색`}
                >
                  {index === 0 && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400">지움</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="divider m-0" />

          {/* 2. 실시간 커스텀 팔레트 에디터 (새로 추가된 기능) */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
              <span>⚙️</span> 팔레트 색상 변경
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              아래의 색상을 변경하면 캔버스에 그려진 색상도 실시간으로 바뀝니다.
            </p>
            <div className="flex flex-col gap-2">
              {palette.map((color, index) => {
                if (index === 0) return null; // 지우개(투명)는 색상 변경 대상에서 제외
                
                return (
                  <div key={`edit-${index}`} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-xs font-semibold text-slate-600">{index}번째 색</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 uppercase w-16 text-right">
                        {color}
                      </span>
                      {/* HTML5 기본 컬러 피커 활용 */}
                      <input 
                        type="color" 
                        value={color}
                        onChange={(e) => handleCustomColorChange(index, e.target.value)}
                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                        title={`인덱스 ${index} 색상 변경`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => setPalette(INITIAL_PALETTE)}
              className="btn btn-xs w-full btn-ghost text-slate-400 mt-3"
            >
              초기 색상으로 복구
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}