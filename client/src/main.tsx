import { createRoot, hydrateRoot } from "react-dom/client";
import emailjs from "@emailjs/browser";
import App from "./App";
import "./index.css";
import i18n from "./i18n";
import { langFromPath } from "./lib/routing";

// Initialize EmailJS once at app startup
emailjs.init("bztEB7S1n0g91s85-");

// Each language is served from its own URL, so the path decides the language.
const lang = langFromPath(window.location.pathname);
i18n.changeLanguage(lang);

const container = document.getElementById("root")!;

// Pages are pre-rendered at build time: hydrate that markup instead of
// throwing it away, and fall back to a client render for anything else.
if (container.firstElementChild) {
	hydrateRoot(container, <App lang={lang} />);
} else {
	createRoot(container).render(<App lang={lang} />);
}
