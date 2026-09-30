import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: false });

/**
 * Convierte el markdown escrito en el panel a HTML seguro (protección XSS).
 * Solo se permiten etiquetas de texto; los enlaces externos se abren con rel seguro.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  const raw = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(raw, {
    allowedTags: [
      "p", "br", "strong", "em", "b", "i", "u", "a", "ul", "ol", "li", "h2", "h3", "h4",
      "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td", "caption", "code", "pre", "abbr",
    ],
    allowedAttributes: { a: ["href", "title"], th: ["scope"], abbr: ["title"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: external ? { ...attribs, rel: "noopener noreferrer", target: "_blank" } : attribs,
        };
      },
      h1: "h2",
    },
  });
}
