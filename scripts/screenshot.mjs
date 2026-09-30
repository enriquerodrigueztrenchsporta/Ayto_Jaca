// Captura de pantalla para QA visual: node scripts/screenshot.mjs <ruta> <ancho> <archivo> [fullPage]
import { chromium } from "@playwright/test";
const [, , route = "/", width = "1440", out = "shot.png", full = "true"] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: full === "true" });
await browser.close();
