import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const MEDAL_COLORS = [
  'text-amber-500',
  'text-slate-400',
  'text-orange-600',
];

const DIFFICULTY_LABELS = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Leaderboard({ records, isOpen, onClose }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const filteredRecords = records
    .filter(r => r.difficulty === selectedDifficulty)
    .sort((a, b) => a.time - b.time)
    .slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 max-w-md w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-400 to-pink-400 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">排行榜</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Difficulty Tabs */}
            <div className="flex gap-2 px-6 py-4 border-b border-rose-100">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedDifficulty === diff
                      ? 'bg-gradient-to-br from-rose-400 to-pink-400 text-white shadow-md'
                      : 'bg-rose-50 text-slate-600 hover:bg-rose-100'
                    }
                  `}
                >
                  {DIFFICULTY_LABELS[diff]}
                </button>
              ))}
            </div>

            {/* Records List */}
            <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">还没有记录哦～</p>
                  <p className="text-xs mt-1">快去创造第一个记录吧！</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRecords.map((record, index) => {
                    const Icon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Award : null;
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50/80 to-pink-50/80 border border-rose-100/50"
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {Icon ? (
                            <Icon className={`w-5 h-5 ${MEDAL_COLORS[index]}`} />
                          ) : (
                            <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-rose-400" />
                            <span className="font-mono font-bold text-slate-700">
                              {formatTime(record.time)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {format(new Date(record.date), 'yyyy/MM/dd HH:mm')}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}