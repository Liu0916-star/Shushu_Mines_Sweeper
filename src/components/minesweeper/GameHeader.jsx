import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Flag, RotateCcw, Smile, Frown, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function GameHeader({ time, flagCount, mineCount, gameState, onReset, theme }) {
  const iconColor = theme?.color || '#f43f5e';
  const faceIcon = gameState === 'won'
    ? <PartyPopper className="w-5 h-5 text-amber-500" />
    : gameState === 'lost'
    ? <Frown className="w-5 h-5" style={{ color: iconColor }} />
    : <Smile className="w-5 h-5" style={{ color: iconColor }} />;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-lg mb-4">
      {/* Timer */}
      <div className="flex items-center gap-2 min-w-[80px]">
        <Timer className="w-4 h-4" style={{ color: iconColor }} />
        <span className="font-mono font-semibold text-slate-700 text-sm tracking-wider">
          {formatTime(time)}
        </span>
      </div>

      {/* Reset Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="rounded-full w-10 h-10 p-0 bg-white/60 hover:bg-white/80 border shadow-sm"
          style={{ borderColor: iconColor + '33' }}
        >
          {gameState === 'playing' || gameState === 'idle' ? (
            faceIcon
          ) : (
            <RotateCcw className="w-4 h-4 text-slate-600" />
          )}
        </Button>
      </motion.div>

      {/* Flag Counter */}
      <div className="flex items-center gap-2 min-w-[80px] justify-end">
        <Flag className="w-4 h-4" style={{ color: iconColor, fill: iconColor, opacity: 0.8 }} />
        <span className="font-mono font-semibold text-slate-700 text-sm tracking-wider">
          {String(mineCount - flagCount).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}