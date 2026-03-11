import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plays } from '@/data/plays';
import TacticalPitch from '@/components/TacticalPitch';
// import HeatMap from '@/components/HeatMap';
import { Play } from 'lucide-react';

const PlayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const play = plays.find(p => p.id === id);

  if (!play) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Jugada no encontrada</p>
      </div>
    );
  }

  const related = plays.filter(p => p.tipo === play.tipo && p.id !== play.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-primary hover:underline transition-colors"
          >
            ← Volver a la base de datos
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column 60% */}
          <div className="lg:w-[60%] space-y-8">
            {/* Video placeholder */}
            <div className="relative rounded-md overflow-hidden bg-background border border-border" style={{ aspectRatio: '16/9', backgroundColor: '#000' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                    <path d="M0 0L20 12L0 24V0Z" fill="black" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-3 left-4 text-xs text-foreground/70">
                Partido referencia: {play.partido} — {play.fecha}
              </div>
              <div className="absolute bottom-3 right-4 text-xs text-foreground/70 mono">2:34</div>
              <span className="absolute top-3 right-3 tag-yellow text-[9px] tracking-wider">VÍDEO REAL</span>
            </div>
            <div className="flex gap-3">
              <button className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded transition-colors">⬇ Descargar clip</button>
              <button className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded transition-colors">↗ Pantalla completa</button>
            </div>

            {/* Tactical diagram */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">DIAGRAMA TÁCTICO</span>
              <div className="mt-3 rounded-md overflow-hidden border border-border">
                <TacticalPitch jugadores={play.jugadores} movimientos={play.movimientos} size="lg" showRoles />
              </div>
              <div className="flex gap-2 mt-3">
                <span className="tag-gray">{play.zona}</span>
                <span className="tag-gray">{play.tipo}</span>
                <span className="tag-gray">{play.jugadores.length} jugadores</span>
              </div>
            </div>

            {/* Heat map */}
            {/* <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">MAPA DE CALOR</span>
              <div className="mt-3 rounded-md overflow-hidden border border-border">
                <HeatMap tipo={play.tipo} />
              </div>
            </div> */}

            {/* Description */}
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">DESCRIPCIÓN TÉCNICA</span>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{play.descripcion}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-3">VENTAJAS</h4>
                  <ul className="space-y-2">
                    {play.ventajas.map((v, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5">✓</span> {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-3">RIESGOS</h4>
                  <ul className="space-y-2">
                    {play.riesgos.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-warning mt-0.5">✕</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right column 40% sticky */}
          <div className="lg:w-[40%]">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Identity card */}
              <div className="rounded-md border border-border p-6" style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}>
                <h2 className="text-2xl font-bold text-foreground">{play.nombre}</h2>
                <div className="flex gap-2 mt-3">
                  <span className="tag-yellow">{play.tipo}</span>
                  <span className="tag-yellow">{play.zona}</span>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground mt-4 border border-border px-3 py-1.5 rounded transition-colors">
                  ☆ Guardar jugada
                </button>
                <div className="mt-4 text-xs">
                  <span className="text-primary font-medium">{play.equipo}</span>
                  <span className="text-muted-foreground"> · {play.partido} · {play.fecha}</span>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  {[
                    { label: 'TIPO', value: play.tipo },
                    { label: 'ZONA', value: play.zona },
                    { label: 'DIFICULTAD', value: play.dificultad },
                    { label: 'JUGADORES', value: `${play.jugadores.length}` },
                    { label: 'SITUACIÓN', value: play.situacion },
                    { label: 'EQUIPO', value: play.equipo },
                  ].map((item, i) => (
                    <div key={i} className="rounded p-3" style={{ backgroundColor: 'hsl(0, 0%, 3.9%)' }}>
                      <span className="text-[9px] text-muted-foreground tracking-wider uppercase block">{item.label}</span>
                      <span className={`text-xs font-medium mt-1 block ${
                        item.label === 'DIFICULTAD'
                          ? item.value === 'Alta' ? 'text-danger' : item.value === 'Media' ? 'text-warning' : 'text-success'
                          : 'text-foreground'
                      }`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="rounded-md border border-border p-6" style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">VARIANTES</span>
                <div className="space-y-3 mt-4">
                  {play.variantes.map(v => (
                    <div key={v.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-10 h-8 rounded overflow-hidden shrink-0 border border-border">
                        <TacticalPitch jugadores={play.jugadores.slice(0, 4)} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{v.nombre}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{v.descripcion}</p>
                      </div>
                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Ver →</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-md border border-border p-6" style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">ETIQUETAS</span>
                <div className="flex flex-wrap gap-2 mt-4">
                  {play.etiquetas.map((tag, i) => (
                    <span key={i} className="tag-yellow">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related plays */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">JUGADAS RELACIONADAS</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {related.map(r => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/play/${r.id}`)}
                  className="rounded-md border border-border cursor-pointer card-hover overflow-hidden hover:border-primary"
                  style={{ backgroundColor: 'hsl(0, 0%, 6.7%)' }}
                >
                  <TacticalPitch jugadores={r.jugadores} movimientos={r.movimientos} size="sm" />
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-foreground">{r.nombre}</h4>
                    <div className="text-[10px] mt-1">
                      <span className="text-primary">{r.equipo}</span>
                      <span className="text-muted-foreground"> · {r.partido} · {r.fecha}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayDetail;
