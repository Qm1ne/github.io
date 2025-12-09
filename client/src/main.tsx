import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import emailjs from "@emailjs/browser";
import App from "./App";
import "./index.css";

// Initialize EmailJS once at app startup
emailjs.init("bztEB7S1n0g91s85-");

createRoot(document.getElementById("root")!).render(
	<BrowserRouter basename={import.meta.env.BASE_URL}>
		<App />
	</BrowserRouter>,
);
