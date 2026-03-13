import React, { useState, useEffect } from 'react';
import { plays as localPlays } from '@/data/plays';
import { fetchPlays, StrapiPlay } from '@/lib/api';
import TacticalPitch from './TacticalPitch';

interface PlayOfMonthBannerProps {
  onNavigate: (id: string) => void;
}

function mapStrapiPlay(p: StrapiPlay) {
  return {
    id: String(p.id),
    nombre: p.attributes.title || '',
    tipo: p.attributes.abp_type?.data?.attributes?.name || '',
    zona: p.attributes.zone?.data?.attributes?.name || '',
    dificultad: p.attributes.difficulty || 'Media',
    descripcion: p.attributes.description || '',
    equipo: '',
    partido: '',
    fecha: '',
    jugadores: [],
    movimientos: [],
    esJugadaDelMes: false,
  };
}

const PlayOfMonthBanner: React.FC<PlayOfMonthBannerProps> = ({ onNavigate }) => {
  const [play, setPlay] = useState<any>(null);

  useEffect(() => {
    fetchPlays()
      .then(data => {
        if (data.length > 0) {
          // Strapi no tiene esJugadaDelMes todavía — usamos la primera jugada
          // Cuando el cliente defina cuál es la jugada del mes, Dev 2 añade ese campo
          setPlay(mapStrapiPlay(data[0]));
        }
      })
      .catch(() => {
        // Strapi no disponible — usar datos locales
        const local = localPlays.find(p => p.esJugadaDelMes);
        if (local) setPlay(local);
      });
  }, []);

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