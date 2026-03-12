// URL base de la API. Lee la variable de entorno VITE_API_URL del .env.local
// Si no existe esa variable, usa localhost:1337 (Strapi en local por defecto)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// ─────────────────────────────────────────────
// TIPOS DE DATOS
// Strapi devuelve los datos en un formato específico:
// { id: 1, attributes: { title: "...", ... } }
// Aquí definimos ese "molde" para que TypeScript sepa qué esperar
// ─────────────────────────────────────────────

// Representa una jugada tal como la devuelve Strapi
export interface StrapiPlay {
  id: number;
  attributes: {
    title: string;          // Nombre de la jugada
    video_url: string;      // URL del vídeo (Google Drive / Vimeo)
    description: string;    // Descripción técnica
    roles: string;          // Roles de los jugadores (texto enriquecido)
    variants: string;       // Variantes de la jugada (texto enriquecido)
    difficulty: 'Fácil' | 'Media' | 'Difícil'; // Solo estos 3 valores posibles
    ai_analysis: string;    // Análisis generado automáticamente por Gemini

    // El diagrama táctico es una imagen subida a Strapi
    // Puede ser null si no se ha subido ninguna imagen todavía
    tactical_diagram: {
      data: {
        attributes: {
          url: string; // URL de la imagen
        };
      } | null;
    };

    // Relaciones con otras tablas de Strapi
    // Cada una puede ser null si no tiene valor asignado
    abp_type: {
      data: { id: number; attributes: { name: string; slug: string } } | null;
    };
    zone: {
      data: { id: number; attributes: { name: string } } | null;
    };
    structure: {
      data: { id: number; attributes: { name: string } } | null;
    };
    // Tags es un array porque una jugada puede tener varios
    tags: {
      data: { id: number; attributes: { name: string; slug: string } }[];
    };
  };
}

// Molde genérico para cualquier respuesta de Strapi
// Strapi siempre devuelve { data: ..., meta: { pagination: ... } }
// <T> significa que funciona con cualquier tipo de dato (jugada, curso, etc.)
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;      // Página actual
      pageSize: number;  // Jugadas por página
      pageCount: number; // Total de páginas
      total: number;     // Total de jugadas
    };
  };
}

// ─────────────────────────────────────────────
// FUNCIONES DE CONSULTA A LA API
// ─────────────────────────────────────────────

// Obtiene TODAS las jugadas con sus relaciones
// populate= le dice a Strapi que incluya los datos relacionados
// (sin populate, abp_type solo devolvería el id, no el nombre)
export async function fetchPlays(): Promise<StrapiPlay[]> {
  const res = await fetch(
    `${BASE_URL}/api/abp-plays?populate=abp_type,zone,structure,tags,tactical_diagram`
  );
  if (!res.ok) throw new Error('Error al cargar jugadas');
  const json: StrapiResponse<StrapiPlay[]> = await res.json();
  return json.data;
}

// Obtiene UNA jugada por su ID
// Se usa en la página de ficha individual (PlayDetail.tsx)
export async function fetchPlayById(id: string | number): Promise<StrapiPlay> {
  const res = await fetch(
    `${BASE_URL}/api/abp-plays/${id}?populate=abp_type,zone,structure,tags,tactical_diagram`
  );
  if (!res.ok) throw new Error('Jugada no encontrada');
  const json: StrapiResponse<StrapiPlay> = await res.json();
  return json.data;
}

// Obtiene jugadas aplicando filtros
// Cada parámetro es opcional — solo se añade al query si tiene valor
// Se usará cuando conectemos el FilterPanel a la API real
export async function fetchPlaysByFilters(params: {
  difficulty?: string;  // 'Fácil' | 'Media' | 'Difícil'
  abp_type?: string;    // Nombre del tipo: 'Corner Ofensivo', etc.
  zone?: string;        // Nombre de la zona
  structure?: string;   // Nombre de la estructura táctica
  search?: string;      // Texto libre para buscar por título
}): Promise<StrapiPlay[]> {
  // URLSearchParams construye el string de filtros automáticamente
  // Ejemplo resultado: ?populate=...&filters[difficulty][$eq]=Media
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
    // $containsi = contiene el texto, sin distinguir mayúsculas/minúsculas
    query.append('filters[title][$containsi]', params.search);

  const res = await fetch(`${BASE_URL}/api/abp-plays?${query.toString()}`);
  if (!res.ok) throw new Error('Error al filtrar jugadas');
  const json: StrapiResponse<StrapiPlay[]> = await res.json();
  return json.data;
}

// ─────────────────────────────────────────────
// HELPERS — Funciones de utilidad
// ─────────────────────────────────────────────

// Extrae la URL de la imagen del diagrama táctico
// Strapi a veces devuelve rutas relativas (/uploads/imagen.jpg)
// y otras veces URLs completas (https://...)
// Esta función normaliza los dos casos devolviendo siempre una URL completa
export function getStrapiImageUrl(play: StrapiPlay): string | null {
  const url = play.attributes.tactical_diagram?.data?.attributes?.url;
  if (!url) return null; // Si no hay imagen, devuelve null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
}