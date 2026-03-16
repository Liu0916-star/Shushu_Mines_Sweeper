import React, { useMemo } from 'react';
import Cell from './Cell';

export default function Board({ board, config, gameState, onCellClick, onCellRightClick, onChordClick, theme }) {
  const cellSize = useMemo(() => {
    // Responsive cell sizing
    const maxBoardWidth = Math.min(window.innerWidth - 40, 680);
    const maxBoardHeight = window.innerHeight - 320;
    const sizeByWidth = Math.floor(maxBoardWidth / config.cols);
    const sizeByHeight = Math.floor(maxBoardHeight / config.rows);
    return Math.max(24, Math.min(40, sizeByWidth, sizeByHeight));
  }, [config.rows, config.cols]);

  const gap = cellSize > 32 ? 4 : 3;

  return (
    <div className="flex justify-center">
      <div
        className="inline-grid p-3 md:p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-xl"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              row={r}
              col={c}
              onClick={onCellClick}
              onRightClick={onCellRightClick}
              onDoubleClick={onChordClick}
              gameState={gameState}
              cellSize={cellSize}
              theme={theme}
            />
          ))
        )}
      </div>
    </div>
  );
}