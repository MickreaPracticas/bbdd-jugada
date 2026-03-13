import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, X, ChevronDown, Loader2 } from 'lucide-react';
import { plays as localPlays } from '@/data/plays';
import { fetchPlays, StrapiPlay } from '@/lib/api';
import FilterPanel, { Filters } from '@/components/FilterPanel';
import PlayCard from '@/components/PlayCard';
import PlayOfMonthBanner from '@/components/PlayOfMonthBanner';
import CompareBar from '@/components/CompareBar';

const ITEMS_PER_PAGE = 6;

type SortOption = 'reciente' | 'dificultad' | 'equipo' | 'nombre';

const emptyFilters: Filters = {
  tipos: [],
  dificultades: [],
  zonas: [],
  situaciones: [],
  equipos: [],
  objetivos: [],
};

const dificultadOrder: Record<string, number> = { 'Alta': 0, 'Difícil': 0, 'Media': 1, 'Baja': 2, 'Fácil': 2 };

// Convierte una jugada de Strapi al formato interno que usa el resto del código
// Cuando Strapi no tenga un campo (ej: equipo), usamos un valor vacío por defecto
function mapStrapiPlay(p: StrapiPlay) {
  return {
    id: String(p.id),
    nombre: p.attributes.title || '',
    tipo: p.attributes.abp_type?.data?.attributes?.name || '',
    zona: p.attributes.zone?.data?.attributes?.name || '',
    dificultad: p.attributes.difficulty || 'Media',
    descripcion: p.attributes.description || '',
    ai_analysis: p.attributes.ai_analysis || '',
    video_url: p.attributes.video_url || '',
    tactical_diagram: p.attributes.tactical_diagram?.data?.attributes?.url || null,
    etiquetas: p.attributes.tags?.data?.map(t => t.attributes.name) || [],
    // Campos que aún no tiene Strapi — se rellenarán cuando el cliente entregue su nomenclatura
    equipo: '',
    partido: '',
    fecha: '',
    situacion: '',
    jugadores: [],
    movimientos: [],
    variantes: [],
    ventajas: [],
    riesgos: [],
    esJugadaDelMes: false,
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('reciente');

  // Estado de los datos
  const [plays, setPlays] = useState(localPlays); // empieza con datos locales
  const [loading, setLoading] = useState(true);
  const [usingApi, setUsingApi] = useState(false);

  // Intenta cargar datos de Strapi al montar el componente
  // Si falla, se queda con los datos locales de plays.ts
  useEffect(() => {
    fetchPlays()
      .then(data => {
        if (data.length > 0) {
          setPlays(data.map(mapStrapiPlay) as any);
          setUsingApi(true);
        }
      })
      .catch(() => {
        // Strapi no está disponible — usamos datos locales sin mostrar error
        console.warn('API no disponible, usando datos locales');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const objetivoMap: Record<string, string[]> = {
      'Remate directo': ['remate', 'disparo', 'primer palo', 'segundo palo'],
      'Bloqueo y desmarcada': ['bloqueo', 'desmarque', 'pantalla', 'cortina'],
      'Pase filtrado': ['pases rápidos', 'tercer hombre', 'pases cortos', 'posesión'],
      'Salida de balón': ['salida de balón', 'posesión', 'campo propio'],
    };

    const result = plays.filter((p: any) => {
      if (filters.tipos.length && !filters.tipos.includes(p.tipo)) return false;
      if (filters.dificultades.length && !filters.dificultades.includes(p.dificultad)) return false;
      if (filters.zonas.length && !filters.zonas.includes(p.zona)) return false;
      if (filters.situaciones.length && !filters.situaciones.includes(p.situacion)) return false;
      if (filters.equipos.length && !filters.equipos.includes(p.equipo)) return false;
      if (filters.objetivos.length) {
        const etiquetasRelevantes = filters.objetivos.flatMap(o => objetivoMap[o] || []);
        const match = etiquetasRelevantes.some(e => p.etiquetas.includes(e));
        if (!match) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!p.nombre.toLowerCase().includes(q) && !p.descripcion.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    return [...result].sort((a: any, b: any) => {
      if (sortBy === 'reciente') return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      if (sortBy === 'dificultad') return dificultadOrder[a.dificultad] - dificultadOrder[b.dificultad];
      if (sortBy === 'equipo') return a.equipo.localeCompare(b.equipo);
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
      return 0;
    });
  }, [plays, filters, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Filters) => { setFilters(f); setPage(1); };
  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleSort = (value: SortOption) => { setSortBy(value); setPage(1); };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const activeFilterTags = useMemo(() => {
    const tags: { key: keyof Filters; value: string }[] = [];
    Object.entries(filters).forEach(([key, values]) => {
      (values as string[]).forEach(v => tags.push({ key: key as keyof Filters, value: v }));
    });
    return tags;
  }, [filters]);

  const removeFilterTag = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: prev[key].filter(v => v !== value) }));
    setPage(1);
  };

  const selectedPlays = plays.filter((p: any) => selectedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">ABP</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Especialista en ABP</h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Base de datos táctica</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
            <span className="text-foreground font-medium">BBDD</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Análisis</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Equipo</span>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PlayOfMonthBanner onNavigate={(id) => navigate(`/play/${id}`)} />

        {/* Indicador de fuente de datos — solo visible en desarrollo */}
        {!loading && (
          <div className="mb-4 text-[10px] text-muted-foreground/50">
            {usingApi ? '● Datos en tiempo real desde Strapi' : '● Usando datos locales (Strapi no disponible)'}
          </div>
        )}

        <div className="flex gap-0">
          <FilterPanel filters={filters} onChange={handleFilterChange} onClear={() => { setFilters(emptyFilters); setPage(1); }} />

          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Buscar jugada..."
                  className="w-full bg-card text-sm text-foreground placeholder:text-muted-foreground pl-9 pr-4 py-2.5 rounded border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="relative shrink-0">
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={e => handleSort(e.target.value as SortOption)}
                  className="appearance-none bg-card text-xs text-foreground pl-3 pr-7 py-2.5 rounded border border-border focus:border-primary focus:outline-none transition-colors cursor-pointer hover:border-primary"
                >
                  <option value="reciente">Más reciente</option>
                  <option value="dificultad">Dificultad</option>
                  <option value="equipo">Equipo</option>
                  <option value="nombre">Nombre</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                <span className="hidden sm:block">Mostrando {filtered.length} de {plays.length}</span>
                <div className="flex gap-1">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <LayoutGrid size={14} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            {activeFilterTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilterTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-primary/15 text-primary text-xs px-2.5 py-1 rounded font-medium">
                    {tag.value}
                    <button onClick={() => removeFilterTag(tag.key, tag.value)}><X size={10} /></button>
                  </span>
                ))}
                <button onClick={() => { setFilters(emptyFilters); setPage(1); }} className="text-xs text-primary hover:underline">Limpiar todo</button>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Cargando jugadas...</span>
              </div>
            ) : paginated.length > 0 ? (
              <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {paginated.map((play: any) => (
                  <PlayCard
                    key={play.id}
                    play={play}
                    isSelected={selectedIds.includes(play.id)}
                    onSelect={toggleSelect}
                    onClick={(id) => navigate(`/play/${id}`)}
                    disableSelect={selectedIds.length >= 2}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-sm">No se encontraron jugadas con los filtros seleccionados.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <span className="text-xs text-muted-foreground">{ITEMS_PER_PAGE} jugadas por página</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 text-xs rounded font-medium transition-all ${page === n ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{n}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CompareBar
        selected={selectedPlays}
        onRemove={(id) => setSelectedIds(prev => prev.filter(x => x !== id))}
        onCompare={() => navigate(`/compare/${selectedIds.join('-vs-')}`)}
        onCancel={() => setSelectedIds([])}
      />

      {selectedPlays.length > 0 && <div className="h-16" />}
    </div>
  );
};

export default Index;