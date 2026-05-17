import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Infinity as InfinityIcon, ArrowLeft } from "lucide-react";

/**
 * 404 page mounted via `createRouter({ defaultNotFoundComponent: NotFound })`.
 *
 * Because TanStack Router's catch-all path can't emit per-route meta via `head()`
 * — the root route's head() runs and would otherwise advertise this URL as
 * `index, follow` — we imperatively patch `<title>` and inject a
 * `<meta name="robots" content="noindex,nofollow">` on mount. On unmount we
 * restore the previous robots directive (or remove the injected node) and the
 * prior document.title so subsequent in-app navigation isn't poisoned.
 *
 * Without this, search engines can index `/totally-made-up-url` with the
 * landing page's title and description, polluting SERPs and diluting authority.
 */
export function NotFound() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Page not found — Continuum";

    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    let prevContent: string | null = null;
    let createdNew = false;
    if (robotsMeta) {
      prevContent = robotsMeta.getAttribute("content");
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      robotsMeta.setAttribute("content", "noindex, nofollow");
      document.head.appendChild(robotsMeta);
      createdNew = true;
    }

    return () => {
      document.title = prevTitle;
      if (!robotsMeta) return;
      if (createdNew) {
        robotsMeta.parentNode?.removeChild(robotsMeta);
      } else if (prevContent !== null) {
        robotsMeta.setAttribute("content", prevContent);
      } else {
        robotsMeta.removeAttribute("content");
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <InfinityIcon className="w-9 h-9 text-foreground/70" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <p className="font-mono text-6xl font-bold text-foreground tabular-nums tracking-tight">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground tracking-tight" style={{ lineHeight: "1.2" }}>
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground" style={{ textWrap: "pretty" }}>
          The page you were looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-3 text-sm font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
