import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Zap, Settings } from 'lucide-react';

const ICONS = {
  easy: Sparkles,
  medium: Zap,
  hard: Flame,
  custom: Settings,
};

const DESCRIPTIONS = {
  easy: '9×9 · 10颗雷',
  medium: '16×16 · 40颗雷',
  hard: '16×30 · 99颗雷',
  custom: '自定义',
};

export default function DifficultySelector({ difficulty, difficulties, onSelect, onCustom, theme }) {
  const themeColor = theme?.color || '#f43f5e';
  const themeGradient = theme?.gradient || 'from-rose-400 to-pink-400';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-5">
      {Object.entries(difficulties).map(([key, val]) => {
        const Icon = ICONS[key];
        const isActive = difficulty === key;
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(key)}
            className={`relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm border`}
            style={isActive ? {
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              backgroundImage: `linear-gradient(135deg, ${themeColor}dd, ${themeColor}aa)`,
              color: 'white',
              borderColor: themeColor,
              boxShadow: `0 4px 15px ${themeColor}40`
            } : {
              background: 'rgba(255,255,255,0.5)',
              borderColor: 'rgba(255,255,255,0.6)',
              color: '#475569'
            }}
          >
            <Icon className="w-4 h-4" style={{ color: isActive ? 'white' : themeColor }} />
            <span className="font-semibold">{val.label}</span>
            <span className="text-[10px]" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#94a3b8' }}>
              {DESCRIPTIONS[key]}
            </span>
          </motion.button>
        );
      })}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCustom}
        className="relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm bg-white/50 text-slate-600 hover:bg-white/70 border border-white/60 backdrop-blur-sm"
      >
        <Settings className="w-4 h-4" style={{ color: themeColor }} />
        <span className="font-semibold">自定义</span>
        <span className="text-[10px] text-slate-400">自定义</span>
      </motion.button>
    </div>
  );
}