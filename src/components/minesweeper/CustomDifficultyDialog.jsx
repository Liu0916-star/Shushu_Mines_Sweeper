import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CustomDifficultyDialog({ isOpen, onClose, onApply }) {
  const [rows, setRows] = useState(16);
  const [cols, setCols] = useState(16);
  const [mines, setMines] = useState(40);

  const handleApply = () => {
    const maxMines = Math.floor((rows * cols) * 0.8);
    const finalMines = Math.min(Math.max(1, mines), maxMines);
    onApply({
      rows: Math.min(Math.max(5, rows), 30),
      cols: Math.min(Math.max(5, cols), 50),
      mines: finalMines,
      label: '自定义'
    });
    onClose();
  };

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
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 max-w-sm w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">自定义难度</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="rows" className="text-sm text-slate-600">行数 (5-30)</Label>
                <Input
                  id="rows"
                  type="number"
                  min="5"
                  max="30"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 5)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cols" className="text-sm text-slate-600">列数 (5-50)</Label>
                <Input
                  id="cols"
                  type="number"
                  min="5"
                  max="50"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 5)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mines" className="text-sm text-slate-600">
                  雷数 (1-{Math.floor((rows * cols) * 0.8)})
                </Label>
                <Input
                  id="mines"
                  type="number"
                  min="1"
                  max={Math.floor((rows * cols) * 0.8)}
                  value={mines}
                  onChange={(e) => setMines(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl shadow-lg"
                >
                  应用设置
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}