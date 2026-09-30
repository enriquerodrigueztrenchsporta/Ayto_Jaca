// Descarga fotografías de Wikimedia Commons con licencia libre y guarda su metadatos de autoría.
import fs from "node:fs";
const FILES = [
  ["hero-oroel", "File:Jaca a los pies de la peña Oroel.JPG", 2000],
  ["ciudadela", "File:Ciudadela Jaca Vista Aerea.JPG", 1400],
  ["crismon", "File:Crismón de Jaca (Catedral de Jaca, Huesca).jpg", 1400],
  ["puente-san-miguel", "File:Puente de San Miguel de Jaca. 3.jpg", 1400],
  ["calle-mayor", "File:Jaca - Calle Mayor 32.jpg", 1000],
  ["vista-oroel", "File:Jaca, view from Peña Oroel (1769m) 1.jpg", 1600],
  ["badaguas", "File:Badaguás . Peña Oroel. Jaca. Huesca. España.jpg", 1400],
  ["catedral-portico", "File:Pórtico de la portada sur (Catedral de Jaca).jpg", 1200],
];
const UA = "AytoJacaRedesignProposal/1.0 (research; contact via repository)";
const out = [];
for (const [key, title, width] of FILES) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=${width}&iiextmetadatafilter=LicenseShortName|LicenseUrl|Artist|Credit`;
  const j = await (await fetch(api, { headers: { "User-Agent": UA } })).json();
  const page = Object.values(j.query.pages)[0];
  const info = page.imageinfo[0];
  const m = info.extmetadata;
  const buf = Buffer.from(await (await fetch(info.thumburl, { headers: { "User-Agent": UA } })).arrayBuffer());
  const ext = info.thumburl.toLowerCase().endsWith(".png") ? "png" : "jpg";
  fs.writeFileSync(`public/images/${key}.${ext}`, buf);
  out.push({
    key, file: `/images/${key}.${ext}`, title, width: info.thumbwidth, height: info.thumbheight,
    author: (m.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim(),
    license: m.LicenseShortName?.value, licenseUrl: m.LicenseUrl?.value ?? null,
    sourceUrl: info.descriptionurl,
  });
  console.log(key, info.thumbwidth, info.thumbheight, m.LicenseShortName?.value, buf.length);
}
fs.writeFileSync("data/images.json", JSON.stringify(out, null, 2));
