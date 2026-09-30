import data from "@/data/images.json";

export type SiteImage = {
  key: string;
  file: string;
  title: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
};

const IMAGES = data as SiteImage[];

const ALT: Record<string, string> = {
  "hero-oroel": "Vista de Jaca al atardecer con la Peña Oroel al fondo y los campos del valle",
  ciudadela: "Vista aérea de la Ciudadela de Jaca, fortaleza pentagonal rodeada de foso verde",
  crismon: "Crismón románico del tímpano de la Catedral de Jaca",
  "puente-san-miguel": "Puente medieval de San Miguel sobre el río Aragón",
  "calle-mayor": "Calle Mayor de Jaca con fachadas de piedra y balcones",
  "vista-oroel": "Jaca y el valle del Aragón vistos desde la cima de la Peña Oroel",
  badaguas: "El núcleo rural de Badaguás con la Peña Oroel detrás",
  "catedral-portico": "Pórtico de la portada sur de la Catedral de Jaca",
};

export function img(key: string) {
  const i = IMAGES.find((x) => x.key === key);
  if (!i) throw new Error(`Imagen no encontrada: ${key}`);
  return { ...i, alt: ALT[key] ?? i.title, credit: `Foto: ${i.author} · ${i.license} · Wikimedia Commons` };
}

export const ALL_IMAGES = IMAGES;
