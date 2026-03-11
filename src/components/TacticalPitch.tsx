import React from 'react';
import { Jugador } from '@/data/plays';

interface TacticalPitchProps {
  jugadores: Jugador[];
  movimientos?: { fromId: number; toX: number; toY: number }[];
  size?: 'sm' | 'md' | 'lg';
  showRoles?: boolean;
  className?: string;
}

const TacticalPitch: React.FC<TacticalPitchProps> = ({
  jugadores,
  movimientos = [],
  size = 'md',
  showRoles = false,
  className = '',
}) => {
  const dimensions = {
    sm: { width: 160, height: 120 },
    md: { width: 280, height: 200 },
    lg: { width: 480, height: 340 },
  };

  const { width, height } = dimensions[size];
  const playerRadius = size === 'sm' ? 6 : size === 'md' ? 8 : 12;
  const fontSize = size === 'sm' ? 5 : size === 'md' ? 7 : 10;
  const roleFontSize = size === 'sm' ? 4 : size === 'md' ? 5 : 8;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ backgroundColor: 'hsl(120, 100%, 5%)' }}
    >
      <defs>
        <marker
          id={`arrow-${size}`}
          markerWidth="6"
          markerHeight="4"
          refX="5"
          refY="2"
          orient="auto"
        >
          <polygon points="0 0, 6 2, 0 4" fill="hsl(49, 100%, 50%)" opacity="0.7" />
        </marker>
      </defs>

      {/* Pitch lines */}
      <g stroke="white" strokeOpacity="0.15" fill="none" strokeWidth="1">
        {/* Outline */}
        <rect x="4" y="4" width={width - 8} height={height - 8} />
        {/* Half line */}
        <line x1={width / 2} y1="4" x2={width / 2} y2={height - 4} />
        {/* Center circle */}
        <circle cx={width / 2} cy={height / 2} r={height * 0.15} />
        {/* Penalty area right */}
        <rect x={width - 4 - width * 0.22} y={height * 0.2} width={width * 0.22} height={height * 0.6} />
        {/* Goal area right */}
        <rect x={width - 4 - width * 0.1} y={height * 0.32} width={width * 0.1} height={height * 0.36} />
        {/* Penalty spot right */}
        <circle cx={width - 4 - width * 0.15} cy={height / 2} r="2" fill="white" fillOpacity="0.15" />
        {/* Penalty area left */}
        <rect x="4" y={height * 0.2} width={width * 0.22} height={height * 0.6} />
        {/* Goal area left */}
        <rect x="4" y={height * 0.32} width={width * 0.1} height={height * 0.36} />
        {/* Penalty spot left */}
        <circle cx={4 + width * 0.15} cy={height / 2} r="2" fill="white" fillOpacity="0.15" />
        {/* Corner arcs */}
        <path d={`M 4 ${4 + 8} A 8 8 0 0 1 ${4 + 8} 4`} />
        <path d={`M ${width - 4 - 8} 4 A 8 8 0 0 1 ${width - 4} ${4 + 8}`} />
        <path d={`M ${width - 4} ${height - 4 - 8} A 8 8 0 0 1 ${width - 4 - 8} ${height - 4}`} />
        <path d={`M ${4 + 8} ${height - 4} A 8 8 0 0 1 4 ${height - 4 - 8}`} />
      </g>

      {/* Movement arrows */}
      {movimientos.map((mov, i) => {
        const player = jugadores.find(j => j.id === mov.fromId);
        if (!player) return null;
        const fromX = (player.x / 100) * width;
        const fromY = (player.y / 100) * height;
        const toX = (mov.toX / 100) * width;
        const toY = (mov.toY / 100) * height;
        return (
          <line
            key={i}
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke="hsl(49, 100%, 50%)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
            markerEnd={`url(#arrow-${size})`}
          />
        );
      })}

      {/* Players */}
      {jugadores.map((j) => {
        const cx = (j.x / 100) * width;
        const cy = (j.y / 100) * height;
        const isAttacker = j.equipo === 'atacante';

        return (
          <g key={j.id}>
            <circle
              cx={cx}
              cy={cy}
              r={playerRadius}
              fill={isAttacker ? 'hsl(49, 100%, 50%)' : 'transparent'}
              stroke={isAttacker ? 'hsl(49, 100%, 50%)' : 'white'}
              strokeWidth={isAttacker ? 0 : 1.5}
              opacity={isAttacker ? 1 : 0.8}
            />
            <text
              x={cx}
              y={cy + fontSize * 0.35}
              textAnchor="middle"
              fill={isAttacker ? 'black' : 'white'}
              fontSize={fontSize}
              fontWeight="bold"
              fontFamily="Inter, sans-serif"
            >
              {j.numero}
            </text>
            {showRoles && j.rol && (
              <text
                x={cx}
                y={cy - playerRadius - 3}
                textAnchor="middle"
                fill="white"
                fontSize={roleFontSize}
                fontFamily="Inter, sans-serif"
                opacity="0.7"
              >
                {j.rol}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default TacticalPitch;
