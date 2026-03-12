const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Tipos que devuelve Strapi
export interface StrapiPlay {
  id: number;
  attributes: {
    title: string;
    video_url: string;
    description: string;
    roles: string;
    variants: string;
    difficulty: 'Fácil' | 'Media' | 'Difícil';
    ai_analysis: string;
    tactical_diagram: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    };
    abp_type: {
      data: { id: number; attributes: { name: string; slug: string } } | null;
    };
    zone: {
      data: { id: number; attributes: { name: string } } | null;
    };
    structure: {
      data: { id: number; attributes: { name: string } } | null;
    };
    tags: {
      data: { id: number; attributes: { name: string; slug: string } }[];
    };
  };
}

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Obtener todas las jugadas con relaciones populadas
export async function fetchPlays(): Promise<StrapiPlay[]> {
  const res = await fetch(
    `${BASE_URL}/api/abp-plays?populate=abp_type,zone,structure,tags,tactical_diagram`
  );
  if (!res.ok) throw new Error('Error al cargar jugadas');
  const json: StrapiResponse<StrapiPlay[]> = await res.json();
  return json.data;
}

// Obtener una jugada por ID
export async function fetchPlayById(id: string | number): Promise<StrapiPlay> {
  const res = await fetch(
    `${BASE_URL}/api/abp-plays/${id}?populate=abp_type,zone,structure,tags,tactical_diagram`
  );
  if (!res.ok) throw new Error('Jugada no encontrada');
  const json: StrapiResponse<StrapiPlay> = await res.json();
  return json.data;
}

// Obtener jugadas filtradas
export async function fetchPlaysByFilters(params: {
  difficulty?: string;
  abp_type?: string;
  zone?: string;
  structure?: string;
  search?: string;
}): Promise<StrapiPlay[]> {
  const query = new URLSearchParams();
  query.append('populate', 'abp_type,zone,structure,tags,tactical_diagram');

  if (params.difficulty)
    query.append('filters[difficulty][$eq]', params.difficulty);
  if (params.abp_type)
    query.append('filters[abp_type][name][$eq]', params.abp_type);
  if (params.zone)
    query.append('filters[zone][name][$eq]', params.zone);
  if (params.structure)
    query.append('filters[structure][name][$eq]', params.structure);
  if (params.search)
    query.append('filters[title][$containsi]', params.search);

  const res = await fetch(`${BASE_URL}/api/abp-plays?${query.toString()}`);
  if (!res.ok) throw new Error('Error al filtrar jugadas');
  const json: StrapiResponse<StrapiPlay[]> = await res.json();
  return json.data;
}

// Helper: extraer URL de imagen de Strapi
export function getStrapiImageUrl(play: StrapiPlay): string | null {
  const url = play.attributes.tactical_diagram?.data?.attributes?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}