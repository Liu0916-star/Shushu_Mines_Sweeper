import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Heart, RotateCcw, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

export default function GameOverModal({ gameState, time, onReset, showDachshund, onDachshundClick }) {
  const isWon = gameState === 'won';
  const isLost = gameState === 'lost';

  useEffect(() => {
    if (isWon && !showDachshund) {
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ['#f43f5e', '#ec4899', '#f97316', '#fbbf24', '#a78bfa'];
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isWon, showDachshund]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}分${sec.toString().padStart(2, '0')}秒`;
  };

  return (
    <AnimatePresence>
      {((isWon && !showDachshund) || isLost) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={onReset}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 text-center max-w-sm w-full"
          >
            {isWon ? (
              <>
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 mb-4 shadow-lg"
                >
                  <PartyPopper className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  太棒了舒舒！🎉
                </h2>
                <p className="text-slate-500 mb-1">你成功排除了所有地雷！</p>
                <p className="text-rose-500 font-semibold mb-6">
                  用时 {formatTime(time)}
                </p>
                <div className="flex items-center justify-center gap-1 mb-6 text-rose-400">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Heart className="w-5 h-5 fill-rose-400" />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 mb-4 shadow-lg">
                  <Frown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  踩到雷啦～
                </h2>
                <p className="text-slate-500 mb-6">没关系，再来一次！</p>
              </>
            )}
            <Button
              onClick={onReset}
              className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white rounded-full px-8 py-2 shadow-lg shadow-rose-200/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              再来一局
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}