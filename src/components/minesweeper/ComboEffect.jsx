import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMBO_STYLES = {
  stars: {
    name: '星星',
    render: (combo, color) => (
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 1, y: 0 }}
        animate={{ scale: 1.5, opacity: 0, y: -80 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="text-4xl">{'⭐'.repeat(Math.min(combo, 5))}</div>
          <div className="text-2xl font-bold mt-1" style={{ color }}>
            {combo >= 10 ? '超级连击！' : combo >= 5 ? '大连击！' : `${combo}连击！`}
          </div>
        </div>
      </motion.div>
    ),
  },
  fire: {
    name: '火焰',
    render: (combo, color) => (
      <motion.div
        key={combo}
        initial={{ scale: 0.3, opacity: 1, y: 20 }}
        animate={{ scale: 2, opacity: 0, y: -100 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="text-5xl">{'🔥'.repeat(Math.min(Math.ceil(combo / 2), 4))}</div>
          <div className="text-3xl font-black mt-1" style={{ color, textShadow: `0 0 20px ${color}` }}>
            x{combo}
          </div>
        </div>
      </motion.div>
    ),
  },
  hearts: {
    name: '爱心',
    render: (combo, color) => (
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 1, rotate: -10 }}
        animate={{ scale: 1.8, opacity: 0, y: -60, rotate: 10 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="text-center">
          <div className="text-4xl">{'💕'.repeat(Math.min(combo, 4))}</div>
          <div className="text-2xl font-bold mt-1" style={{ color }}>
            {combo}连击 💖
          </div>
        </div>
      </motion.div>
    ),
  },
  text: {
    name: '文字',
    render: (combo, color) => {
      const msgs = ['不错！', '很棒！', '太厉害了！', '无敌！', '神级操作！'];
      const msg = msgs[Math.min(Math.floor((combo - 2) / 2), msgs.length - 1)];
      return (
        <motion.div
          key={combo}
          initial={{ scale: 1, opacity: 1, y: 0, x: '-50%' }}
          animate={{ scale: 1.3, opacity: 0, y: -70, x: '-50%' }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed left-1/2 top-1/3 z-50 whitespace-nowrap"
        >
          <span className="text-3xl font-black drop-shadow-lg" style={{ color }}>
            {msg} ×{combo}
          </span>
        </motion.div>
      );
    },
  },
};

export { COMBO_STYLES };

export default function ComboEffect({ combo, style = 'stars', color = '#f43f5e', enabled = true }) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!enabled || combo < 2) return;
    setVisible(true);
    setKey(k => k + 1);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [combo, enabled]);

  const renderFn = COMBO_STYLES[style]?.render || COMBO_STYLES.stars.render;

  return (
    <AnimatePresence>
      {visible && renderFn(combo, color)}
    </AnimatePresence>
  );
}