import { useState, useCallback, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const DEFAULT_DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10, label: '简单' },
  medium: { rows: 16, cols: 16, mines: 40, label: '中等' },
  hard: { rows: 16, cols: 30, mines: 99, label: '困难' },
};

const DIFFICULTIES = { ...DEFAULT_DIFFICULTIES };

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
}

function placeMines(board, rows, cols, mines, firstRow, firstCol) {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newBoard[r][c].isMine && !(Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1)) {
      newBoard[r][c].isMine = true;
      placed++;
    }
  }
  // Calculate adjacent mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].adjacentMines = count;
    }
  }
  return newBoard;
}

function revealCell(board, rows, cols, row, col) {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const stack = [[row, col]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) continue;
    newBoard[r][c].isRevealed = true;
    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }
  return newBoard;
}

export default function useMinesweeper() {
  const [difficulty, setDifficulty] = useState('easy');
  const [customConfig, setCustomConfig] = useState(null);
  const [board, setBoard] = useState(() => createEmptyBoard(9, 9));
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const timerRef = useRef(null);

  const config = customConfig || DIFFICULTIES[difficulty];

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const resetGame = useCallback((diff, customCfg = null) => {
    const d = diff || difficulty;
    const cfg = customCfg || DIFFICULTIES[d];
    setDifficulty(d);
    setCustomConfig(customCfg);
    setBoard(createEmptyBoard(cfg.rows, cfg.cols));
    setGameState('idle');
    setFlagCount(0);
    setTime(0);
    setFirstClick(true);
    clearInterval(timerRef.current);
  }, [difficulty]);

  const checkWin = useCallback((b) => {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!b[r][c].isMine && !b[r][c].isRevealed) return false;
      }
    }
    return true;
  }, [config]);

  const saveRecord = useCallback(async (winTime) => {
    try {
      await base44.entities.GameRecord.create({
        difficulty,
        time: winTime,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  }, [difficulty]);

  const handleCellClick = useCallback((row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[row][col].isFlagged || board[row][col].isRevealed) return;

    let currentBoard = board;
    if (firstClick) {
      currentBoard = placeMines(board, config.rows, config.cols, config.mines, row, col);
      setFirstClick(false);
      setGameState('playing');
    }

    if (currentBoard[row][col].isMine) {
      // Reveal all mines
      const lostBoard = currentBoard.map(r => r.map(c => ({
        ...c,
        isRevealed: c.isMine ? true : c.isRevealed,
      })));
      setBoard(lostBoard);
      setGameState('lost');
      return;
    }

    const newBoard = revealCell(currentBoard, config.rows, config.cols, row, col);
    setBoard(newBoard);
    if (checkWin(newBoard)) {
      setGameState('won');
      saveRecord(time);
    }
  }, [board, gameState, firstClick, config, checkWin]);

  const handleCellRightClick = useCallback((row, col) => {
    if (gameState === 'won' || gameState === 'lost') return;
    if (board[row][col].isRevealed) return;
    
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    const wasFlagged = newBoard[row][col].isFlagged;
    newBoard[row][col].isFlagged = !wasFlagged;
    setBoard(newBoard);
    setFlagCount(f => wasFlagged ? f - 1 : f + 1);
  }, [board, gameState]);

  const handleChordClick = useCallback((row, col) => {
    if (gameState !== 'playing') return;
    const cell = board[row][col];
    if (!cell.isRevealed || cell.adjacentMines === 0) return;

    let flaggedCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          if (board[nr][nc].isFlagged) flaggedCount++;
        }
      }
    }

    if (flaggedCount !== cell.adjacentMines) return;

    let newBoard = board.map(r => r.map(c => ({ ...c })));
    let hitMine = false;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          if (!newBoard[nr][nc].isRevealed && !newBoard[nr][nc].isFlagged) {
            if (newBoard[nr][nc].isMine) {
              hitMine = true;
            }
            newBoard = revealCell(newBoard, config.rows, config.cols, nr, nc);
          }
        }
      }
    }

    if (hitMine) {
      const lostBoard = newBoard.map(r => r.map(c => ({
        ...c,
        isRevealed: c.isMine ? true : c.isRevealed,
      })));
      setBoard(lostBoard);
      setGameState('lost');
    } else {
      setBoard(newBoard);
      if (checkWin(newBoard)) {
        setGameState('won');
        saveRecord(time);
      }
    }
  }, [board, gameState, config, checkWin, saveRecord, time]);

  const useHint = useCallback(() => {
    if (gameState !== 'playing' && gameState !== 'idle') return;
    
    // Find all safe unrevealed cells
    const safeCells = [];
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!board[r][c].isRevealed && !board[r][c].isFlagged && !board[r][c].isMine) {
          safeCells.push([r, c]);
        }
      }
    }

    if (safeCells.length === 0) return;

    // Pick a random safe cell
    const [row, col] = safeCells[Math.floor(Math.random() * safeCells.length)];
    handleCellClick(row, col);
  }, [board, gameState, config, handleCellClick]);

  return {
    board,
    gameState,
    flagCount,
    time,
    difficulty,
    config,
    difficulties: DIFFICULTIES,
    resetGame,
    handleCellClick,
    handleCellRightClick,
    handleChordClick,
    saveRecord,
    useHint,
  };
}