import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

const THEMES = {
  pink: {
    name: '粉色',
    gradient: 'from-rose-400 to-pink-400',
    bg: 'from-rose-50 to-pink-50',
    accent: 'rose',
    color: '#f43f5e'
  },
  white: {
    name: '白色',
    gradient: 'from-slate-200 to-slate-300',
    bg: 'from-slate-50 to-white',
    accent: 'slate',
    color: '#64748b'
  },
  black: {
    name: '黑色',
    gradient: 'from-slate-700 to-slate-900',
    bg: 'from-slate-100 to-slate-200',
    accent: 'slate',
    color: '#1e293b'
  },
  yellow: {
    name: '黄色',
    gradient: 'from-amber-400 to-yellow-400',
    bg: 'from-amber-50 to-yellow-50',
    accent: 'amber',
    color: '#f59e0b'
  },
  blue: {
    name: '蓝色',
    gradient: 'from-blue-400 to-cyan-400',
    bg: 'from-blue-50 to-cyan-50',
    accent: 'blue',
    color: '#3b82f6'
  }
};

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Palette className="w-4 h-4 text-slate-500" />
      <div className="flex gap-2">
        {Object.entries(THEMES).map(([key, theme]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onThemeChange(key)}
            className={`
              w-7 h-7 rounded-full border-2 transition-all
              ${currentTheme === key ? 'border-slate-800 shadow-lg' : 'border-white shadow-md'}
              bg-gradient-to-br ${theme.gradient}
            `}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}

export { THEMES };