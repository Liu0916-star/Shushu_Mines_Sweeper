import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOUND_PACKS } from './useSound';
import { COMBO_STYLES } from './ComboEffect';

export default function EffectsSettingsDialog({ isOpen, onClose, settings, onSettingsChange, theme }) {
  const color = theme?.color || '#f43f5e';

  const update = (key, val) => onSettingsChange({ ...settings, [key]: val });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/60 w-full max-w-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">特效 & 音效设置</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sound Section */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                {settings.soundEnabled
                  ? <Volume2 className="w-4 h-4" style={{ color }} />
                  : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span className="font-semibold text-slate-700 text-sm">音效</span>
                <button
                  onClick={() => update('soundEnabled', !settings.soundEnabled)}
                  className="ml-auto text-xs px-3 py-1 rounded-full border transition-all"
                  style={settings.soundEnabled
                    ? { background: color, color: 'white', borderColor: color }
                    : { background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }}
                >
                  {settings.soundEnabled ? '开启' : '关闭'}
                </button>
              </div>
              {settings.soundEnabled && (
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(SOUND_PACKS).map(([key, pack]) => (
                    <button
                      key={key}
                      onClick={() => update('soundPack', key)}
                      className="py-2 px-3 rounded-xl text-xs font-medium border transition-all"
                      style={settings.soundPack === key
                        ? { background: color + '22', borderColor: color, color }
                        : { background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}
                    >
                      {pack.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Combo Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" style={{ color }} />
                <span className="font-semibold text-slate-700 text-sm">连击特效</span>
                <button
                  onClick={() => update('comboEnabled', !settings.comboEnabled)}
                  className="ml-auto text-xs px-3 py-1 rounded-full border transition-all"
                  style={settings.comboEnabled
                    ? { background: color, color: 'white', borderColor: color }
                    : { background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }}
                >
                  {settings.comboEnabled ? '开启' : '关闭'}
                </button>
              </div>
              {settings.comboEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(COMBO_STYLES).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => update('comboStyle', key)}
                      className="py-2 px-3 rounded-xl text-xs font-medium border transition-all"
                      style={settings.comboStyle === key
                        ? { background: color + '22', borderColor: color, color }
                        : { background: '#f8fafc', borderColor: '#e2e8f0', color: '#64748b' }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={onClose}
              className="w-full mt-6 rounded-full text-white"
              style={{ background: color }}
            >
              完成
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}