import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, X, SlidersHorizontal } from 'lucide-react';
import { plays } from '@/data/plays';

export interface Filters {
  tipos: string[];
  dificultades: string[];
  zonas: string[];
  situaciones: string[];
  equipos: string[];
  objetivos: string[];
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

const tiposWithCounts = [
  { label: 'Corner Ofensivo', count: plays.filter(p => p.tipo === 'Corner Ofensivo').length },
  { label: 'Corner Defensivo', count: plays.filter(p => p.tipo === 'Corner Defensivo').length },
  { label: 'Falta Directa', count: plays.filter(p => p.tipo === 'Falta Directa').length },
  { label: 'Falta Indirecta', count: plays.filter(p => p.tipo === 'Falta Indirecta').length },
];

const zonas = [
  { value: 'Zona 1', label: 'Zona 1 · Área propia' },
  { value: 'Zona 2', label: 'Zona 2 · Campo propio' },
  { value: 'Zona 3', label: 'Zona 3 · Campo rival' },
  { value: 'Zona 4', label: 'Zona 4 · Área rival' },
];

const situaciones = ['Ganando', 'Perdiendo', 'Empate', 'Último cuarto'];
const dificultades = ['Baja', 'Media', 'Alta'];
const equipos = ['Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Manchester City', 'Liverpool'];
const objetivos = ['Remate directo', 'Bloqueo y desmarcada', 'Pase filtrado', 'Salida de balón'];

const Section: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const Checkbox: React.FC<{
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}> = ({ label, count, checked, onChange }) => (
  <label
    className="flex items-center gap-2 py-1 cursor-pointer group"
    onClick={(e) => { e.preventDefault(); onChange(); }}
  >
    <div
      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all flex-shrink-0 ${
        checked ? 'bg-primary border-primary' : 'border-muted-foreground/40 group-hover:border-muted-foreground'
      }`}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4L3 6L7 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className={`text-sm ${checked ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    {count !== undefined && (
      <span className="text-xs text-muted-foreground/60 ml-auto">({count})</span>
    )}
  </label>
);

// Contenido del panel — reutilizado en desktop y drawer
const FilterContent: React.FC<{
  filters: Filters;
  toggle: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  equipoSearch: string;
  setEquipoSearch: (v: string) => void;
  filteredEquipos: string[];
  hasFilters: boolean;
}> = ({ filters, toggle, onClear, equipoSearch, setEquipoSearch, filteredEquipos, hasFilters }) => (
  <>
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs font-semibold tracking-widest text-primary">FILTROS</span>
      {hasFilters && (
        <button onClick={onClear} className="text-xs text-primary hover:underline">
          Limpiar todo
        </button>
      )}
    </div>

    <Section title="TIPO DE ABP">
      {tiposWithCounts.map(t => (
        <Checkbox
          key={t.label}
          label={t.label}
          count={t.count}
          checked={filters.tipos.includes(t.label)}
          onChange={() => toggle('tipos', t.label)}
        />
      ))}
    </Section>

    <Section title="DIFICULTAD">
      <div className="flex gap-2">
        {dificultades.map(d => (
          <button
            key={d}
            onClick={() => toggle('dificultades', d)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              filters.dificultades.includes(d)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </Section>

    <Section title="ZONA DEL CAMPO">
      {zonas.map(z => (
        <Checkbox
          key={z.value}
          label={z.label}
          checked={filters.zonas.includes(z.value)}
          onChange={() => toggle('zonas', z.value)}
        />
      ))}
    </Section>

    <Section title="SITUACIÓN DE PARTIDO">
      {situaciones.map(s => (
        <Checkbox
          key={s}
          label={s}
          checked={filters.situaciones.includes(s)}
          onChange={() => toggle('situaciones', s)}
        />
      ))}
    </Section>

    <Section title="EQUIPO" defaultOpen={false}>
      <div className="relative mb-2">
        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={equipoSearch}
          onChange={(e) => setEquipoSearch(e.target.value)}
          placeholder="Buscar equipo..."
          className="w-full bg-secondary text-sm text-foreground placeholder:text-muted-foreground pl-7 pr-3 py-1.5 rounded border border-border focus:border-primary focus:outline-none transition-colors"
        />
      </div>
      {filteredEquipos.map(e => (
        <Checkbox
          key={e}
          label={e}
          checked={filters.equipos.includes(e)}
          onChange={() => toggle('equipos', e)}
        />
      ))}
    </Section>

    <Section title="OBJETIVO TÁCTICO">
      {objetivos.map(o => (
        <Checkbox
          key={o}
          label={o}
          checked={filters.objetivos.includes(o)}
          onChange={() => toggle('objetivos', o)}
        />
      ))}
    </Section>
  </>
);

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onClear }) => {
  const [equipoSearch, setEquipoSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = (key: keyof Filters, value: string) => {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const hasFilters = Object.values(filters).some(arr => arr.length > 0);
  const filteredEquipos = equipos.filter(e => e.toLowerCase().includes(equipoSearch.toLowerCase()));
  const activeCount = Object.values(filters).flat().length;

  const contentProps = { filters, toggle, onClear, equipoSearch, setEquipoSearch, filteredEquipos, hasFilters };

  return (
    <>
      {/* Desktop — siempre visible */}
      <div className="w-[280px] shrink-0 pr-6 hidden lg:block">
        <FilterContent {...contentProps} />
      </div>

      {/* Mobile/tablet — botón flotante */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 mr-2 px-4 py-2 rounded border border-border bg-card text-sm text-foreground hover:border-primary transition-colors">
          <SlidersHorizontal size={14} />
          Filtros
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Drawer overlay */}
      {drawerOpen && (
        <>
          {/* Fondo oscuro */}
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel lateral */}
          <div className="fixed top-0 left-0 h-full w-[300px] bg-background border-r border-border z-50 flex flex-col lg:hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="text-sm font-bold text-foreground">Filtros</span>
              <button onClick={() => setDrawerOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <FilterContent {...contentProps} />
            </div>
            <div className="px-6 py-4 border-t border-border">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded hover:opacity-90 transition-opacity"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterPanel;