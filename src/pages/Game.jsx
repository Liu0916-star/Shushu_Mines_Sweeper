import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy, Lightbulb, Settings2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import useMinesweeper from '../components/minesweeper/useMinesweeper';
import Board from '../components/minesweeper/Board';
import GameHeader from '../components/minesweeper/GameHeader';
import DifficultySelector from '../components/minesweeper/DifficultySelector';
import GameOverModal from '../components/minesweeper/GameOverModal';
import Leaderboard from '../components/minesweeper/Leaderboard';
import CustomDifficultyDialog from '../components/minesweeper/CustomDifficultyDialog';
import ThemeSelector, { THEMES } from '../components/minesweeper/ThemeSelector';
import useSound from '../components/minesweeper/useSound';
import ComboEffect from '../components/minesweeper/ComboEffect';
import EffectsSettingsDialog from '../components/minesweeper/EffectsSettingsDialog';

export default function Game() {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [effectsDialogOpen, setEffectsDialogOpen] = useState(false);
  const [theme, setTheme] = useState('pink');
  const [combo, setCombo] = useState(0);
  const [effects, setEffects] = useState({
    soundEnabled: true,
    soundPack: 'cute',
    comboEnabled: true,
    comboStyle: 'hearts',
  });
  const comboTimerRef = useRef(null);

  const { playClick, playFlag, playWin, playLose, playCombo } = useSound(effects.soundPack, effects.soundEnabled);

  const {
    board,
    gameState,
    flagCount,
    time,
    difficulty,
    config,
    difficulties,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleChordClick,
    useHint,
  } = useMinesweeper();

  // Wrapped handlers with sound + combo
  const handleCellClickWithEffects = (row, col) => {
    const prevState = gameState;
    handleCellClick(row, col);
    playClick();
    // combo: reset timer on each click
    clearTimeout(comboTimerRef.current);
    setCombo(c => {
      const next = c + 1;
      if (next >= 2) playCombo(next);
      return next;
    });
    comboTimerRef.current = setTimeout(() => setCombo(0), 1200);
  };

  const handleCellRightClickWithEffects = (row, col) => {
    handleCellRightClick(row, col);
    playFlag();
  };

  // Play win/lose sounds on game state change
  useEffect(() => {
    if (gameState === 'won') { playWin(); setCombo(0); }
    if (gameState === 'lost') { playLose(); setCombo(0); }
    if (gameState === 'idle') setCombo(0);
  }, [gameState]);

  const { data: records = [] } = useQuery({
    queryKey: ['gameRecords'],
    queryFn: () => base44.entities.GameRecord.list('-time'),
    refetchInterval: gameState === 'won' ? 2000 : false,
  });

  const currentTheme = THEMES[theme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} relative overflow-hidden`}>
      {/* Decorative background blobs */}
      <div className={`absolute top-[-120px] left-[-80px] w-[400px] h-[400px] bg-gradient-to-br ${currentTheme.gradient} opacity-20 rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] bg-gradient-to-br ${currentTheme.gradient} opacity-20 rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${currentTheme.gradient} opacity-10 rounded-full blur-3xl pointer-events-none`} />
      
      <div className="relative z-10 flex flex-col items-center px-4 py-6 md:py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5" style={{ color: currentTheme.color, fill: currentTheme.color }} />
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: currentTheme.color }}>
              做给舒舒的专属扫雷
            </h1>
            <Heart className="w-5 h-5" style={{ color: currentTheme.color, fill: currentTheme.color }} />
          </div>
          <p className="text-sm font-medium tracking-wide" style={{ color: currentTheme.color, opacity: 0.7 }}>
            专属于你的小游戏 ✨
          </p>
          <p className="text-xs mt-1 font-medium" style={{ color: currentTheme.color, opacity: 0.6 }}>
            今天也要开心哦 💕
          </p>
        </motion.div>

        {/* Theme and Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex flex-col items-center gap-3"
        >
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              onClick={() => setLeaderboardOpen(true)}
              variant="outline"
              className="bg-white/60 hover:bg-white/80 rounded-full px-5 shadow-md"
              style={{ color: currentTheme.color, borderColor: currentTheme.color + '33' }}
            >
              <Trophy className="w-4 h-4 mr-2" />
              排行榜
            </Button>
            <Button
              onClick={useHint}
              disabled={gameState === 'won' || gameState === 'lost'}
              variant="outline"
              className="bg-white/60 hover:bg-white/80 rounded-full px-5 shadow-md disabled:opacity-50"
              style={{ color: currentTheme.color, borderColor: currentTheme.color + '33' }}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              提示
            </Button>
            <Button
              onClick={() => setEffectsDialogOpen(true)}
              variant="outline"
              className="bg-white/60 hover:bg-white/80 rounded-full px-5 shadow-md"
              style={{ color: currentTheme.color, borderColor: currentTheme.color + '33' }}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              特效
            </Button>
          </div>
        </motion.div>

        {/* Difficulty */}
        <DifficultySelector
          difficulty={difficulty}
          difficulties={difficulties}
          onSelect={(d) => resetGame(d)}
          onCustom={() => setCustomDialogOpen(true)}
          theme={currentTheme}
        />

        {/* Game Header */}
        <div className="w-full max-w-[700px]">
          <GameHeader
            time={time}
            flagCount={flagCount}
            mineCount={config.mines}
            gameState={gameState}
            onReset={() => resetGame()}
            theme={currentTheme}
          />
        </div>

        {/* Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Board
            board={board}
            config={config}
            gameState={gameState}
            onCellClick={handleCellClickWithEffects}
            onCellRightClick={handleCellRightClickWithEffects}
            onChordClick={handleChordClick}
            theme={currentTheme}
          />
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-xs text-slate-400 text-center"
        >
          左键点击翻开 · 右键或长按标记旗帜 · 双击快速翻开周围
        </motion.p>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        gameState={gameState}
        time={time}
        onReset={() => resetGame()}
      />

      {/* Leaderboard */}
      <Leaderboard
        records={records}
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />

      {/* Custom Difficulty Dialog */}
      <CustomDifficultyDialog
        isOpen={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        onApply={(cfg) => resetGame('custom', cfg)}
      />

      {/* Effects Settings Dialog */}
      <EffectsSettingsDialog
        isOpen={effectsDialogOpen}
        onClose={() => setEffectsDialogOpen(false)}
        settings={effects}
        onSettingsChange={setEffects}
        theme={currentTheme}
      />

      {/* Combo Effect */}
      <ComboEffect
        combo={combo}
        style={effects.comboStyle}
        color={currentTheme.color}
        enabled={effects.comboEnabled}
      />
    </div>
  );
}