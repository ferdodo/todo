import { createRoot, type Root } from "react-dom/client";
import { App } from "./components/App";
import "../../ui/src/styles/token.css";
import "../../ui/src/styles/component.css";

const container: HTMLElement = document.createElement("div");
document.body.appendChild(container);
const root: Root = createRoot(container);
root.render(<App />);
