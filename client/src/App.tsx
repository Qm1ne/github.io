import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { langBase, slugsFor, type Lang } from "@/lib/routing";
import Home from "@/pages/Home";
import SolarInstallers from "@/pages/SolarInstallers";
import EnergyAuditors from "@/pages/EnergyAuditors";
import ArticlePage from "@/pages/ArticlePage";
import NotFound from "@/pages/not-found";

/**
 * The landing pages have a translated slug, so each one is registered under
 * every slug it is served from. The language still comes from the `/fr` prefix,
 * which the router strips before matching.
 */
const LANDING_ROUTES = [
  { paths: slugsFor("/solar-installers"), component: SolarInstallers },
  { paths: slugsFor("/energy-auditors"), component: EnergyAuditors },
];

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {LANDING_ROUTES.flatMap(({ paths, component }) =>
        paths.map((path) => (
          <Route key={path} path={path} component={component} />
        )),
      )}
      <Route path="/article/:slug" component={ArticlePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

interface AppProps {
  /** Language of the page being served, taken from the URL. */
  lang: Lang;
  /** Full path to render during pre-rendering, where there is no browser location. */
  ssrPath?: string;
}

function App({ lang, ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base={langBase(lang)} ssrPath={ssrPath}>
        <TooltipProvider>
          <Toaster />
          <Routes />
        </TooltipProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
