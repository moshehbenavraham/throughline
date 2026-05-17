import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "@/components/NotFound";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Render a dedicated 404 for unmatched URLs. The component imperatively
    // injects `robots: noindex, nofollow` on mount so unmatched URLs never
    // inherit the root route's index,follow directive — a TanStack Start
    // catch-all has no head() of its own.
    defaultNotFoundComponent: NotFound,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
