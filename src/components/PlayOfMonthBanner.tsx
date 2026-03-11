import React from 'react';
import { plays, Play } from '@/data/plays';
import TacticalPitch from './TacticalPitch';

interface PlayOfMonthBannerProps {
  onNavigate: (id: string) => void;
}

const PlayOfMonthBanner: React.FC<PlayOfMonthBannerProps> = ({ onNavigate }) => {
  const play = plays.find(p => p.esJugadaDelMes);
  if (!play) return null;

  return (
    <div
      onClick={() => onNavigate(play.id)}
      className="mb-8 rounded-md overflow-hidden cursor-pointer card-hover border border-border hover:border-primary"
      style={{ backgroundColor: '#0f0f0a', borderLeft: '4px solid hsl(49, 100%, 50%)' }}
    >
      <div className="flex items-center gap-6 p-6">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">⭐ JUGADA DEL MES</span>
          <h2 className="text-xl font-bold text-foreground mt-2">{play.nombre}</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{play.descripcion}</p>
          <div className="mt-3 text-xs">
            <span className="text-primary font-medium">{play.equipo}</span>
            <span className="text-muted-foreground"> · {play.partido} · {play.fecha}</span>
          </div>
        </div>
        <div className="w-[200px] shrink-0 hidden md:block rounded overflow-hidden">
          <TacticalPitch jugadores={play.jugadores} movimientos={play.movimientos} size="md" />
        </div>
        <button className="shrink-0 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity hidden sm:block">
          Ver jugada →
        </button>
      </div>
    </div>
  );
};

export default PlayOfMonthBanner;
