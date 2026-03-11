import React from 'react';

interface HeatMapProps {
  tipo: string;
  className?: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ tipo, className = '' }) => {
  const getHeatZones = () => {
    if (tipo.includes('Corner Ofensivo')) {
      return [
        { x: 80, y: 30, r: 60, color: 'rgba(239,68,68,0.5)' },
        { x: 75, y: 50, r: 45, color: 'rgba(249,115,22,0.4)' },
        { x: 65, y: 45, r: 35, color: 'rgba(234,179,8,0.3)' },
      ];
    }
    if (tipo.includes('Corner Defensivo')) {
      return [
        { x: 15, y: 40, r: 55, color: 'rgba(239,68,68,0.5)' },
        { x: 20, y: 55, r: 40, color: 'rgba(249,115,22,0.4)' },
        { x: 30, y: 45, r: 30, color: 'rgba(234,179,8,0.3)' },
      ];
    }
    if (tipo.includes('Falta Directa')) {
      return [
        { x: 85, y: 45, r: 50, color: 'rgba(239,68,68,0.5)' },
        { x: 75, y: 40, r: 40, color: 'rgba(249,115,22,0.4)' },
        { x: 70, y: 55, r: 30, color: 'rgba(234,179,8,0.3)' },
      ];
    }
    return [
      { x: 70, y: 45, r: 45, color: 'rgba(239,68,68,0.45)' },
      { x: 60, y: 40, r: 35, color: 'rgba(249,115,22,0.35)' },
      { x: 50, y: 50, r: 30, color: 'rgba(234,179,8,0.25)' },
    ];
  };

  const zones = getHeatZones();

  return (
    <div className={className}>
      <svg viewBox="0 0 480 340" className="w-full" style={{ backgroundColor: 'hsl(120, 100%, 5%)' }}>
        <defs>
          {zones.map((z, i) => (
            <radialGradient key={i} id={`heat-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={z.color} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          ))}
        </defs>

        {/* Pitch lines */}
        <g stroke="white" strokeOpacity="0.12" fill="none" strokeWidth="1">
          <rect x="4" y="4" width="472" height="332" />
          <line x1="240" y1="4" x2="240" y2="336" />
          <circle cx="240" cy="170" r="50" />
          <rect x="372" y="68" width="104" height="204" />
          <rect x="428" y="109" width="48" height="122" />
          <circle cx="408" cy="170" r="2" fill="white" fillOpacity="0.12" />
          <rect x="4" y="68" width="104" height="204" />
          <rect x="4" y="109" width="48" height="122" />
          <circle cx="72" cy="170" r="2" fill="white" fillOpacity="0.12" />
        </g>

        {/* Heat zones */}
        {zones.map((z, i) => (
          <ellipse
            key={i}
            cx={(z.x / 100) * 480}
            cy={(z.y / 100) * 340}
            rx={z.r}
            ry={z.r * 0.8}
            fill={`url(#heat-${i})`}
          />
        ))}
      </svg>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>🔴 Alta concentración</span>
        <span>🟠 Media</span>
        <span>🟡 Baja</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Zonas de mayor peligro en esta jugada</p>
    </div>
  );
};

export default HeatMap;
