import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flag, Bomb, Heart } from 'lucide-react';

const NUMBER_COLORS = [
  '',
  'text-blue-500',
  'text-emerald-600',
  'text-rose-500',
  'text-purple-700',
  'text-amber-700',
  'text-cyan-600',
  'text-slate-800',
  'text-slate-500',
];

export default function Cell({ cell, row, col, onClick, onRightClick, onDoubleClick, gameState, cellSize, theme }) {
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    onRightClick(row, col);
  }, [row, col, onRightClick]);

  const handleClick = useCallback(() => {
    onClick(row, col);
  }, [row, col, onClick]);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick(row, col);
  }, [row, col, onDoubleClick]);

  const isGameOver = gameState === 'won' || gameState === 'lost';
  const themeColor = theme?.color || '#f43f5e';

  if (cell.isRevealed) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm border select-none cursor-default"
        style={{ width: cellSize, height: cellSize, borderColor: themeColor + '33' }}
        onDoubleClick={handleDoubleClick}
      >
        {cell.isMine ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.4 }}
          >
            {gameState === 'won' ? (
              <Heart style={{ width: cellSize * 0.45, height: cellSize * 0.45, color: themeColor, fill: themeColor }} />
            ) : (
              <Bomb className="text-slate-700" style={{ width: cellSize * 0.45, height: cellSize * 0.45 }} />
            )}
          </motion.div>
        ) : cell.adjacentMines > 0 ? (
          <span className={`font-bold ${NUMBER_COLORS[cell.adjacentMines]}`} style={{ fontSize: cellSize * 0.45 }}>
            {cell.adjacentMines}
          </span>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={!isGameOver ? { scale: 1.08, y: -2 } : {}}
      whileTap={!isGameOver ? { scale: 0.92 } : {}}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      disabled={isGameOver}
      className="flex items-center justify-center rounded-lg select-none transition-shadow duration-200 backdrop-blur-sm border shadow-sm hover:shadow-md disabled:hover:shadow-sm disabled:hover:scale-100 active:shadow-inner"
      style={{ 
        width: cellSize, 
        height: cellSize,
        background: `linear-gradient(135deg, ${themeColor}33, ${themeColor}1a)`,
        borderColor: themeColor + '66'
      }}
    >
      {cell.isFlagged && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Flag style={{ width: cellSize * 0.4, height: cellSize * 0.4, color: themeColor, fill: themeColor, opacity: 0.9 }} />
        </motion.div>
      )}
    </motion.button>
  );
}