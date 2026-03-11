import React from 'react';
import { Play } from '@/data/plays';
import TacticalPitch from './TacticalPitch';

interface PlayCardProps {
  play: Play;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
  disableSelect?: boolean;
  viewMode?: 'grid' | 'list';
}

const PlayCard: React.FC<PlayCardProps> = ({ play, isSelected, onSelect, onClick, disableSelect, viewMode = 'grid' }) => {
  const tipoBadge = play.tipo.includes('Ofensivo') || play.tipo.includes('Directa') ? 'OFENSIVO' : 'DEFENSIVO';

  if (viewMode === 'list') {
    return (
      <div
        className={`flex items-center gap-4 px-4 py-3 rounded-md border cursor-pointer card-hover group h-[120px] ${
          isSelected ? 'border-primary accent-glow' : 'border-border hover:border-primary'
        }`}
        style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}
        onClick={() => onClick(play.id)}
      >
        {/* Mini pitch */}
        <div className="w-16 h-12 flex-shrink-0 rounded overflow-hidden">
          <TacticalPitch jugadores={play.jugadores} movimientos={play.movimientos} size="sm" />
        </div>

        {/* Title + tags */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
              tipoBadge === 'OFENSIVO' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
            }`}>
              {tipoBadge}
            </span>
            <h3 className="text-sm font-bold text-foreground truncate">{play.nombre}</h3>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            <span className="text-primary font-medium">{play.equipo}</span>
            <span> · {play.partido} · {play.fecha}</span>
          </p>
        </div>

        {/* Meta right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="tag-gray hidden xl:block">{play.zona}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
            play.dificultad === 'Alta' ? 'bg-danger/20 text-danger' :
            play.dificultad === 'Media' ? 'bg-warning/20 text-warning' :
            'bg-success/20 text-success'
          }`}>
            {play.dificultad}
          </span>
          <span className="text-xs text-primary font-medium group-hover:underline hidden sm:block">Ver →</span>
          {/* Checkbox */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!disableSelect || isSelected) onSelect(play.id);
            }}
            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all flex-shrink-0 ${
              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50 bg-background/50 hover:border-foreground'
            }`}
          >
            {isSelected && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4L3 6L7 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md border cursor-pointer card-hover animate-fade-in overflow-hidden group ${
        isSelected ? 'border-primary accent-glow' : 'border-border hover:border-primary'
      }`}
      style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}
    >
      {/* Pitch */}
      <div className="relative" onClick={() => onClick(play.id)}>
        <TacticalPitch jugadores={play.jugadores} movimientos={play.movimientos} size="md" />
        <span className={`absolute top-2 left-2 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded ${
          tipoBadge === 'OFENSIVO' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
        }`}>
          {tipoBadge}
        </span>
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.stopPropagation();
            if (!disableSelect || isSelected) onSelect(play.id);
          }}
        >
          <div
            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/50 bg-background/50 hover:border-foreground'
            }`}
            title={disableSelect && !isSelected ? 'Máximo 2 jugadas para comparar' : ''}
          >
            {isSelected && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4L3 6L7 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4" onClick={() => onClick(play.id)}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="tag-yellow">{play.tipo}</span>
          <span className="tag-gray">{play.zona}</span>
          <span className="tag-gray">{play.dificultad}</span>
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">{play.nombre}</h3>
        <p className="text-xs text-muted-foreground italic line-clamp-1 mb-3">{play.descripcion}</p>
        <div className="text-xs">
          <span className="text-primary font-medium">{play.equipo}</span>
          <span className="text-muted-foreground"> · {play.partido} · {play.fecha}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">☆ Guardar</button>
          <span className="text-xs text-primary font-medium group-hover:underline">Ver jugada →</span>
        </div>
      </div>
    </div>
  );
};

export default PlayCard;