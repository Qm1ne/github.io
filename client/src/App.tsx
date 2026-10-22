import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { langBase, type Lang } from "@/lib/routing";
import Home from "@/pages/Home";
import ArticlePage from "@/pages/ArticlePage";
import NotFound from "@/pages/not-found";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
