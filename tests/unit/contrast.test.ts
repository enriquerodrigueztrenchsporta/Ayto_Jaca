import { describe, expect, it } from "vitest";

/** Verifica los ratios de contraste WCAG 2.x de los pares de color documentados en docs/design-system.md. */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const SNOW = "#faf8f4";
const WHITE = "#ffffff";
const STONE100 = "#f1ede5";
const FOREST900 = "#12291f";

const TEXT_PAIRS: Array<[string, string, string]> = [
  ["ink sobre snow", "#1c211e", SNOW],
  ["ink-2 sobre white", "#3d4540", WHITE],
  ["muted sobre snow", "#5e655f", SNOW],
  ["muted sobre stone-100", "#5e655f", STONE100],
  ["forest-700 (enlaces/botones) sobre snow", "#1f4d3a", SNOW],
  ["snow sobre forest-700 (botón primario)", SNOW, "#1f4d3a"],
  ["earth (eyebrow) sobre snow", "#9a4a26", SNOW],
  ["slate sobre white", "#3b5162", WHITE],
  ["urgent sobre white", "#a3241a", WHITE],
  ["important sobre important-50", "#7a4f00", "#fbf2e0"],
  ["ok sobre ok-50", "#2f6b3a", "#e8f2ea"],
  ["stone-300 sobre forest-900 (pie)", "#cfc7b8", FOREST900],
  ["mist sobre forest-900", "#a9c2b5", FOREST900],
  ["sand sobre forest-900", "#e8c9a0", FOREST900],
  ["forest-900 sobre sand (botón Sede)", FOREST900, "#e8c9a0"],
];

describe("contraste de la paleta (WCAG AA ≥ 4.5:1)", () => {
  it.each(TEXT_PAIRS)("%s", (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
