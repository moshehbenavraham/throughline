import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { buildHead, buildSiteJsonLd, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => {
    const seo = buildHead({
      title: `${SITE_NAME} — Build lasting habits`,
      description: SITE_DESCRIPTION,
      path: "/",
    });

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "theme-color", content: "#FDAA3E" },
        { name: "author", content: SITE_NAME },
        ...seo.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        ...seo.links,
      ],
      scripts: [
        {
          // Anti-FOUC: resolve theme BEFORE paint. Honors stored preference when
          // present and falls back to prefers-color-scheme when not — matches the
          // useTheme hook so dark-OS users without an explicit choice get dark mode
          // immediately rather than flashing light. `color-scheme` is set so native
          // form controls and scrollbars track the theme too.
          children: `
            (function() {
              try {
                var stored = localStorage.getItem('continuum_theme');
                var theme = stored || 'system';
                if (theme === 'system') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var root = document.documentElement;
                if (theme === 'dark') {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
                root.style.colorScheme = theme;
              } catch (e) {}
            })();
          `,
        },
        {
          type: "application/ld+json",
          children: buildSiteJsonLd(),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="pb-[env(safe-area-inset-bottom)]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      {/* Skip-to-content link — visually hidden until focused. Lets keyboard users
          jump past the persistent navbar/bottom-nav straight to page content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <main id="main" className="animate-page-enter">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </>
  );
}
