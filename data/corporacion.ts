/**
 * Composición de la Corporación municipal tal y como figura en
 * https://www.jaca.es/ayuntamiento/gobierno.html (consulta 30/09/2026).
 * Información objetiva: nombres, grupo y cargo/delegación. Sin valoraciones.
 * Nota: la web oficial recoge "Dª. MARTA MORERNO" en una comisión (errata); se usa la forma correcta que aparece en el resto de la página.
 */
export const CORPORACION_SOURCE = "https://www.jaca.es/ayuntamiento/gobierno.html";
export const CORPORACION_VERIFIED_AT = "2026-09-30";

export type Member = { name: string; role: string };
export type Group = { name: string; members: Member[] };

export const GRUPOS: Group[] = [
  {
    name: "Grupo Municipal del Partido Popular",
    members: [
      { name: "Carlos Serrano Pérez", role: "Alcalde-Presidente" },
      { name: "Sergio Francisco Cajal Caballé", role: "Delegado de Salud y Deporte; Delegado de Urbanismo, Desarrollo Urbano, Rural y Medio Ambiente" },
      { name: "Susana Domingo Gibanel", role: "Delegada de Asuntos Generales y Recursos Humanos" },
      { name: "Andrea Vargas Sánchez", role: "Delegada de Cultura, Tradiciones y Festejos" },
      { name: "Daniel Ventura Ara", role: "Portavoz del grupo; Delegado de Hacienda, Patrimonio e Innovación" },
    ],
  },
  {
    name: "Grupo Municipal del PSOE",
    members: [
      { name: "Olvido Moratinos Gracia", role: "Portavoz del grupo" },
      { name: "Manuel Díez Casas", role: "Concejal" },
      { name: "M.ª José España Toledo", role: "Concejala" },
      { name: "Santiago Tomás Gracia", role: "Concejal" },
      { name: "María Quintela Matute", role: "Concejala" },
    ],
  },
  {
    name: "Grupo Municipal de CHA",
    members: [
      { name: "Laura Climente Laín", role: "Portavoz del grupo" },
      { name: "José María Martínez González", role: "Concejal" },
    ],
  },
  {
    name: "Grupo Partido Aragoneses – Plataforma Aragonesista",
    members: [
      { name: "Lucía Guillén Campo", role: "Portavoz del grupo; Delegada de Desarrollo, Promoción, Turismo y Comercio" },
      { name: "José Manuel de Prada Navarro", role: "Delegado de Fomento Económico, Empleo y Emprendimiento" },
    ],
  },
  {
    name: "Grupo Municipal Mixto",
    members: [
      { name: "Elena Betés Fabos (PAR)", role: "Concejala" },
      { name: "Marta Moreno Rodríguez (VOX)", role: "Delegada de Educación, Juventud y Bienestar Social" },
      { name: "Ana María Campoy Gaspar", role: "Concejala" },
    ],
  },
];

export const JUNTA_GOBIERNO: Member[] = [
  { name: "Carlos Serrano Pérez", role: "Alcalde-Presidente" },
  { name: "Lucía Guillén Campo", role: "1.ª Teniente de Alcalde" },
  { name: "Sergio Francisco Cajal Caballé", role: "2.º Teniente de Alcalde" },
  { name: "Daniel Ventura Ara", role: "3.er Teniente de Alcalde" },
  { name: "José Manuel de Prada Navarro", role: "Concejal" },
  { name: "Marta Moreno Rodríguez", role: "Concejala" },
];

export const COMISIONES: Array<{ name: string; president: string }> = [
  { name: "Cultura, Tradiciones y Festejos", president: "Andrea Vargas Sánchez" },
  { name: "Educación, Juventud y Bienestar Social", president: "Marta Moreno Rodríguez" },
  { name: "Salud y Deporte", president: "Sergio Francisco Cajal Caballé" },
  { name: "Urbanismo, Desarrollo Urbano, Rural y Medio Ambiente", president: "Sergio Francisco Cajal Caballé" },
  { name: "Hacienda, Patrimonio e Innovación", president: "Daniel Ventura Ara" },
  { name: "Asuntos Generales y Recursos Humanos", president: "Susana Domingo Gibanel" },
  { name: "Desarrollo, Promoción, Turismo y Comercio", president: "Lucía Guillén Campo" },
  { name: "Fomento Económico, Empleo y Emprendimiento", president: "José Manuel de Prada Navarro" },
];
