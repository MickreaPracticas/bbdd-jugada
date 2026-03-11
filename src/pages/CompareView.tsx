import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plays } from '@/data/plays';
import TacticalPitch from '@/components/TacticalPitch';

const CompareView = () => {
  const { ids } = useParams();
  const navigate = useNavigate();

  const playIds = ids?.split('-vs-') || [];
  const playA = plays.find(p => p.id === playIds[0]);
  const playB = plays.find(p => p.id === playIds[1]);

  if (!playA || !playB) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No se encontraron las jugadas para comparar.</p>
      </div>
    );
  }

  const diffFields: { label: string; a: string; b: string }[] = [];
  if (playA.tipo !== playB.tipo) diffFields.push({ label: 'Tipo', a: playA.tipo, b: playB.tipo });
  if (playA.zona !== playB.zona) diffFields.push({ label: 'Zona', a: playA.zona, b: playB.zona });
  if (playA.dificultad !== playB.dificultad) diffFields.push({ label: 'Dificultad', a: playA.dificultad, b: playB.dificultad });
  if (playA.situacion !== playB.situacion) diffFields.push({ label: 'Situación', a: playA.situacion, b: playB.situacion });
  if (playA.equipo !== playB.equipo) diffFields.push({ label: 'Equipo', a: playA.equipo, b: playB.equipo });
  if (playA.jugadores.length !== playB.jugadores.length) diffFields.push({ label: 'Jugadores', a: `${playA.jugadores.length}`, b: `${playB.jugadores.length}` });

  const renderColumn = (play: typeof playA) => (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-bold text-foreground">{play.nombre}</h2>
      <div className="flex gap-2 mt-2">
        <span className="tag-yellow">{play.tipo}</span>
        <span className="tag-gray">{play.zona}</span>
      </div>
      <div className="mt-4 rounded-md overflow-hidden border border-border">
        <TacticalPitch jugadores={play.jugadores} movimientos={play.movimientos} size="lg" showRoles />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { label: 'TIPO', value: play.tipo },
          { label: 'ZONA', value: play.zona },
          { label: 'DIFICULTAD', value: play.dificultad },
          { label: 'JUGADORES', value: `${play.jugadores.length}` },
          { label: 'SITUACIÓN', value: play.situacion },
          { label: 'EQUIPO', value: play.equipo },
        ].map((item, i) => (
          <div key={i} className="rounded p-2.5" style={{ backgroundColor: 'hsl(0, 0%, 3.9%)' }}>
            <span className="text-[9px] text-muted-foreground tracking-wider uppercase block">{item.label}</span>
            <span className="text-xs font-medium text-foreground mt-0.5 block">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-foreground mb-2">VENTAJAS</h4>
        <ul className="space-y-1">
          {play.ventajas.map((v, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success">✓</span> {v}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-foreground mb-2">RIESGOS</h4>
        <ul className="space-y-1">
          {play.riesgos.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-warning">✕</span> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/')} className="text-sm text-primary hover:underline">← Volver</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-foreground mb-8">Comparación de jugadas</h1>
        <div className="flex gap-6">
          {renderColumn(playA)}
          <div className="w-px shrink-0" style={{ backgroundColor: 'hsl(0, 0%, 11.8%)' }} />
          {renderColumn(playB)}
        </div>

        {diffFields.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">DIFERENCIAS CLAVE</span>
            <div className="mt-4 rounded-md border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'hsl(0, 0%, 3.9%)' }}>
                    <th className="text-left text-[10px] text-muted-foreground tracking-wider uppercase p-3">Campo</th>
                    <th className="text-left text-[10px] text-muted-foreground tracking-wider uppercase p-3">{playA.nombre}</th>
                    <th className="text-left text-[10px] text-muted-foreground tracking-wider uppercase p-3">{playB.nombre}</th>
                  </tr>
                </thead>
                <tbody>
                  {diffFields.map((d, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="text-xs font-medium text-foreground p-3">{d.label}</td>
                      <td className="text-xs text-muted-foreground p-3">{d.a}</td>
                      <td className="text-xs text-muted-foreground p-3">{d.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareView;
