import { RootRoute, Route, Router } from "@tanstack/react-router";

const rootRoute = new RootRoute();
const indexRoute = new Route({ getParentRoute: () => rootRoute, path: "/" });
const blogRoute = new Route({ getParentRoute: () => rootRoute, path: "blog" });
const postRoute = new Route({ getParentRoute: () => blogRoute, path: "$slug" });

const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute.addChildren([postRoute]),
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
