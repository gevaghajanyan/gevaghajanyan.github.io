import React, { useRef, useEffect } from 'react';
import { Game } from './Game';

interface Props { onClose(): void }

const closeBtn: React.CSSProperties = {
  position: 'fixed', top: 50, right: 12, zIndex: 10000,
  background: 'rgba(57,211,83,0.12)', border: '1px solid rgba(57,211,83,0.4)',
  color: '#39d353', padding: '4px 10px', borderRadius: 4,
  fontFamily: 'monospace', fontSize: 11, cursor: 'pointer',
  backdropFilter: 'blur(4px)',
};

export const SpaceShooterGame: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef  = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new Game(canvas, canvas.getContext('2d')!);
    void game.loadContributions();
    return game.start(() => closeRef.current());
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'block', cursor: 'none' }}
      />
      <button style={closeBtn} onClick={onClose}>✕ CLOSE</button>
    </>
  );
};
