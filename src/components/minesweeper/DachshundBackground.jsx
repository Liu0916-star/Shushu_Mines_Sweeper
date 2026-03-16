import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DachshundBackground({ show, onClick }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -20, 0]
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 1.5, 
            ease: 'easeOut',
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          onClick={onClick}
          className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-40 cursor-pointer"
        >
      <svg
        viewBox="0 0 800 400"
        className="w-[90vw] h-auto max-w-[700px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dachshund Body */}
        <g>
          {/* Main body (long) */}
          <ellipse
            cx="400"
            cy="220"
            rx="280"
            ry="70"
            fill="#8B4513"
            opacity="0.9"
          />
          
          {/* Chest */}
          <ellipse
            cx="150"
            cy="230"
            rx="80"
            ry="75"
            fill="#A0522D"
            opacity="0.9"
          />
          
          {/* Head */}
          <ellipse
            cx="80"
            cy="200"
            rx="60"
            ry="55"
            fill="#A0522D"
            opacity="0.9"
          />
          
          {/* Snout */}
          <ellipse
            cx="35"
            cy="210"
            rx="35"
            ry="30"
            fill="#8B4513"
            opacity="0.9"
          />
          
          {/* Nose */}
          <circle
            cx="15"
            cy="210"
            r="8"
            fill="#2C1810"
          />
          
          {/* Eyes */}
          <circle cx="70" cy="190" r="8" fill="#2C1810" />
          <circle cx="72" cy="188" r="3" fill="white" opacity="0.8" />
          
          {/* Ear (left) */}
          <ellipse
            cx="65"
            cy="235"
            rx="25"
            ry="40"
            fill="#6B3410"
            opacity="0.9"
            transform="rotate(15 65 235)"
          />
          
          {/* Ear (right) */}
          <ellipse
            cx="95"
            cy="235"
            rx="25"
            ry="40"
            fill="#6B3410"
            opacity="0.9"
            transform="rotate(-15 95 235)"
          />
          
          {/* Legs */}
          {/* Front left leg */}
          <rect
            x="120"
            y="280"
            width="20"
            height="50"
            rx="10"
            fill="#6B3410"
            opacity="0.9"
          />
          
          {/* Front right leg */}
          <rect
            x="170"
            y="280"
            width="20"
            height="50"
            rx="10"
            fill="#6B3410"
            opacity="0.9"
          />
          
          {/* Back left leg */}
          <rect
            x="620"
            y="270"
            width="22"
            height="55"
            rx="11"
            fill="#6B3410"
            opacity="0.9"
          />
          
          {/* Back right leg */}
          <rect
            x="670"
            y="270"
            width="22"
            height="55"
            rx="11"
            fill="#6B3410"
            opacity="0.9"
          />
          
          {/* Tail */}
          <path
            d="M 680 210 Q 720 190 750 200 Q 770 205 780 215"
            stroke="#6B3410"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          
          {/* Belly spots */}
          <ellipse cx="300" cy="245" rx="40" ry="15" fill="#6B3410" opacity="0.3" />
          <ellipse cx="450" cy="250" rx="35" ry="12" fill="#6B3410" opacity="0.3" />
          <ellipse cx="550" cy="245" rx="30" ry="10" fill="#6B3410" opacity="0.3" />
          
          {/* Collar */}
          <rect
            x="110"
            y="205"
            width="60"
            height="12"
            rx="6"
            fill="#DC2626"
            opacity="0.9"
          />
          <circle cx="140" cy="211" r="6" fill="#FCD34D" />
        </g>
      </svg>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 text-white text-lg font-medium"
      >
        点击屏幕继续 ✨
      </motion.p>
    </motion.div>
      )}
    </AnimatePresence>
  );
}