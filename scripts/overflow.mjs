import { chromium } from "@playwright/test";
const [, , route = "/", width = "1440"] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const out = [];
  for (const el of document.querySelectorAll("body *")) { const rc = el.getBoundingClientRect(); if (rc.right > W + 1 && rc.width > 0) out.push(`${el.tagName}.${(el.className?.baseVal ?? el.className ?? "").toString().slice(0,80)} right=${Math.round(rc.right)}`); }
  return { W, sw: document.documentElement.scrollWidth, out: out.slice(0, 12) }; });
console.log(JSON.stringify(r, null, 1)); await b.close();
