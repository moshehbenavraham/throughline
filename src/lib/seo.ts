/**
 * Centralized SEO helpers for Continuum.
 *
 * - `SITE_URL` is the canonical origin used to absolutize OG/Twitter image URLs and
 *   build per-page canonical links. If you change the production hostname, update
 *   this single constant (and `public/sitemap.xml`).
 * - `buildHead({ title, description, path, noindex?, image?, ogType? })` returns a
 *   `{ meta, links }` object that the TanStack Router `head()` hook expects.
 *   Auth-walled detail routes should pass `noindex: true` so crawlers don't index
 *   the in-app shell.
 * - `buildSiteJsonLd()` returns a stringified WebSite + Organization +
 *   SoftwareApplication @graph for injection as `<script type="application/ld+json">`.
 */

export const SITE_URL = "https://continuum.app";
export const SITE_NAME = "Continuum";
export const SITE_DESCRIPTION =
  "A calm, focused habit tracker. Track streaks, visualize progress, and build your daily ritual.";
export const DEFAULT_OG_IMAGE = "/social-preview.svg";
export const TWITTER_HANDLE = "@MoshehAvraham";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;

export interface BuildHeadOptions {
  /** Full <title> string. Include the brand here, e.g. "Continuum — Insights". */
  title: string;
  /** Meta description (≤ ~160 chars recommended). Defaults to SITE_DESCRIPTION. */
  description?: string;
  /** Path-only string starting with `/`, e.g. `/login`. Used to build canonical/og:url. */
  path: string;
  /**
   * When true, emits `robots: "noindex, nofollow"` and skips canonical/og:url so the
   * page never enters a SERP. Use for auth-walled views (app shell, settings, etc.).
   */
  noindex?: boolean;
  /** Absolute or root-relative path to the OG image. Defaults to DEFAULT_OG_IMAGE. */
  image?: string;
  /** og:type override. Defaults to "website". */
  ogType?: string;
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const cleaned = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${cleaned}`;
}

export function buildHead(options: BuildHeadOptions): {
  meta: MetaEntry[];
  links: LinkEntry[];
} {
  const {
    title,
    description = SITE_DESCRIPTION,
    path,
    noindex = false,
    image = DEFAULT_OG_IMAGE,
    ogType = "website",
  } = options;

  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:image", content: imageUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:site", content: TWITTER_HANDLE },
  ];

  const links: LinkEntry[] = [];

  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({ property: "og:url", content: url });
    meta.push({ name: "twitter:url", content: url });
    links.push({ rel: "canonical", href: url });
  }

  return { meta, links };
}

export function buildSiteJsonLd(): string {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (web)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
